import { IsNumber, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;
  @IsNumber()
  year: number;
  @IsNumber()
  espb: number;
}
