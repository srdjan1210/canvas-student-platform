export class AddStudentsToCourseCommand {
  constructor(
    public readonly studentIds: number[],
    public readonly courseId: number,
  ) {}
}
