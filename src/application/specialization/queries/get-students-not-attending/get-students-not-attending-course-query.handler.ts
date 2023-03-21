import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStudentsNotAttendingCourseQuery } from './get-students-not-attending-course.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';

@QueryHandler(GetStudentsNotAttendingCourseQuery)
export class GetStudentsNotAttendingCourseQueryHandler
  implements IQueryHandler<GetStudentsNotAttendingCourseQuery>
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
  }: GetStudentsNotAttendingCourseQuery): Promise<any> {
    return this.studentRepository.findAllNotCourseAttendees({
      course,
      text: search,
      page,
      limit,
    });
  }
}
