import { ICourseRepository } from '../../../core/courses/domain/interfaces/course-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { CourseMapperFactory } from '../factories/course-mapper.factory';
import { Course } from '../../../core/courses/domain/course';

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
          connect: students.map((s) => ({
            id: s.id,
          })),
        },
      },
      where: {
        id,
      },
    });
  }
}
