import { IsArray } from 'class-validator';

export class AddProfessorsToCourseDto {
  @IsArray()
  professors: number[];
}
