import { IStorageService } from '../../../application/shared/interfaces/storage-service.interface';
import { StorageClient } from '@supabase/storage-js';
import { ConfigService } from '@nestjs/config';
import {
  MAIN_BUCKET,
  MAIN_FOLDER_PATH,
  STORAGE_API_KEY,
  STORAGE_URL,
} from './storage.constants';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { BadRequestException } from '@nestjs/common';
@Injectable()
export class SupabaseStorageService implements IStorageService {
  private readonly client: StorageClient;
  constructor(private readonly configService: ConfigService) {
    const storageUrl = configService.get(STORAGE_URL);
    const apiKey = configService.get(STORAGE_API_KEY);
    console.log(storageUrl, apiKey);

    this.client = new StorageClient(storageUrl, {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    });
  }
  async uploadFile(
    file: Buffer,
    folder: string,
    filename: string,
  ): Promise<string> {
    const url = `${MAIN_FOLDER_PATH}/${folder}/${filename}`;
    const bucket = await this.getMainBucket();
    const resp = await bucket.upload(url, file);
    if (resp.error) throw new BadRequestException(resp.error);
    return resp.data.path;
  }

  async downloadFile(path: string): Promise<ReadableStream<Uint8Array>> {
    const bucket = await this.getMainBucket();
    const result = await bucket.download(path);
    return result.data.stream();
  }

  async listFolder(folder: string) {
    const bucket = await this.getMainBucket();
    const result = await bucket.list(folder);
    return result.data;
  }

  private getMainBucket() {
    return this.client.from(MAIN_BUCKET);
  }
}
