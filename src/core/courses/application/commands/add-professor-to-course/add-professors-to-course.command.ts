export class AddProfessorsToCourseCommand {
  constructor(
    public readonly professorIds: number[],
    public readonly courseId: number,
  ) {}
}
