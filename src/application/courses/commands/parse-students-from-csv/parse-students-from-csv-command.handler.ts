import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { ParseStudentsFromCsvCommand } from './parse-students-from-csv.command';
import { CSV_PARSING_SERVICE } from '../../../../infrastructure/shared/csv/csv.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { ICsvParsingService } from '../../../shared/interfaces/csv-parsing-service.interface';
import { STUDENT_REPOSITORY } from '../../../../domain/specialization/specialization.constants';
import { IStudentRepository } from '../../../../domain/specialization/interfaces/student-repository.interface';

@CommandHandler(ParseStudentsFromCsvCommand)
export class ParseStudentsFromCsvCommandHandler
  implements ICommandHandler<ParseStudentsFromCsvCommand>
{
  constructor(
    @Inject(CSV_PARSING_SERVICE)
    private readonly csvService: ICsvParsingService,
    @Inject(STUDENT_REPOSITORY)
    private readonly studentRepository: IStudentRepository,
  ) {}

  async execute({ file }: ParseStudentsFromCsvCommand): Promise<any> {
    const parsed = await this.csvService.parseStudents(file);

    const indexes = parsed.map((p) => p.fullIndex);
    const filtered = indexes.filter((i) => i != null);
    return this.studentRepository.findAllWithIndexes(filtered);
  }
}
