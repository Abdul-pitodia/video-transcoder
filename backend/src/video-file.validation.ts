import { Injectable, BadRequestException } from '@nestjs/common';
import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class VideoFileValidator implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const allowedMimeTypes = [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-matroska', // MKV format
      'video/x-msvideo',  // AVI format
      'video/ogg',         // OGG format
      'video/3gpp',        // 3GP format
      'video/mpeg',        // MPEG format
      'video/x-flv',       // FLV format
      'application/octet-stream'
    ];

    const allowedExtensions = ['.mp4', '.webm', '.mkv', '.avi', '.ogg', '.3gp', '.mpeg', '.flv'];

    // Validate MIME Type
    if (value.mimetype && !allowedMimeTypes.includes(value.mimetype)) {
      throw new BadRequestException(`Invalid file type: ${value.mimetype}. Supported types are: ${allowedMimeTypes.join(', ')}`);
    }

    // Validate file extension if MIME type is unreliable (e.g., MKV with 'application/octet-stream')
    const fileExtension = extname(value.originalname).toLowerCase();
    if (value.mimetype === 'application/octet-stream' && !allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(`Invalid file extension: ${fileExtension}. Supported extensions are: ${allowedExtensions.join(', ')}`);
    }

    return value;
  }
}
