import { IsArray } from 'class-validator';

export class AddStudentsToCourseDto {
  @IsArray()
  students: number[];
}
