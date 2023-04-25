export class DeleteFileCommand {
  constructor(
    public readonly authenticated: number,
    public readonly path: string,
  ) {}
}
