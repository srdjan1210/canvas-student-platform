import { PersonDto } from '../person.dto';
import { Professor } from '../model/professor';
import { Student } from '../model/student';

export interface IProfessorRepository {
  findPersonalInfos(professorIds: number[]): Promise<PersonDto[]>;
  findById(id: number): Promise<Professor>;
  searchProfessors(
    text: string,
    page: number,
    limit: number,
  ): Promise<Professor[]>;
}
