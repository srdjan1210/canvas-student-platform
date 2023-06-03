import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Announcement } from '../../../domain/courses/announcement';
import { IAnnouncementRepository } from '../../../domain/courses/interfaces/announcement-repository.interface';
import { PersonalAnnouncementParams } from '../../../domain/courses/types/student-announcement-params.type';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { AnnouncementMapperFactory } from '../factories/announcement-mapper.factory';

@Injectable()
export class AnnouncementRepository implements IAnnouncementRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly announcementMapperFactory: AnnouncementMapperFactory,
  ) {}

  async create({
    body,
    courseId,
    professorId,
    title,
  }: Announcement): Promise<Announcement> {
    const saved = await this.prisma.announcementEntity.create({
      data: {
        body,
        courseId,
        professorId,
        title,
      },
      include: {
        professor: {
          include: {
            user: true,
          },
        },
      },
    });

    return this.announcementMapperFactory.fromEntity(saved);
  }

  async getPersonalAnnouncements({
    userId,
    limit,
    page,
  }: PersonalAnnouncementParams): Promise<Announcement[]> {
    const announcements = await this.prisma.announcementEntity.findMany({
      where: {
        OR: [
          {
            course: {
              students: {
                some: {
                  student: {
                    userId,
                  },
                },
              },
            },
          },
          {
            course: {
              professors: {
                some: {
                  userId,
                },
              },
            },
          },
        ],
      },
      include: {
        professor: {
          include: {
            user: true,
          },
        },
        course: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: limit * (page - 1),
    });
    return announcements.map((ann) =>
      this.announcementMapperFactory.fromEntity(ann),
    );
  }

  async getCourseAnnouncements(title: string): Promise<Announcement[]> {
    const announcements = await this.prisma.announcementEntity.findMany({
      where: {
        course: {
          title,
        },
      },
      include: {
        course: true,
        professor: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return announcements.map((ann) =>
      this.announcementMapperFactory.fromEntity(ann),
    );
  }
}
