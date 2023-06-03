export class CreateTestCommand {
  constructor(
    public readonly authorized: number,
    public readonly courseTitle: string,
    public readonly testName: string,
    public readonly description: string,
    public readonly points: number,
    public readonly deadlineForSubmission: Date,
  ) {}
}
