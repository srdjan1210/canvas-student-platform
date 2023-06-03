import { FileTreeNode } from '../../../domain/courses/types/file-tree-node.type';

export interface IStorageService {
  uploadFile(file: Buffer, folder: string, filename: string): Promise<string>;
  downloadFile(path: string): Promise<ReadableStream<Uint8Array>>;
  listFolder(folder: string);
  getSignedDownloadLink(path: string): Promise<string>;
  createFolder(folder: string): Promise<string>;
  deleteFolder(folder: string): Promise<void>;
  deleteFile(path: string): Promise<void>;
  listFileTree(folder: string): Promise<FileTreeNode[]>;
}
