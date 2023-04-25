import { ImportStudentsFromCsvCommand } from './import-students-from-csv.command';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';
import { Student } from '../../../../domain/specialization/model/student';

@CommandHandler(ImportStudentsFromCsvCommand)
export class ImportStudentsFromCsvCommandHandler
  implements ICommandHandler<ImportStudentsFromCsvCommand>
{
  constructor(
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
  ) {}

  async execute({
    csvFile,
    courseName,
  }: ImportStudentsFromCsvCommand): Promise<Student[]> {
    const course = await this.courseRepository.findByTitle(courseName);

    if (!course) throw new CourseNotFoundException();
    const parsedStudents = await this.csvService.parseStudents(csvFile);
    const indexes = parsedStudents.map((student) => student.fullIndex);
    return this.courseRepository.filterStudentsNotInCourse(courseName, indexes);
  }
}
