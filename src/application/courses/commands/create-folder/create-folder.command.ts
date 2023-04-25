export class CreateFolderCommand {
  constructor(
    public readonly authenticated: number,
    public readonly folder: string,
  ) {}
}
