export class CreateCourseCommand {
  constructor(
    public readonly title: string,
    public readonly year: number,
    public readonly espb: number,
  ) {}
}
