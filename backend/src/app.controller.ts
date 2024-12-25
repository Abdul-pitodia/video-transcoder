import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Header,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './services/app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadRequestDto } from './models/upload-request.dto';
import { validateOrReject, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';
import { VideoFileValidator } from './video-file.validation';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fetchStatus')
  async fetchAllVideoConversionStatus() {
    return this.appService.fetchVideoStatusConversionAll();
  }

  @Get('getVideo/:id')
  async fetchVideoPresignedUrl(@Param('id') id: string) {
    return await this.appService.fetchVideoPresignedUrl(id);
  }

  @Get('getPlaylistFile/:id')
  @Header('Content-Type', 'application/octet-stream')
  async fetchPlaylistFileForLiveStreaming(@Param('id') id: string) {
    const playlistFile = await this.appService.fetchLivestreamingPlaylistFile(id)
    return playlistFile
  }

  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @Post('uploadVideo')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints).join(', ')
            : 'Invalid value';
          return `${error.property} - ${constraints}`;
        });
        return new BadRequestException(messages);
      },
    }),
  )
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 30000000,
          message: (size) =>
            `Max video upload limit is of size: ${size / 1000000} bytes`,
        })
        .build(),
        VideoFileValidator
    )
    video: Express.Multer.File,
    @Body() body: any,
  ) {
    const uploadRequestDto = plainToClass(UploadRequestDto, {
      ...body,
    });
    try {
      await validateOrReject(uploadRequestDto);
      return await this.appService.uploadVideoToS3(video, uploadRequestDto);
    } catch (errors) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(errors);
    }
  }
}
