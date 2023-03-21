export class GetCourseProfessorsQuery {
  constructor(
    public readonly title: string,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
