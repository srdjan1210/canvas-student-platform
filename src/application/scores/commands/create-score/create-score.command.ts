export class CreateScoreCommand {
  constructor(
    public readonly courseId: number,
    public readonly studentId: number,
    public readonly testId: number,
    public readonly points: number,
    public readonly file: File,
  ) {}
}
