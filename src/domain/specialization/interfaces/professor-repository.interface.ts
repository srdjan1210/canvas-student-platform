import { PersonDto } from '../person.dto';
import { Professor } from '../model/professor';

export interface IProfessorRepository {
  findPersonalInfos(professorIds: number[]): Promise<PersonDto[]>;
  findById(id: number): Promise<Professor>;
}
