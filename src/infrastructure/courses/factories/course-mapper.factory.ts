import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { Course } from '../../../domain/courses/course';
import { CourseEntity, ProfessorEntity, StudentEntity } from '@prisma/client';
import { Student } from '../../../domain/specialization/model/student';
import { Professor } from '../../../domain/specialization/model/professor';
import { StudentFactory } from '../../../domain/specialization/factories/student.factory';
import { ProfessorFactory } from '../../../domain/specialization/factories/professor.factory';

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

    return new Course(
      entity.id,
      entity.title,
      entity.year,
      entity.espb,
      studentsMapped,
      professorsMapped,
    );
  }
  fromModel({ id, title, year, espb }: Course) {
    return {
      id,
      title,
      year,
      espb,
    };
  }

  private mapStudents = (students: StudentEntity[]) => {
    return students
      ? students.map((s) =>
          StudentFactory.create({
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
          ProfessorFactory.create({
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
