import { CsvFile } from '../../../../domain/shared/csv-file';

export class ImportProfessorsFromCsvCommand {
  constructor(
    public readonly courseName: string,
    public readonly csvFile: CsvFile,
  ) {}
}
