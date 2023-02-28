import { Professor } from '../specialization/professor';

export class Announcement {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly body: string,
    public readonly professorId: number,
    public readonly professor: Professor = null,
  ) {}
}
