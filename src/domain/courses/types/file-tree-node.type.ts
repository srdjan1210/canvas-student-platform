export type FileTreeNode = {
  filename: string;
  type: 'folder' | 'file';
  subfolders: FileTreeNode[];
};
