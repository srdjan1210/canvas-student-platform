import {
  AnnouncementEntity,
  CourseEntity,
  ProfessorEntity,
  UserEntity,
} from '@prisma/client';
import { User } from '../../../domain/auth/user';
import { Announcement } from '../../../domain/courses/announcement';
import { Course } from '../../../domain/courses/course';
import { Professor } from '../../../domain/specialization/model/professor';
import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';

export class AnnouncementMapperFactory
  implements
    IEntityMapperFactory<
      AnnouncementEntity & {
        professor?: ProfessorEntity & { user?: UserEntity };
        course?: CourseEntity;
      },
      Announcement
    >
{
  fromEntity({
    id,
    title,
    body,
    professorId,
    courseId,
    createdAt,
    professor,
    course,
  }: AnnouncementEntity & {
    professor?: ProfessorEntity & { user?: UserEntity };
    course?: CourseEntity;
  }): Announcement {
    const professorMapped = professor
      ? Professor.create({
          id: professor.id,
          title: professor.title,
          surname: professor.surname,
          name: professor.name,
          userId: professor.userId,
          user: professor.user
            ? User.create({
                id: professor.user.id,
                avatar: professor.user.avatar,
                email: professor.user.email,
              })
            : undefined,
        })
      : null;

    const courseMapped = course
      ? Course.create({
          id: course.id,
          espb: course.espb,
          description: course.description,
          title: course.title,
          year: course.year,
        })
      : null;

    return Announcement.create({
      id,
      title,
      body,
      professorId,
      courseId,
      createdAt,
      course: courseMapped,
      professor: professorMapped,
    });
  }

  fromModel({
    id,
    body,
    title,
    professorId,
    courseId,
    createdAt,
  }: Announcement): AnnouncementEntity {
    return {
      id,
      body,
      professorId,
      title,
      courseId,
      createdAt,
    };
  }
}
