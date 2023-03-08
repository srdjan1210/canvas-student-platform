import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStudentCoursesQuery } from './get-student-courses.query';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';

@QueryHandler(GetStudentCoursesQuery)
export class GetStudentCoursesQueryHandler
  implements IQueryHandler<GetStudentCoursesQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({ studentId }: GetStudentCoursesQuery): Promise<any> {
    return await this.courseRepository.findAllByStudent(studentId);
  }
}
