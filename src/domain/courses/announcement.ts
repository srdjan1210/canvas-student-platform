import { Professor } from '../specialization/model/professor';
import { Course } from './course';

export class Announcement {
  constructor(
    public readonly id: number,
    public readonly title: string,
    public readonly body: string,
    public readonly courseId: number,
    public readonly professorId: number,
    public readonly professor: Professor = null,
    public readonly course: Course = null,
  ) {}
}
