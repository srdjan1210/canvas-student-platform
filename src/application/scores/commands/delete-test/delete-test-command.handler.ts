import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteTestCommand } from './delete-test.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { COURSE_TEST_REPOSITORY } from '../../../../domain/scores/score.constants';
import { ICourseTestRepository } from '../../../../domain/scores/interfaces/course-test-repository.interface';
import { CourseTest } from '../../../../domain/scores/model/course-test';
import { Course } from '../../../../domain/courses/course';

@CommandHandler(DeleteTestCommand)
export class DeleteTestCommandHandler
  implements ICommandHandler<DeleteTestCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(COURSE_TEST_REPOSITORY)
    private readonly testRepository: ICourseTestRepository,
  ) {}
  async execute({ authorized, testId }: DeleteTestCommand): Promise<any> {
    const test = await this.testRepository.findById(testId);

    CourseTest.throwIfNull(test);

    const course = await this.courseRepository.findByIdIncluding(
      test.courseId,
      {
        professors: true,
      },
    );

    Course.throwIfNull(course);
    course.throwIfNotCourseProfessor(authorized);

    await this.testRepository.deleteOne(testId);
  }
}
