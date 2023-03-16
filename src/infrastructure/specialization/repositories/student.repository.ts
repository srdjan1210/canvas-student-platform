import { IStudentRepository } from '../../../domain/specialization/interfaces/student-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Student } from '../../../domain/specialization/model/student';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { StudentMapperFactory } from '../factories/student-mapper.factory';
import { PersonDto } from '../../../domain/specialization/person.dto';
import { CourseAttendeeSearchParams } from '../../../domain/specialization/types/course-attendee-search.type';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(
    private readonly studentMapperFactory: StudentMapperFactory,
    private readonly prisma: PrismaProvider,
  ) {}
  async findById(id: number): Promise<Student> {
    const student = await this.prisma.studentEntity.findUnique({
      where: { id },
    });
    return this.studentMapperFactory.fromEntity(student);
  }

  async findPersonalInfos(studentIds: number[]): Promise<PersonDto[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        id: { in: studentIds },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return students.map(
      (s) => new PersonDto(s.id, s.name, s.surname, s.user.email),
    );
  }

  async findAllForCourse(courseId: number): Promise<Student[]> {
    const course = await this.prisma.courseEntity.findUnique({
      where: {
        id: courseId,
      },
      select: {
        students: {
          include: {
            user: true,
          },
        },
      },
    });
    return course.students.map((s) => this.studentMapperFactory.fromEntity(s));
  }

  async searchStudents(
    text: string,
    page: number,
    limit: number,
  ): Promise<Student[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        OR: [
          {
            name: {
              contains: text,
              mode: 'insensitive',
            },
          },
          {
            surname: {
              contains: text,
              mode: 'insensitive',
            },
          },
          {
            fullIndex: {
              contains: text,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: +limit,
      skip: (page - 1) * limit,
    });

    return students.map((student) =>
      this.studentMapperFactory.fromEntity(student),
    );
  }

  async findAllNotCourseAttendees({
    course,
    text,
    page,
    limit,
  }: CourseAttendeeSearchParams): Promise<Student[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        AND: [
          {
            courses: {
              none: {
                title: course,
              },
            },
          },
          {
            OR: [
              {
                name: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
              {
                surname: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
              {
                fullIndex: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return students.map((student) =>
      this.studentMapperFactory.fromEntity(student),
    );
  }
}
