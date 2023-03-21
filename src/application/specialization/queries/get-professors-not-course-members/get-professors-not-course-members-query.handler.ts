import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProfessorsNotCourseMembersQuery } from './get-professors-not-course-members.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';
import { Professor } from '../../../../domain/specialization/model/professor';

@QueryHandler(GetProfessorsNotCourseMembersQuery)
export class GetProfessorsNotCourseMembersQueryHandler
  implements IQueryHandler<GetProfessorsNotCourseMembersQuery>
{
  constructor(
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
  ) {}
  async execute({
    course,
    page,
    limit,
    search,
  }: GetProfessorsNotCourseMembersQuery): Promise<Professor[]> {
    return this.professorRepository.findAllNotCourseAttendees({
      course,
      text: search,
      page,
      limit,
    });
  }
}
