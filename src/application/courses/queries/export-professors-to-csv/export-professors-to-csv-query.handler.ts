import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExportProfessorsToCsvQuery } from './export-professors-to-csv.query';
import { ExportStudentsToCsvQuery } from '../export-students-to-csv/export-students-to-csv.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { COURSE_REPOSITORY } from '../../../../domain/courses/course.constants';
import { ICourseRepository } from '../../../../domain/courses/interfaces/course-repository.interface';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';
import { CourseNotFoundException } from '../../../../domain/courses/exceptions/course-not-found.exception';

@QueryHandler(ExportProfessorsToCsvQuery)
export class ExportProfessorsToCsvQueryHandler
  implements IQueryHandler<ExportStudentsToCsvQuery>
{
  constructor(
    @Inject(COURSE_REPOSITORY)
    private readonly courseRepository: ICourseRepository,
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
  ) {}

  async execute({ title }: ExportStudentsToCsvQuery): Promise<any> {
    const course = await this.courseRepository.findByTitle(title);

    if (!course) throw new CourseNotFoundException();

    const professors = await this.professorRepository.findAllByCourse(
      course.id,
    );
    return this.csvService.exportProfessors(professors);
  }
}
