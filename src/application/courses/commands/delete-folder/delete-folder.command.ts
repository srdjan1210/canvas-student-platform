import { User } from '../../../../domain/auth/user';

export class DeleteFolderCommand {
  constructor(
    public readonly authenticated: number,
    public readonly folder: string,
  ) {}
}
