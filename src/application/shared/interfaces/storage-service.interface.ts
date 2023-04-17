export interface IStorageService {
  uploadFile(file: Buffer, folder: string, filename: string): Promise<string>;
  downloadFile(path: string): Promise<ReadableStream<Uint8Array>>;
  listFolder(folder: string);
  getSignedDownloadLink(path: string): Promise<string>;
  createFolder(folder: string): Promise<string>;
  deleteFolder(folder: string): Promise<void>;
}
