import { Student } from '../../../domain/specialization/model/student';
import { CsvFile } from '../../../domain/shared/csv-file';
import { Professor } from '../../../domain/specialization/model/professor';
import { Readable } from 'stream';

export interface ICsvParsingService {
  parseStudents(file: CsvFile): Promise<Student[]>;
  parseProfessors(file: CsvFile): Promise<Professor[]>;
  exportStudents(students: Student[]): Readable;
  exportProfessors(professors: Professor[]): Readable;
}
