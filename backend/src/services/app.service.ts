import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { v4 as uuid } from 'uuid';
import { AppConfigService } from './app.config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoDetails, VideoDto } from 'src/models/video.entity';
import { DataSource, Repository } from 'typeorm';
import { UploadRequestDto } from 'src/models/upload-request.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

@Injectable()
export class AppService {
  private readonly s3: S3Client;

  constructor(
    private appConfigService: AppConfigService,
    @InjectRepository(VideoDetails)
    private videoDetailsRepository: Repository<VideoDetails>,
    private dataSource: DataSource,
  ) {
    if (appConfigService.awsProfile && appConfigService.awsProfile !== '') {
      this.s3 = new S3Client({
        region: appConfigService.awsRegion,
        credentials: fromIni({ profile: appConfigService.awsProfile }),
      });
    } else {
      this.s3 = new S3Client({ region: appConfigService.awsRegion });
    }
  }

  async fetchVideoStatusConversionAll(): Promise<VideoDto[]> {
    try {
      const videoStatusList = await this.dataSource
        .getRepository(VideoDetails)
        .createQueryBuilder('video')
        .select([
          'video.uuid',
          'video.status',
          'video.originalName',
          'video.conversionFormat',
          'video.conversionResolution',
        ])
        .getMany();

      return [...videoStatusList];
    } catch (err) {
      throw new InternalServerErrorException(
        `Unable to fetch video statuses , there is some error ${err}`,
      );
    }
  }

  async fetchVideoPresignedUrl(id: string): Promise<{ url: string }> {
    try {
      let video = await this.videoDetailsRepository.findOne({
        select: {
          key: true,
        },
        where: {
          uuid: id,
        },
      });

      const presignedUrl = await this.getPreSignedUrl(video.key, 180);

      return { url: presignedUrl };
    } catch (err) {
      throw new BadRequestException(
        `Error fetching url for video with id ${id}. It may not exist in database, or there is some other error ${err}`,
      );
    }
  }

  async fetchLivestreamingPlaylistFile(id: string): Promise<string> {
    try {
      const video = await this.videoDetailsRepository.findOne({
        where: {
          uuid: id,
        },
      });

      if (video.conversionFormat !== 'm3u8') {
        throw new BadRequestException(
          'The selected video is not converted to live streaming format',
        );
      }

      const m3u8File = await this.s3.send(
        new GetObjectCommand({
          Bucket: this.appConfigService.videoOutputBucket,
          Key: video.key,
        }),
      );

      const chunks: Uint8Array[] = [];
      for await (const chunk of m3u8File.Body as Readable) {
        chunks.push(chunk);
      }
      const m3u8Content = Buffer.concat(chunks).toString('utf-8');

      const lines = m3u8Content.split('\n');

      const modifiedLines: string[] = await Promise.all(
        lines.map(async (line) => {
          try {
            if (line.trim() && !line.startsWith('#')) {
              const chunkKey =
                video.key.substring(0, video.key.lastIndexOf('/') + 1) +
                line.trim();
              const signedUrlForChunkFile = await this.getPreSignedUrl(
                chunkKey,
                300,
              );
              return signedUrlForChunkFile;
            }
            return line;
          } catch (err) {
            throw new Error(
              'Unable to map content of m3u8 file to presigned URL',
            );
          }
        }),
      );

      return modifiedLines.join('\n');
    } catch (err) {
      throw new InternalServerErrorException(
        `Unable to fetch live streaming playlist file due to unknown error ${err}`,
      );
    }
  }

  async getPreSignedUrl(key: string, expires: number) {
    return getSignedUrl(
      this.s3,
      new GetObjectCommand({
        Bucket: this.appConfigService.videoOutputBucket,
        Key: key,
      }),
      {
        expiresIn: expires,
      },
    );
  }

  async uploadVideoToS3(
    video: Express.Multer.File,
    uploadRequestDto: UploadRequestDto,
  ): Promise<VideoDto> {
    try {
      // uuid for folder
      const folderUuidName = uuid();

      // name of the path where to upload the file
      const fileKey = this.generateS3FileName(
        folderUuidName,
        uploadRequestDto,
        video.originalname,
      );

      // upload received video
      const uploadFileS3Command = new PutObjectCommand({
        Bucket: this.appConfigService.videoStorageBucket,
        Key: fileKey,
        Body: video.buffer,
        ContentType: video.mimetype,
      });

      // video upload result
      const result = await this.s3.send(uploadFileS3Command);

      // Check if the upload was successful
      if (result.$metadata.httpStatusCode === 200 || 201 || 204) {
        const s3Url = `https://${this.appConfigService.videoStorageBucket}.s3.amazonaws.com/${fileKey}`;

        console.log(`File uploaded successfully`);

        // update the database for this video
        const savedVideo = await this.videoDetailsRepository.save({
          uuid: folderUuidName,
          url: s3Url,
          originalName: video.originalname,
          conversionFormat: uploadRequestDto.format,
          conversionResolution: uploadRequestDto.resolution,
        });

        return { ...savedVideo };
      } else {
        throw new InternalServerErrorException(
          `File upload failed with status code: ${result.$metadata.httpStatusCode}`,
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(
        `Video upload to S3 failed due to ${err}`,
      );
    }
  }

  generateS3FileName(
    uuid: string,
    uploadRequestDto: UploadRequestDto,
    originalName: string,
  ): string {
    // Extract file extension
    const fileExtension = originalName.split('.').pop();
    return `${uuid}/${uploadRequestDto.format}/${uploadRequestDto.resolution}/${Date.now()}.${fileExtension}`;
  }
}
