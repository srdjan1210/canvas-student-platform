import { CsvFile } from '../../../../domain/shared/csv-file';

export class ParseStudentsFromCsvCommand {
  constructor(public readonly file: CsvFile) {}
}
