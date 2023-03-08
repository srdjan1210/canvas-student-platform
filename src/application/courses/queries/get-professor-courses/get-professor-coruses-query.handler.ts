import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessorCoursesQuery } from './get-professor-courses.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';

@QueryHandler(GetProfessorCoursesQuery)
export class GetProfessorCorusesQueryHandler
  implements IQueryHandler<GetProfessorCoursesQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({ professorId }: GetProfessorCoursesQuery): Promise<any> {
    return await this.courseRepository.findAllByProfessor(professorId);
  }
}
