import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CourseFileDto } from './dtos/course-file.dto';
import { UploadCourseFileCommand } from '../../core/courses/application/commands/upload-course-file/upload-course-file.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { DownloadCourseFileCommand } from '../../core/courses/application/commands/download-course-file/download-course-file.command';
import { ListCourseFolderQuery } from '../../core/courses/application/queries/list-course-folder/list-course-folder.query';
import { CreateCourseDto } from './dtos/create-course.dto';
import { CreateCourseCommand } from '../../core/courses/application/commands/create-course/create-course.command';
import { CourseCreatedPresenter } from './presenters/course-created.presenter';
import { AddStudentsToCourseDto } from './dtos/add-students-to-course.dto';
import { AddStudentsToCourseCommand } from '../../core/courses/application/commands/add-student-to-course/add-students-to-course.command';
import { AddProfessorsToCourseCommand } from '../../core/courses/application/commands/add-professor-to-course/add-professors-to-course.command';
import { AddProfessorsToCourseDto } from './dtos/add-professors-to-course.dto';

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

  @Post('/')
  async createCourse(@Body() { title, year, espb }: CreateCourseDto) {
    const course = await this.commandBus.execute(
      new CreateCourseCommand(title, year, espb),
    );
    return new CourseCreatedPresenter(course);
  }

  @Post('/students/add')
  async addStudentsToCourse(
    @Body() { students, courseId }: AddStudentsToCourseDto,
  ) {
    await this.commandBus.execute(
      new AddStudentsToCourseCommand(students, courseId),
    );
    return { status: 'SUCCESS' };
  }

  @Post('/professors/add')
  async addProfessorsToCourse(
    @Body() { professors, courseId }: AddProfessorsToCourseDto,
  ) {
    await this.commandBus.execute(
      new AddProfessorsToCourseCommand(professors, courseId),
    );
    return { status: 'SUCCESS' };
  }
}
