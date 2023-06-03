import {
  CommandHandler,
  EventBus,
  EventPublisher,
  ICommandHandler,
} from '@nestjs/cqrs';
import { CreateTestCommand } from './create-test.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from 'src/domain/courses/course';
import { CourseTest } from 'src/domain/scores/model/course-test';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { TestCreatedEvent } from '../../../../domain/scores/events/test-created.event';
import { USER_REPOSITORY } from '../../../auth/auth.constants';

@CommandHandler(CreateTestCommand)
export class CreateTestCommandHandler
  implements ICommandHandler<CreateTestCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly eventPublisher: EventBus,
  ) {}
  async execute({
    authorized,
    testName,
    courseTitle,
    points,
    description,
    deadlineForSubmission,
  }: CreateTestCommand): Promise<any> {
    const course = await this.courseRepository.findByTitleIncluding(
      courseTitle,
      {
        professors: true,
      },
    );

    const user = await this.userRepository.findByIdPopulated(authorized);

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);
    const test = CourseTest.create({
      description: description,
      title: testName,
      maxPoints: points,
      deadlineForSubmission,
      courseId: course.id,
    });

    course.addTest(test);

    await this.courseRepository.update(course);

    this.eventPublisher.publish(
      new TestCreatedEvent(test, user?.professor?.id),
    );
  }
}
