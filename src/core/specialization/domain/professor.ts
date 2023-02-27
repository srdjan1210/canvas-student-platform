import { Course } from '../../courses/domain/course';

export class Professor {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly title: string,
    public readonly courses: Course[] = [],
  ) {}

  static create(data: {
    id?: number;
    name?: string;
    surname?: string;
    title?: string;
    courses?: Course[];
  }) {
    const id = data.id ?? null;
    const name = data.name ?? null;
    const surname = data.surname ?? null;
    const title = data.title ?? null;
    const courses = data.courses ?? [];
    return new Professor(id, name, surname, title, courses);
  }
}
