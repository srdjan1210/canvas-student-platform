import { ICourseRepository } from '../../../domain/courses/interfaces/course-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { CourseMapperFactory } from '../factories/course-mapper.factory';
import { Course } from '../../../domain/courses/course';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    private readonly courseMapperFactory: CourseMapperFactory,
    private readonly prisma: PrismaProvider,
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
    console.log('triggered');
    console.log(students.map((s) => s.id));
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
}
