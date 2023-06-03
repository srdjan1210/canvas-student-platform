export class GetCourseAnnouncementsQuery {
  constructor(
    public readonly authenticated: number,
    public readonly title: string,
  ) {}
}
