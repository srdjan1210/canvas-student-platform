import { PersonDto } from '../person.dto';
import { Professor } from '../model/professor';
import { CourseMemberSearchParams } from '../types/course-member-search.type';

export interface IProfessorRepository {
  findPersonalInfos(professorIds: number[]): Promise<PersonDto[]>;
  findById(id: number): Promise<Professor>;
  findAllNotCourseAttendees(
    params: CourseMemberSearchParams,
  ): Promise<Professor[]>;
  searchProfessors(
    text: string,
    page: number,
    limit: number,
  ): Promise<Professor[]>;
}
