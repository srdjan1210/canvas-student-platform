export class GetCourseStudentsQuery {
  constructor(
    public readonly courseTitle: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
