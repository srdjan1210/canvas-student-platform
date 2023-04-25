export class ListCourseFolderQuery {
  constructor(
    public readonly authenticated: number,
    public readonly folder: string,
  ) {}
}
