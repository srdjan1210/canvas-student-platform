import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RemoveProfessorFromCourseCommand } from './remove-professor-from-course.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

@CommandHandler(RemoveProfessorFromCourseCommand)
export class RemoveProfessorFromCourseCommandHandler
  implements ICommandHandler<RemoveProfessorFromCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({
    title,
    id,
  }: RemoveProfessorFromCourseCommand): Promise<void> {
    const course = await this.courseRepository.findByTitle(title);
    if (!course) throw new CourseNotFoundException();

    await this.courseRepository.removeProfessorFromCourse(title, id);
  }
}
