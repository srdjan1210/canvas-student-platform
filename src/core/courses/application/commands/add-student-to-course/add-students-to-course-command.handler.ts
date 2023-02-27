import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { AddStudentsToCourseCommand } from './add-students-to-course.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../domain/course.constants';
import { ICourseRepository } from '../../../domain/interfaces/course-repository.interface';
import { STUDENT_REPOSITORY } from '../../../../specialization/domain/specialization.constants';
import { IStudentRepository } from '../../../../specialization/domain/interfaces/student-repository.interface';
import { Student } from '../../../../specialization/domain/student';

@CommandHandler(AddStudentsToCourseCommand)
export class AddStudentsToCourseCommandHandler
  implements ICommandHandler<AddStudentsToCourseCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}
  async execute({
    studentIds,
    courseId,
  }: AddStudentsToCourseCommand): Promise<void> {
    const course = await this.courseRepository.findById(courseId);
    const students = studentIds.map((id) => Student.create({ id }));
    course.addStudents(students);
    await this.courseRepository.update(course);
  }
}
