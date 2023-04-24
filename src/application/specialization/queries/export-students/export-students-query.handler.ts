import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExportStudentsQuery } from './export-students.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';
import { Readable } from 'stream';

@QueryHandler(ExportStudentsQuery)
export class ExportStudentsQueryHandler
  implements IQueryHandler<ExportStudentsQuery>
{
  constructor(
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
  ) {}

  async execute(): Promise<Readable> {
    const students = await this.studentRepository.findAll();
    return this.csvService.exportStudents(students);
  }
}
