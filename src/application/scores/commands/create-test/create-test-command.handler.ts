import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateTestCommand } from './create-test.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { Course } from 'src/domain/courses/course';
import { CourseTest } from 'src/domain/scores/model/course-test';

@CommandHandler(CreateTestCommand)
export class CreateTestCommandHandler
  implements ICommandHandler<CreateTestCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
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

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);
    console.log(deadlineForSubmission);
    const test = CourseTest.create({
      description: description,
      title: testName,
      maxPoints: points,
      deadlineForSubmission,
    });

    course.addTest(test);

    await this.courseRepository.update(course);
  }
}
