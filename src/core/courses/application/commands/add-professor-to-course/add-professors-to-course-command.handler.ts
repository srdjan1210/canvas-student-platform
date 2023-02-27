import { AddProfessorsToCourseCommand } from './add-professors-to-course.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { COURSE_REPOSITORY } from '../../../domain/course.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { Professor } from '../../../../specialization/domain/professor';

@CommandHandler(AddProfessorsToCourseCommand)
export class AddProfessorsToCourseCommandHandler
  implements ICommandHandler<AddProfessorsToCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}
  async execute({
    courseId,
    professorIds,
  }: AddProfessorsToCourseCommand): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    const professors = professorIds.map((id) => Professor.create({ id }));
    course.addProfessors(professors);
    await this.courseRepository.update(course);
  }
}
