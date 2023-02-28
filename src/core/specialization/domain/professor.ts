import { Course } from '../../courses/domain/course';
import { User } from '../../auth/domain/user';

export class Professor {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly title: string,
    public readonly user: User = null,
    public readonly courses: Course[] = [],
  ) {}

  static create(data: {
    id?: number;
    name?: string;
    surname?: string;
    title?: string;
    user?: User;
    courses?: Course[];
  }) {
    const id = data.id ?? null;
    const name = data.name ?? null;
    const surname = data.surname ?? null;
    const title = data.title ?? null;
    const courses = data.courses ?? [];
    const user = data.user ?? null;
    return new Professor(id, name, surname, title, user, courses);
  }
}
