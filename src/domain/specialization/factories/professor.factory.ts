import { User } from '../../auth/user';
import { Course } from '../../courses/course';
import { Professor } from '../model/professor';

export class ProfessorFactory {
  static create(data: {
    id?: number;
    name?: string;
    surname?: string;
    title?: string;
    user?: User;
    courses?: Course[];
    userId?: number;
  }) {
    const id = data.id ?? null;
    const name = data.name ?? null;
    const surname = data.surname ?? null;
    const title = data.title ?? null;
    const courses = data.courses ?? [];
    const userId = data.userId ?? null;
    const user = data.user ?? null;
    return new Professor(id, name, surname, title, userId, user, courses);
  }
}
