import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterStudentDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  surname: string;
  @IsString()
  @IsNotEmpty()
  specialization: string;
  @IsNumber()
  @IsNotEmpty()
  indexNumber: number;
  @IsNumber()
  @IsNotEmpty()
  year: number;
}
