import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchStudentsQuery } from './search-students.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import { Student } from '../../../../domain/specialization/model/student';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../specialization.constants';

@QueryHandler(SearchStudentsQuery)
export class SearchStudentsQueryHandler
  implements IQueryHandler<SearchStudentsQuery>
{
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute({
    page,
    search,
    limit,
  }: SearchStudentsQuery): Promise<Student[]> {
    return await this.studentRepository.searchStudents(
      search,
      page < DEFAULT_PAGINATION_PAGE ? DEFAULT_PAGINATION_PAGE : page,
      limit < DEFAULT_PAGINATION_LIMIT ? DEFAULT_PAGINATION_LIMIT : limit,
    );
  }
}
