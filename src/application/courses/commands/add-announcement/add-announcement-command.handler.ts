import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddAnnouncementCommand } from './add-announcement.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { Announcement } from '../../../../domain/courses/announcement';
import { AnnouncementCreatedEvent } from '../../../../domain/courses/events/announcement-created.event';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';

@CommandHandler(AddAnnouncementCommand)
export class AddAnnouncementCommandHandler
  implements ICommandHandler<AddAnnouncementCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({
    title,
    body,
    courseId,
    professorId,
  }: AddAnnouncementCommand): Promise<void> {
    const course = this.eventBus.mergeObjectContext(
      await this.courseRepository.findById(courseId),
    );
    if (!course) throw new CourseNotFoundException();
    const announcement = new Announcement(
      null,
      title,
      body,
      courseId,
      professorId,
    );
    course.addAnnouncement(announcement);
    await this.courseRepository.update(course);
    course.apply(new AnnouncementCreatedEvent(announcement));
    course.commit();
  }
}
