import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchStudentsNotAttendingQuery } from './search-students-not-attending.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';

@QueryHandler(SearchStudentsNotAttendingQuery)
export class SearchStudentsNotAttendingQueryHandler
  implements IQueryHandler<SearchStudentsNotAttendingQuery>
{
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute({
    course,
    search,
    page,
    limit,
  }: SearchStudentsNotAttendingQuery): Promise<any> {
    return this.studentRepository.findAllNotCourseAttendees({
      course,
      text: search,
      page,
      limit,
    });
  }
}
