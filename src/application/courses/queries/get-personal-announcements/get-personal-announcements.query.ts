export class GetPersonalAnnouncementsQuery {
  constructor(
    public readonly authorized: number,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
