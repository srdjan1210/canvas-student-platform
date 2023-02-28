import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateCourseCommand } from './create-course.command';
import { Course } from '../../../../domain/courses/course';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';

@CommandHandler(CreateCourseCommand)
export class CreateCourseCommandHandler
  implements ICommandHandler<CreateCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({ title, year, espb }: CreateCourseCommand): Promise<Course> {
    const course = new Course(null, title, year, espb);
    return await this.courseRepository.create(course);
  }
}
