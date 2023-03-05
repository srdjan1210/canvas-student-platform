export class AddAnnouncementCommand {
  constructor(
    public readonly title: string,
    public readonly body: string,
    public readonly professorId: number,
    public readonly courseId: number,
  ) {}
}
