import { Student } from '../student';
import { PersonDto } from '../person.dto';

export interface IStudentRepository {
  findById(id: number): Promise<Student>;
  findPersonalInfos(studentIds: number[]): Promise<PersonDto[]>;
}
