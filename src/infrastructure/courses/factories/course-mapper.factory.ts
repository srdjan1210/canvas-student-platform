import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { Course } from '../../../domain/courses/course';
import {
  CourseEntity,
  CourseStudentEntity,
  ProfessorEntity,
  StudentEntity,
  TestEntity,
  UserEntity,
} from '@prisma/client';
import { Student } from '../../../domain/specialization/model/student';
import { Professor } from '../../../domain/specialization/model/professor';
import { CourseStudent } from '../../../domain/courses/course-student';

type CourseFactoryEntity = CourseEntity & {
  students?: (CourseStudentEntity & {
    student?: StudentEntity & { user?: UserEntity };
  })[];
  professors?: ProfessorEntity[];
};

export class CourseMapperFactory
  implements IEntityMapperFactory<CourseFactoryEntity, Course>
{
  fromEntity(entity: CourseFactoryEntity): Course {
    if (!entity) return null;
    const studentsMapped = this.mapCourseStudents(entity.students);
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

  fromModel({
    id,
    title,
    year,
    espb,
    description,
  }: Course): CourseFactoryEntity {
    return {
      id,
      title,
      year,
      espb,
      description,
    };
  }

  private mapCourseStudents = (
    students: (CourseStudentEntity & {
      student?: StudentEntity;
      tests?: TestEntity[];
    })[],
  ): CourseStudent[] => {
    return students
      ? students.map((s) => ({
          student: this.mapStudent(s.student),
          course: null,
          courseId: s.courseId,
          studentId: s.studentId,
          score: s.score,
          tests: [],
        }))
      : [];
  };

  private mapStudent = (s: StudentEntity) => {
    return s
      ? Student.create({
          id: s.id,
          name: s.name,
          surname: s.surname,
          specializationName: s.specializationName,
          userId: s.userId,
          indexNumber: s.indexNumber,
          year: s.indexYear,
        })
      : null;
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
