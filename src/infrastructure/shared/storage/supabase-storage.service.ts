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
import { FileTreeNode } from '../../../domain/courses/types/file-tree-node.type';
@Injectable()
export class SupabaseStorageService implements IStorageService {
  private readonly client: StorageClient;
  constructor(private readonly configService: ConfigService) {
    const storageUrl = configService.get(STORAGE_URL);
    const apiKey = configService.get(STORAGE_API_KEY);

    this.client = new StorageClient(storageUrl, {
      apikey: apiKey,
      Authorization: `Bearer ${apiKey}`,
    });
  }

  async getSignedDownloadLink(path: string): Promise<string> {
    const bucket = await this.getMainBucket();
    const resp = await bucket.createSignedUrl(path, 36000000, {
      download: true,
    });
    return resp.data.signedUrl;
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

  async createFolder(folder: string): Promise<string> {
    const bucket = await this.getMainBucket();
    const path = `${folder}/placeholder.txt`;
    const resp = await bucket.upload(path, 'temp');
    if (resp.error) throw new BadRequestException();
    return resp.data.path;
  }

  private getMainBucket() {
    return this.client.from(MAIN_BUCKET);
  }

  async deleteFolder(folder: string): Promise<void> {
    const bucket = await this.getMainBucket();
    const forDeleting = await this.findFileTree(folder);
    await bucket.remove(forDeleting);
  }
  async deleteFile(path: string): Promise<void> {
    const bucket = await this.getMainBucket();
    await bucket.remove([path]);
  }

  async findFileTree(folder: string): Promise<string[]> {
    const bucket = await this.getMainBucket();
    const items = await bucket.list(folder);
    const paths: string[] = [];
    for (const item of items.data) {
      if (item.metadata !== null) {
        paths.push(`${folder}/${item.name}`);
        continue;
      }
      const subFiles = await this.findFileTree(`${folder}/${item.name}`);
      paths.push(...subFiles);
    }
    return paths;
  }

  async listFileTree(folder: string): Promise<FileTreeNode[]> {
    const bucket = await this.getMainBucket();
    const items = await bucket.list(folder);
    const subfolders: FileTreeNode[] = [];
    await Promise.all(
      items.data.map(async (item) => {
        if (item.metadata !== null) {
          subfolders.push({
            subfolders: [],
            filename: item.name,
            type: 'file',
          });
          return;
        }
        const subs = await this.listFileTree(`${folder}/${item.name}`);

        subfolders.push({
          subfolders: subs,
          filename: item.name,
          type: 'folder',
        });
      }),
    );
    return subfolders;
  }
}
