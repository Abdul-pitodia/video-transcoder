import { Injectable } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { fromIni } from '@aws-sdk/credential-provider-ini';
import { v4 as uuid } from 'uuid';
import { AppConfigService } from './app.config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { VideoDetails, VideoDto } from 'src/models/video.entity';
import { DataSource, Repository } from 'typeorm';
import { UploadRequestDto } from 'src/models/upload-request.dto';

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

  async fetchVideoStatusConversionAll(): Promise<VideoDto[]>{
    const videoStatusList =
      await this.dataSource.getRepository(VideoDetails).createQueryBuilder("video").select(["video.uuid", "video.status", "video.originalName", "video.conversionFormat", "video.conversionResolution"]).getMany()

    return [...videoStatusList]
  }

  async uploadVideoToS3(
    video: Express.Multer.File,
    uploadRequestDto: UploadRequestDto,
  ) {
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
      } else {
        throw new Error(
          `File upload failed with status code: ${result.$metadata.httpStatusCode}`,
        );
      }
    } catch (err) {
      throw new Error(`Video upload to S3 failed due to ${err}`);
    }
  }

  generateS3FileName(
    uuid: string,
    uploadRequestDto: UploadRequestDto,
    originalName: string,
  ): string {
    // Extract file extension
    const fileExtension = originalName.split('.').pop();
    // Use UUID or timestamp as file name
    return `${uuid}/${uploadRequestDto.format}/${uploadRequestDto.resolution}/${Date.now()}.${fileExtension}`;
  }
}

