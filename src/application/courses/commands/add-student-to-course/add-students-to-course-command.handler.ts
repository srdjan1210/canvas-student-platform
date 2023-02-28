import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { AddStudentsToCourseCommand } from './add-students-to-course.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

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
