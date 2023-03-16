import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchProfessorQuery } from './search-professor.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../../specialization.constants';
import { Professor } from '../../../../domain/specialization/model/professor';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';

@QueryHandler(SearchProfessorQuery)
export class SearchProfessorQueryHandler
  implements IQueryHandler<SearchProfessorQuery>
{
  constructor(
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
  ) {}
  async execute({
    search,
    page,
    limit,
  }: SearchProfessorQuery): Promise<Professor[]> {
    return await this.professorRepository.searchProfessors(
      search,
      page < DEFAULT_PAGINATION_PAGE ? DEFAULT_PAGINATION_PAGE : page,
      limit < DEFAULT_PAGINATION_LIMIT ? DEFAULT_PAGINATION_LIMIT : limit,
    );
  }
}
