import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Repository } from 'typeorm';
import { DeleteMessageCommand, Message, SQSClient } from '@aws-sdk/client-sqs';
import { VideoConversionStatus, VideoDetails } from 'src/models/video.entity';
import { AppConfigService } from './app.config.service';
import { fromIni } from '@aws-sdk/credential-provider-ini';

@Injectable()
export class VideoStatusService {
  private readonly sqs: SQSClient;

  constructor(
    @InjectRepository(VideoDetails)
    private videoDetailsRepository: Repository<VideoDetails>,
    private appConfigService: AppConfigService,
  ) {
    if (appConfigService.awsProfile && appConfigService.awsProfile !== '') {
      this.sqs = new SQSClient({
        region: appConfigService.awsRegion,
        credentials: fromIni({
          profile: appConfigService.awsProfile,
        }),
      });
    } else {
      this.sqs = new SQSClient({
        region: appConfigService.awsRegion,
      });
    }
  }

  @SqsMessageHandler(process.env.AWS_SQS_NAME, false)
  async handleMessage(message: Message) {
    console.log('Message received');

    try {
      const fileKey = JSON.parse(message.Body).Records[0].s3.object.key;
      const videoPath = fileKey.split('/');

      const videoId = videoPath[0];

      const updatedResult = await this.videoDetailsRepository.update(
        {
          uuid: videoId,
        },
        {
          status: VideoConversionStatus.COMPLETED,
          key: `${fileKey}`,
        },
      );

      // If update successfully done, delete the message before the visibility timeout expires
      // so that other consumers never see this message
      if (updatedResult.affected > 0) {
        console.log('Successfully updated status for video -> ' + videoId);

        const deleteResult = await this.sqs.send(
          new DeleteMessageCommand({
            QueueUrl: this.appConfigService.getSqsUrl,
            ReceiptHandle: message.ReceiptHandle,
          }),
        );

        if (deleteResult.$metadata.httpStatusCode == 200) {
          console.log('Message deleted successfully');
        }
      }
    } catch (err) {
      console.log('error while updating video conversion status' + err);
    }
  }
}
