import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CourseFileDto } from './dto/course-file.dto';
import { UploadCourseFileCommand } from '../../core/courses/application/commands/upload-course-file/upload-course-file.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { DownloadCourseFileCommand } from '../../core/courses/application/commands/download-course-file/download-course-file.command';
import { ListCourseFolderQuery } from '../../core/courses/application/queries/list-course-folder/list-course-folder.query';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload/file')
  async uploadCourseFile(
    @Body() { courseName, filename }: CourseFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'pdf' }),
          new MaxFileSizeValidator({ maxSize: 200000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.commandBus.execute(
      new UploadCourseFileCommand(courseName, filename, file.buffer),
    );
  }

  @Get('/download/folder/:folder/file/:file')
  async downloadFile(
    @Param('folder') folder: string,
    @Param('file') file: string,
  ) {
    const downloaded = await this.commandBus.execute(
      new DownloadCourseFileCommand(folder, file),
    );
    return new StreamableFile(downloaded);
  }

  @Get('/list/folder/:folder')
  async listFolder(@Param('folder') folder: string) {
    return await this.queryBus.execute(new ListCourseFolderQuery(folder));
  }

  @Get('/list/folder')
  async listRoot() {
    return await this.queryBus.execute(new ListCourseFolderQuery(''));
  }
}
