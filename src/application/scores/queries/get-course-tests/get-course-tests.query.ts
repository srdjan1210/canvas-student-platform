export class GetCourseTestsQuery {
  constructor(
    public readonly authorized: number,
    public readonly title: string,
  ) {}
}
