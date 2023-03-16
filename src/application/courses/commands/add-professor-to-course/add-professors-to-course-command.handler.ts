import { AddProfessorsToCourseCommand } from './add-professors-to-course.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

@CommandHandler(AddProfessorsToCourseCommand)
export class AddProfessorsToCourseCommandHandler
  implements ICommandHandler<AddProfessorsToCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({
    courseTitle,
    professorIds,
  }: AddProfessorsToCourseCommand): Promise<void> {
    const course = this.eventBus.mergeObjectContext(
      await this.courseRepository.findByTitle(courseTitle),
    );
    if (!course) throw new CourseNotFoundException();

    const professorInfos = await this.professorRepository.findPersonalInfos(
      professorIds,
    );
    course.addProfessors(professorIds);
    await this.courseRepository.update(course);
    course.greetNewMembers(professorInfos);
    course.commit();
  }
}
