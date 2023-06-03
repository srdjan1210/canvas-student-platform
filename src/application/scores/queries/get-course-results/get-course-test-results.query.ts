export class GetCourseTestResultsQuery {
  constructor(
    public readonly authorized: number,
    public readonly courseId: number,
  ) {}
}
