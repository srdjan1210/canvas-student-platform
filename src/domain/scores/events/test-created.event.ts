import { CourseTest } from '../model/course-test';

export class TestCreatedEvent {
  constructor(
    public readonly test: CourseTest,
    public readonly professorId: number,
  ) {}
}
