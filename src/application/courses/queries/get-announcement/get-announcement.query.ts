export class GetAnnouncementQuery {
  constructor(
    public readonly authenticated: number,
    public readonly title: string,
    public readonly id: number,
  ) {}
}
