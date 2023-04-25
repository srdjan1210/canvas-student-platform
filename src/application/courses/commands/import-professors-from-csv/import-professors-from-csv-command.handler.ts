import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ImportProfessorsFromCsvCommand } from './import-professors-from-csv.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { Professor } from '../../../../domain/specialization/model/professor';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

@CommandHandler(ImportProfessorsFromCsvCommand)
export class ImportProfessorsFromCsvCommandHandler
  implements ICommandHandler<ImportProfessorsFromCsvCommand>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
  ) {}

  async execute({
    courseName,
    csvFile,
  }: ImportProfessorsFromCsvCommand): Promise<Professor[]> {
    const course = await this.courseRepository.findByTitle(courseName);

    if (!course) throw new CourseNotFoundException();
    const parsedProfessors = await this.csvService.parseProfessors(csvFile);
    const ids = parsedProfessors.map((professor) => professor.id);
    return this.courseRepository.filterProfessorsNotInCourse(courseName, ids);
  }
}
