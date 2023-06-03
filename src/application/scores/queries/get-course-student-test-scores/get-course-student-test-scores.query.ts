export class GetCourseStudentTestScoresQuery {
  constructor(
    public readonly authorized: number,
    public readonly courseTitle: string,
    public readonly testId: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
