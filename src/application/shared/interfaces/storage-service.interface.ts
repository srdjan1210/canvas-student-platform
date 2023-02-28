export interface IStorageService {
  uploadFile(file: Buffer, folder: string, filename: string): Promise<string>;
  downloadFile(path: string): Promise<ReadableStream<Uint8Array>>;
  listFolder(folder: string);
}
