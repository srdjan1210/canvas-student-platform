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
  Put,
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
import { GetStudentCoursesQuery } from '../../../application/courses/queries/get-student-courses/get-student-courses.query';
import { CoursePresenter } from '../presenters/course.presenter';
import { DownloadLinkPresenter } from '../presenters/download-link.presenter';
import { CourseFilePresenter } from '../presenters/course-file.presenter';
import { CreateFolderCommand } from '../../../application/courses/commands/create-folder/create-folder.command';
import { GetProfessorCoursesQuery } from '../../../application/courses/queries/get-professor-courses/get-professor-courses.query';
import { FileExtensionValidator } from '../validators/file-extension.validator';

@Controller('courses')
export class CourseController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles(UserRole.PROFESSOR)
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtGuard, RoleGuard)
  @Put('folder/:folder/upload/file')
  async uploadCourseFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileExtensionValidator({
            regex: /\.(pdf|txt|ppt|xsl|java|ts|js|json)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 100000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() { user }: ReqWithUser,
    @Param('folder') folder: string,
  ) {
    return await this.commandBus.execute(
      new UploadCourseFileCommand(
        user.professor.id,
        folder,
        file.originalname,
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
    const downloadLink = await this.commandBus.execute(
      new DownloadCourseFileCommand(folder, file),
    );
    return new DownloadLinkPresenter(downloadLink);
  }

  @UseGuards(JwtGuard)
  @Get('/list/folder/:folder')
  async listFolder(@Param('folder') folder: string) {
    const files = await this.queryBus.execute(
      new ListCourseFolderQuery(folder),
    );

    if (!files) return [];
    return files.map((file) => new CourseFilePresenter(file));
  }

  @UseGuards(JwtGuard)
  @Get('/list/folder')
  async listRoot() {
    return await this.queryBus.execute(new ListCourseFolderQuery(''));
  }

  @UseGuards(JwtGuard)
  @Post('/folder/:folder')
  async createFolder(@Param('folder') folder: string) {
    await this.commandBus.execute(new CreateFolderCommand(folder));
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:title/professors/add')
  async addProfessorsToCourse(
    @Body() { professors }: AddProfessorsToCourseDto,
    @Param('title') courseTitle: string,
  ) {
    await this.commandBus.execute(
      new AddProfessorsToCourseCommand(professors, courseTitle),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/')
  async createCourse(
    @Body() { title, year, espb, description }: CreateCourseDto,
  ) {
    const course = await this.commandBus.execute(
      new CreateCourseCommand(title, year, espb, description),
    );
    return new CourseCreatedPresenter(course);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:title/students/add')
  async addStudentsToCourse(
    @Body() { students }: AddStudentsToCourseDto,
    @Param('title') courseTitle: string,
  ) {
    await this.commandBus.execute(
      new AddStudentsToCourseCommand(students, courseTitle),
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

  @Roles(UserRole.STUDENT)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/student')
  async getStudentCourses(@Req() { user }: ReqWithUser) {
    const courses = await this.queryBus.execute(
      new GetStudentCoursesQuery(user.student.id),
    );

    return courses.map((course) => new CoursePresenter(course));
  }
  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/professor')
  async getProfessorCourses(@Req() { user }: ReqWithUser) {
    const courses = await this.queryBus.execute(
      new GetProfessorCoursesQuery(user.professor.id),
    );

    return courses.map((course) => new CoursePresenter(course));
  }
}
