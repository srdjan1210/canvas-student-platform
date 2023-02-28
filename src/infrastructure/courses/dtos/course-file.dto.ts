import { IsString } from 'class-validator';

export class CourseFileDto {
  @IsString()
  filename: string;
  @IsString()
  courseName: string;
}
