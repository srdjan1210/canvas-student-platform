export class ReuploadTestFileCommand {
  constructor(
    public readonly authorized: number,
    public readonly title: string,
    public readonly testId: number,
    public readonly file: Buffer,
  ) {}
}
