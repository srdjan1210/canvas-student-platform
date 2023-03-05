import { Course } from '../../courses/course';
import { User } from '../../auth/user';

export class Professor {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly title: string,
    public readonly userId: number,
    public readonly user: User = null,
    public readonly courses: Course[] = [],
  ) {}
}
