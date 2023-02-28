import { AddProfessorsToCourseCommand } from './add-professors-to-course.command';
import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { COURSE_REPOSITORY } from '../../../domain/course.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { IProfessorRepository } from '../../../../specialization/domain/interfaces/professor-repository.interface';
import { PROFESSOR_REPOSITORY } from '../../../../specialization/domain/specialization.constants';
import { CourseNotFoundException } from '../../../domain/exceptions/course-not-found.exception';

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
    courseId,
    professorIds,
  }: AddProfessorsToCourseCommand): Promise<void> {
    const course = this.eventBus.mergeObjectContext(
      await this.courseRepository.findById(courseId),
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
