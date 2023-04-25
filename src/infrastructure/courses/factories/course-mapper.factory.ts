import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { Course } from '../../../domain/courses/course';
import { CourseEntity, ProfessorEntity, StudentEntity } from '@prisma/client';
import { Student } from '../../../domain/specialization/model/student';
import { Professor } from '../../../domain/specialization/model/professor';

export class CourseMapperFactory
  implements
    IEntityMapperFactory<
      CourseEntity & {
        students?: StudentEntity[];
        professors?: ProfessorEntity[];
      },
      Course
    >
{
  fromEntity(
    entity: CourseEntity & {
      students?: StudentEntity[];
      professors?: ProfessorEntity[];
    },
  ): Course {
    if (!entity) return null;
    const studentsMapped = this.mapStudents(entity.students);
    const professorsMapped = this.mapProfessors(entity.professors);

    return Course.create({
      id: entity.id,
      title: entity.title,
      year: entity.year,
      espb: entity.espb,
      description: entity.description,
      students: studentsMapped,
      professors: professorsMapped,
    });
  }
  fromModel({ id, title, year, espb, description }: Course) {
    return {
      id,
      title,
      year,
      espb,
      description,
    };
  }

  private mapStudents = (students: StudentEntity[]) => {
    return students
      ? students.map((s) =>
          Student.create({
            id: s.id,
            name: s.name,
            surname: s.surname,
            specializationName: s.specializationName,
            userId: s.userId,
            indexNumber: s.indexNumber,
            year: s.indexYear,
          }),
        )
      : [];
  };

  private mapProfessors = (professors: ProfessorEntity[]) => {
    return professors
      ? professors.map((p) =>
          Professor.create({
            id: p.id,
            name: p.name,
            surname: p.surname,
            title: p.title,
            userId: p.userId,
          }),
        )
      : [];
  };
}
