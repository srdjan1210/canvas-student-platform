export class UploadCourseFileCommand {
  constructor(
    public readonly professorId: number,
    public readonly courseId: number,
    public readonly filename: string,
    public readonly file: Buffer,
  ) {}
}
