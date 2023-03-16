import { Professor } from '../../domain/specialization/model/professor';

export class ProfessorPresenter {
  private readonly id: number;
  private readonly name: string;
  private readonly surname: string;
  private readonly title: string;

  constructor({ id, name, surname, title }: Professor) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.title = title;
  }
}
