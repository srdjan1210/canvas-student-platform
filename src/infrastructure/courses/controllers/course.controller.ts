import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Req,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CourseFileDto } from '../dtos/course-file.dto';
import { UploadCourseFileCommand } from '../../../application/courses/commands/upload-course-file/upload-course-file.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { DownloadCourseFileCommand } from '../../../application/courses/commands/download-course-file/download-course-file.command';
import { ListCourseFolderQuery } from '../../../application/courses/queries/list-course-folder/list-course-folder.query';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { CreateCourseCommand } from '../../../application/courses/commands/create-course/create-course.command';
import { CourseCreatedPresenter } from '../presenters/course-created.presenter';
import { AddStudentsToCourseDto } from '../dtos/add-students-to-course.dto';
import { AddStudentsToCourseCommand } from '../../../application/courses/commands/add-student-to-course/add-students-to-course.command';
import { AddProfessorsToCourseCommand } from '../../../application/courses/commands/add-professor-to-course/add-professors-to-course.command';
import { AddProfessorsToCourseDto } from '../dtos/add-professors-to-course.dto';
import { ReqWithUser, RoleGuard } from '../../auth/guards/role.guard';
import { CreateAnnouncementDto } from '../dtos/create-announcement.dto';
import { AddAnnouncementCommand } from '../../../application/courses/commands/add-announcement/add-announcement.command';
import { UserRole } from '../../../domain/auth/role.enum';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.PROFESSOR)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:id/upload/file')
  async uploadCourseFile(
    @Body() { filename }: CourseFileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'pdf' }),
          new MaxFileSizeValidator({ maxSize: 200000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() { user }: ReqWithUser,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    return await this.commandBus.execute(
      new UploadCourseFileCommand(
        user.professor.id,
        courseId,
        filename,
        file.buffer,
      ),
    );
  }

  @UseGuards(JwtGuard)
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

  @UseGuards(JwtGuard)
  @Get('/list/folder/:folder')
  async listFolder(@Param('folder') folder: string) {
    return await this.queryBus.execute(new ListCourseFolderQuery(folder));
  }

  @UseGuards(JwtGuard)
  @Get('/list/folder')
  async listRoot() {
    return await this.queryBus.execute(new ListCourseFolderQuery(''));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:id/professors/add')
  async addProfessorsToCourse(
    @Body() { professors }: AddProfessorsToCourseDto,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    await this.commandBus.execute(
      new AddProfessorsToCourseCommand(professors, courseId),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/')
  async createCourse(@Body() { title, year, espb }: CreateCourseDto) {
    const course = await this.commandBus.execute(
      new CreateCourseCommand(title, year, espb),
    );
    return new CourseCreatedPresenter(course);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:id/students/add')
  async addStudentsToCourse(
    @Body() { students }: AddStudentsToCourseDto,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    await this.commandBus.execute(
      new AddStudentsToCourseCommand(students, courseId),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:id/announcement')
  async postAnnouncement(
    @Req() { user }: ReqWithUser,
    @Body() { title, body }: CreateAnnouncementDto,
    @Param('id', ParseIntPipe) courseId: number,
  ) {
    await this.commandBus.execute(
      new AddAnnouncementCommand(title, body, user.professor.id, courseId),
    );
    return { status: 'SUCCESS' };
  }
}
