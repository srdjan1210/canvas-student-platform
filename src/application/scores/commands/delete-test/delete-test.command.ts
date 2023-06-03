export class DeleteTestCommand {
  constructor(
    public readonly authorized: number,
    public readonly testId: number,
  ) {}
}
