export class UpdateScorePointsCommand {
  constructor(
    public readonly authorized: number,
    public readonly courseTitle: string,
    public readonly studentId: number,
    public readonly testId: number,
    public readonly points: number,
  ) {}
}
