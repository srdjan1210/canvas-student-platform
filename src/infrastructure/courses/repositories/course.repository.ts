import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { User } from 'src/domain/auth/user';
import { Announcement } from 'src/domain/courses/announcement';
import { Course } from '../../../domain/courses/course';
import { ICourseRepository } from '../../../domain/courses/interfaces/course-repository.interface';
import { AnnouncementPopulateOptions } from '../../../domain/courses/types/announcement-populate.options';
import { CoursePopulateOptions } from '../../../domain/courses/types/course-populate-options.type';
import { CourseProfessorsPaginated } from '../../../domain/courses/types/course-professors-paginated.type';
import { CourseStudentsPaginated } from '../../../domain/courses/types/course-students-paginated.type';
import { Professor } from '../../../domain/specialization/model/professor';
import { Student } from '../../../domain/specialization/model/student';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { StudentMapperFactory } from '../../specialization/factories/student-mapper.factory';
import { AnnouncementMapperFactory } from '../factories/announcement-mapper.factory';
import { CourseMapperFactory } from '../factories/course-mapper.factory';
import { ProfessorMapperFactory } from '../factories/professor-mapper.factory';

@Injectable()
export class CourseRepository implements ICourseRepository {
  constructor(
    private readonly courseMapperFactory: CourseMapperFactory,
    private readonly prisma: PrismaProvider,
    private readonly studentMapperFactory: StudentMapperFactory,
    private readonly professorMapperFactory: ProfessorMapperFactory,
    private readonly announcementMapperFactory: AnnouncementMapperFactory,
  ) {}

  async create({ title, year, espb, description }: Course): Promise<Course> {
    const created = await this.prisma.courseEntity.create({
      data: {
        title,
        year,
        espb,
        description,
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

  async update(
    {
      id,
      title,
      year,
      espb,
      professors,
      students,
      announcements,
      tests,
    }: Course,
    ignore: { students?: boolean; professors?: boolean } = {},
  ): Promise<void> {
    await this.prisma.courseEntity.update({
      data: {
        title,
        year,
        espb,
        professors:
          ignore.professors == true
            ? undefined
            : {
                connect: professors.map((p) => ({
                  id: p.id,
                })),
              },
        students: {
          createMany: {
            data: [
              ...students.map((s) => ({
                score: 0,
                studentId: s.studentId,
              })),
            ],
            skipDuplicates: true,
          },
        },
        announcements: {
          create: [
            ...announcements.map((a) => ({
              title: a.title,
              body: a.body,
              professorId: a.professorId,
            })),
          ],
        },
        tests: {
          createMany: {
            data: [
              ...tests.map((test) => ({
                title: test.title,
                maxPoints: test.maxPoints,
                description: test.description,
                deadlineForSubmission: test.deadlineForSubmission,
              })),
            ],
            skipDuplicates: true,
          },
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
        students: including.students
          ? {
              include: {
                student: true,
              },
            }
          : undefined,
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
            studentId,
          },
        },
      },
    });

    return courses.map((course) => this.courseMapperFactory.fromEntity(course));
  }

  async findByTitleIncluding(
    title: string,
    { students = false, professors = false }: CoursePopulateOptions,
  ) {
    const course = await this.prisma.courseEntity.findUnique({
      where: { title },
      include: {
        professors: professors ? true : undefined,
        students: students
          ? {
              include: {
                student: true,
              },
            }
          : undefined,
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
            course: {
              title,
            },
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
            course: {
              title,
            },
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
    courseId: number,
    studentId: number,
  ): Promise<void> {
    await this.prisma.courseEntity.update({
      where: {
        id: courseId,
      },
      data: {
        students: {
          delete: {
            courseId_studentId: {
              studentId,
              courseId,
            },
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

  async findAnnouncement(
    title: string,
    id: number,
    { professor, course }: AnnouncementPopulateOptions,
  ): Promise<Announcement> {
    const announcement = await this.prisma.announcementEntity.findUnique({
      where: {
        id,
      },
      include: {
        professor: professor ? true : undefined,
        course: course ? true : undefined,
      },
    });
    if (!announcement) return null;

    return this.announcementMapperFactory.fromEntity(announcement);
  }

  async findAllMembers(courseId: number): Promise<User[]> {
    const users = await this.prisma.userEntity.findMany({
      where: {
        OR: [
          {
            professor: {
              courses: {
                some: {
                  id: courseId,
                },
              },
            },
          },
          {
            student: {
              courses: {
                some: {
                  courseId,
                },
              },
            },
          },
        ],
      },
    });
    return users.map((user) => User.create({ id: user.id, email: user.email }));
  }
}
