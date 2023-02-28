import {
  CommandHandler,
  EventPublisher,
  ICommand,
  ICommandHandler,
} from '@nestjs/cqrs';
import { AddStudentsToCourseCommand } from './add-students-to-course.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../domain/course.constants';
import { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import {
  PROFESSOR_REPOSITORY,
  STUDENT_REPOSITORY,
} from '../../../../specialization/domain/specialization.constants';
import { IStudentRepository } from '../../../../specialization/domain/interfaces/student-repository.interface';
import { IProfessorRepository } from '../../../../specialization/domain/interfaces/professor-repository.interface';
import { CourseNotFoundException } from '../../exceptions/course-not-found.exception';

@CommandHandler(AddStudentsToCourseCommand)
export class AddStudentsToCourseCommandHandler
  implements ICommandHandler<AddStudentsToCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({
    studentIds,
    courseId,
  }: AddStudentsToCourseCommand): Promise<void> {
    const course = this.eventBus.mergeObjectContext(
      await this.courseRepository.findById(courseId),
    );
    if (!course) throw new CourseNotFoundException();

    const studentInfos = await this.studentRepository.findPersonalInfos(
      studentIds,
    );
    course.addStudents(studentIds);
    await this.courseRepository.update(course);
    course.greetNewMembers(studentInfos);
    course.commit();
  }
}
