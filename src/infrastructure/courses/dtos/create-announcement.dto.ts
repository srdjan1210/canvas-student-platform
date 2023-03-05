import { IsString } from 'class-validator';

export class CreateAnnouncementDto {
  @IsString()
  title: string;
  @IsString()
  body: string;
}
