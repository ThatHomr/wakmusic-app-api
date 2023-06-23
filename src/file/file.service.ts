import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { getError } from 'src/utils/error.utils';
import * as vttParser from 'node-webvtt';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly r2Client: S3Client;

  constructor() {
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${process.env.R2_CLIENT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }

  async lyricsFindOne(key: string): Promise<vttParser.ParseResult | null> {
    try {
      const data = await this.r2Client.send(
        new GetObjectCommand({
          Bucket: process.env.R2_BUCKET_NAME,
          Key: `static/lyrics/${key}.vtt`,
        }),
      );
      const stringData = await data.Body.transformToString('utf-8');

      return vttParser.parse(stringData, { strict: false });
    } catch (error) {
      this.logger.error(getError(error));

      return null;
    }
  }
}
