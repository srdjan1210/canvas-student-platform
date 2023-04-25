import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ExportProfessorsQuery } from './export-professors.query';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { PROFESSOR_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IProfessorRepository } from '../../../../domain/specialization/interfaces/professor-repository.interface';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { Readable } from 'stream';

@QueryHandler(ExportProfessorsQuery)
export class ExportProfessorsQueryHandler
  implements IQueryHandler<ExportProfessorsQuery>
{
  constructor(
    @Inject(PROFESSOR_REPOSITORY)
    private readonly professorRepository: IProfessorRepository,
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
  ) {}

  async execute(): Promise<Readable> {
    const professors = await this.professorRepository.findAll();
    return this.csvService.exportProfessors(professors);
  }
}
