export class UploadCourseFileCommand {
  constructor(
    public readonly courseName: string,
    public readonly filename: string,
    public readonly file: Buffer,
  ) {}
}
