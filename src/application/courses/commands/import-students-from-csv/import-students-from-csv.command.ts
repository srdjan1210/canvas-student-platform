import { CsvFile } from '../../../../domain/shared/csv-file';

export class ImportStudentsFromCsvCommand {
  constructor(
    public readonly courseName: string,
    public readonly csvFile: CsvFile,
  ) {}
}
