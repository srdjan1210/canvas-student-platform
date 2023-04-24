import { ICourseRepository } from '../../../domain/courses/interfaces/course-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { CourseMapperFactory } from '../factories/course-mapper.factory';
import { Course } from '../../../domain/courses/course';
import { CourseProfessorsPaginated } from '../../../domain/courses/types/course-professors-paginated.type';
import { Professor } from '../../../domain/specialization/model/professor';
import { Student } from '../../../domain/specialization/model/student';
import { CourseStudentsPaginated } from '../../../domain/courses/types/course-students-paginated.type';
import { StudentMapperFactory } from '../../specialization/factories/student-mapper.factory';
import { ProfessorMapperFactory } from '../factories/professor-mapper.factory';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    private readonly courseMapperFactory: CourseMapperFactory,
    private readonly prisma: PrismaProvider,
    private readonly studentMapperFactory: StudentMapperFactory,
    private readonly professorMapperFactory: ProfessorMapperFactory,
  ) {}

  async create({ title, year, espb }: Course): Promise<Course> {
    const created = await this.prisma.courseEntity.create({
      data: {
        title,
        year,
        espb,
      },
    });
    return this.courseMapperFactory.fromEntity(created);
  }

  async findById(id: number): Promise<Course> {
    const course = await this.prisma.courseEntity.findUnique({
      where: { id },
    });
    return this.courseMapperFactory.fromEntity(course);
  }

  async update({
    id,
    title,
    year,
    espb,
    professors,
    students,
    announcements,
  }: Course): Promise<void> {
    await this.prisma.courseEntity.update({
      data: {
        title,
        year,
        espb,
        professors: {
          connect: professors.map((p) => ({
            id: p.id,
          })),
        },
        students: {
          connect: [
            ...students.map((s) => ({
              id: s.id,
            })),
          ],
        },
        announcements: {
          create: announcements.map((a) => ({
            title: a.title,
            body: a.body,
            professorId: a.professorId,
          })),
        },
      },
      where: {
        id,
      },
    });
  }

  async findByIdIncluding(
    id: number,
    including: { professors: boolean; students: boolean },
  ): Promise<Course> {
    const course = await this.prisma.courseEntity.findUnique({
      where: { id },
      include: {
        professors: including.professors,
        students: including.students,
      },
    });
    return this.courseMapperFactory.fromEntity(course);
  }

  async findByTitle(title: string): Promise<Course> {
    const course = await this.prisma.courseEntity.findUnique({
      where: {
        title,
      },
    });
    return this.courseMapperFactory.fromEntity(course);
  }

  async findAllByStudent(studentId: number): Promise<Course[]> {
    const courses = await this.prisma.courseEntity.findMany({
      where: {
        students: {
          some: {
            id: studentId,
          },
        },
      },
    });

    return courses.map((course) => this.courseMapperFactory.fromEntity(course));
  }

  async findByTitleIncluding(
    title: string,
    including: { professors?: boolean; students?: boolean },
  ) {
    const course = await this.prisma.courseEntity.findUnique({
      where: { title },
      include: {
        professors: including.professors,
        students: including.students,
      },
    });
    return this.courseMapperFactory.fromEntity(course);
  }

  async findAllByProfessor(professorId: number): Promise<Course[]> {
    const courses = await this.prisma.courseEntity.findMany({
      where: {
        professors: {
          some: {
            id: professorId,
          },
        },
      },
    });

    return courses.map((course) => this.courseMapperFactory.fromEntity(course));
  }

  async findAllPaginated({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<Course[]> {
    const courses = await this.prisma.courseEntity.findMany({
      where: {},
      take: limit,
      skip: (page - 1) * limit,
    });

    return courses.map((course) => this.courseMapperFactory.fromEntity(course));
  }

  async findCourseProfessors({
    title,
    page,
    limit,
  }: CourseProfessorsPaginated): Promise<Professor[]> {
    const professors = await this.prisma.professorEntity.findMany({
      where: {
        courses: {
          some: {
            title,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return professors.map((professor) =>
      this.professorMapperFactory.fromEntity(professor),
    );
  }

  async findCourseStudents({
    title,
    page,
    limit,
  }: CourseStudentsPaginated): Promise<Student[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        courses: {
          some: {
            title,
          },
        },
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return students.map((student) =>
      this.studentMapperFactory.fromEntity(student),
    );
  }

  async filterStudentsNotInCourse(
    title: string,
    indexes: string[],
  ): Promise<Student[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        courses: {
          none: {
            title,
          },
        },
        fullIndex: {
          in: indexes,
        },
      },
    });

    return students.map((student) =>
      this.studentMapperFactory.fromEntity(student),
    );
  }

  async removeStudentFromCourse(
    title: string,
    studentId: number,
  ): Promise<void> {
    await this.prisma.courseEntity.update({
      where: {
        title,
      },
      data: {
        students: {
          disconnect: {
            id: studentId,
          },
        },
      },
    });
  }

  async removeProfessorFromCourse(
    title: string,
    professorId: number,
  ): Promise<void> {
    await this.prisma.courseEntity.update({
      where: {
        title,
      },
      data: {
        professors: {
          disconnect: {
            id: professorId,
          },
        },
      },
    });
  }

  async filterProfessorsNotInCourse(
    title: string,
    ids: number[],
  ): Promise<Professor[]> {
    const professors = await this.prisma.professorEntity.findMany({
      where: {
        courses: {
          none: {
            title,
          },
        },
        id: {
          in: ids,
        },
      },
    });

    return professors.map((professor) =>
      this.professorMapperFactory.fromEntity(professor),
    );
  }
}
