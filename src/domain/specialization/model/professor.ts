import { Course } from '../../courses/course';
import { User } from '../../auth/user';

export class Professor {
  protected constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly title: string,
    public readonly userId: number,
    public readonly user: User = null,
    public readonly courses: Course[] = [],
  ) {}

  static create({
    id,
    name,
    surname,
    title,
    userId,
    user,
    courses = [],
  }: Partial<Professor>) {
    return new Professor(id, name, surname, title, userId, user, courses);
  }
}
