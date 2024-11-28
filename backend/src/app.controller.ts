import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
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

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('fetchStatus')
  async fetchAllVideoConversionStatus(){
    return this.appService.fetchVideoStatusConversionAll();
  }

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
          maxSize: 20000000,
          message: (size) =>
            `Max video upload limit is of size: ${size / 1000000} bytes`,
        })
        .addFileTypeValidator({ fileType: 'video/*' })
        .build(),
    )
    video: Express.Multer.File,
    @Body() body: any,
  ) {
    const uploadRequestDto = plainToClass(UploadRequestDto, {
      ...body,
    });

    try {
      await validateOrReject(uploadRequestDto);
      await this.appService.uploadVideoToS3(video, uploadRequestDto);
    } catch (errors) {
      console.error('Validation errors:', errors);
      throw new BadRequestException(errors);
    }
  }
}
