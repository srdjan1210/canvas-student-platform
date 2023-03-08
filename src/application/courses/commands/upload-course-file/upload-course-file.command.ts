export class UploadCourseFileCommand {
  constructor(
    public readonly professorId: number,
    public readonly folder: string,
    public readonly filename: string,
    public readonly file: Buffer,
  ) {}
}
