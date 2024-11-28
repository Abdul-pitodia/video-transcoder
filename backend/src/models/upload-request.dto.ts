import { Transform } from 'class-transformer';
import { IsIn, IsInt } from 'class-validator';

export class UploadRequestDto {
  @IsIn(['mp4', 'mkv', 'webm'], {
    message: 'Format must be one of mp4, mkv, or webm.',
  })
  format: string;

  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Resolution must be an integer' })
  @IsIn([480, 720, 1080], {
    message: 'Resolution must be one of 480, 720, or 1080.',
  })
  resolution: number;
}
