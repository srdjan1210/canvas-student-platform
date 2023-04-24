import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExportStudentsToCsvQuery } from './export-students-to-csv.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { Readable } from 'stream';

@QueryHandler(ExportStudentsToCsvQuery)
export class ExportStudentsToCsvQueryHandler
  implements IQueryHandler<ExportStudentsToCsvQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
  ) {}

  async execute({ title }: ExportStudentsToCsvQuery): Promise<Readable> {
    const course = await this.courseRepository.findByTitle(title);
    if (!course) throw new CourseNotFoundException();

    const students = await this.studentRepository.findAllForCourse(course.id);

    return this.csvService.exportStudents(students);
  }
}
