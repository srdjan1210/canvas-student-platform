import { Student } from '../../domain/specialization/model/student';

export class StudentPresenter {
  private readonly id: number;
  private readonly name: string;
  private readonly surname: string;
  private readonly fullIndex: string;

  constructor({ id, surname, name, fullIndex }: Student) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.fullIndex = fullIndex;
  }
}
