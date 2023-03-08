import { FileObject } from '@supabase/storage-js';

export class CourseFilePresenter {
  filename: string;
  type: 'folder' | 'file';
  metadata: any;
  constructor(file: FileObject) {
    this.filename = file.name;
    this.type = file.metadata ? 'file' : 'folder';
    this.metadata = file.metadata;
  }
}
