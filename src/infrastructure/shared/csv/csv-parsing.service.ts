import { ICsvParsingService } from '../../../application/shared/interfaces/csv-parsing-service.interface';
import { Student } from '../../../domain/specialization/model/student';
import { CsvParser } from 'nest-csv-parser';
import { CsvFile } from '../../../domain/shared/csv-file';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { CSVStudent } from '../../../domain/shared/csv-student';
import { Professor } from '../../../domain/specialization/model/professor';
import { CSVProfessor } from '../../../domain/shared/csv-professor';
import { Readable } from 'stream';

@Injectable()
export class CsvParsingService implements ICsvParsingService {
  constructor(private readonly csvParser: CsvParser) {}

  exportStudents(students: Student[]) {
    const columns = [
      'id',
      'name',
      'surname',
      'specializationName',
      'indexNumber',
      'year',
      'fullIndex',
    ];

    return this.parseToCsv(columns, students);
  }
  exportProfessors(professors: Professor[]): Readable {
    const columns = ['id', 'name', 'surname', 'title'];
    return this.parseToCsv(columns, professors);
  }
  async parseStudents(file: CsvFile): Promise<Student[]> {
    const result = await this.csvParser.parse(
      file.stream(),
      CSVStudent,
      null,
      null,
      {
        strict: true,
        separator: ',',
      },
    );
    return result.list.map(
      (csv) =>
        new Student(
          null,
          csv.name,
          csv.surname,
          csv.specializationName,
          null,
          parseInt(csv.indexNumber),
          parseInt(csv.year),
          csv.fullIndex,
        ),
    );
  }

  async parseProfessors(file: CsvFile): Promise<Professor[]> {
    const result = await this.csvParser.parse(
      file.stream(),
      CSVProfessor,
      null,
      null,
      {
        strict: true,
        separator: ',',
      },
    );
    return result.list.map(
      (csv) =>
        new Professor(parseInt(csv.id), csv.name, csv.surname, csv.title, null),
    );
  }

  private parseToCsv(columns: string[], objects: any[]): Readable {
    const header = columns.join(',') + '\n';
    const body = objects
      .map((obj) => columns.map((col) => obj[col]).join(','))
      .join('\n');
    const csv = header + body;

    const stream = new Readable();
    stream.push(csv);
    stream.push(null);
    return stream;
  }
}
