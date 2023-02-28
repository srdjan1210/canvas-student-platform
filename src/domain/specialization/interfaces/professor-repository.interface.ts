import { PersonDto } from '../person.dto';

export interface IProfessorRepository {
  findPersonalInfos(professorIds: number[]): Promise<PersonDto[]>;
}
