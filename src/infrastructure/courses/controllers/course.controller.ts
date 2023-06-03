import {
  Body,
  Controller,
  Delete,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { GetAnnouncementQuery } from 'src/application/courses/queries/get-announcement/get-announcement.query';
import { AddAnnouncementCommand } from '../../../application/courses/commands/add-announcement/add-announcement.command';
import { AddProfessorsToCourseCommand } from '../../../application/courses/commands/add-professor-to-course/add-professors-to-course.command';
import { AddStudentsToCourseCommand } from '../../../application/courses/commands/add-student-to-course/add-students-to-course.command';
import { CreateCourseCommand } from '../../../application/courses/commands/create-course/create-course.command';
import { CreateFolderCommand } from '../../../application/courses/commands/create-folder/create-folder.command';
import { DeleteFileCommand } from '../../../application/courses/commands/delete-file/delete-file.command';
import { DeleteFolderCommand } from '../../../application/courses/commands/delete-folder/delete-folder.command';
import { DownloadCourseFileCommand } from '../../../application/courses/commands/download-course-file/download-course-file.command';
import { ImportProfessorsFromCsvCommand } from '../../../application/courses/commands/import-professors-from-csv/import-professors-from-csv.command';
import { ImportStudentsFromCsvCommand } from '../../../application/courses/commands/import-students-from-csv/import-students-from-csv.command';
import { RemoveProfessorFromCourseCommand } from '../../../application/courses/commands/remove-professor-from-course/remove-professor-from-course.command';
import { RemoveStudentFromCourseCommand } from '../../../application/courses/commands/remove-student-from-course/remove-student-from-course.command';
import { UploadCourseFileCommand } from '../../../application/courses/commands/upload-course-file/upload-course-file.command';
import { ExportProfessorsToCsvQuery } from '../../../application/courses/queries/export-professors-to-csv/export-professors-to-csv.query';
import { ExportStudentsToCsvQuery } from '../../../application/courses/queries/export-students-to-csv/export-students-to-csv.query';
import { GetAllPaginatedQuery } from '../../../application/courses/queries/get-all-paginated/get-all-paginated.query';
import { GetCourseProfessorsQuery } from '../../../application/courses/queries/get-course-professors/get-course-professors.query';
import { GetCourseStudentsQuery } from '../../../application/courses/queries/get-course-students/get-course-students.query';
import { GetProfessorCoursesQuery } from '../../../application/courses/queries/get-professor-courses/get-professor-courses.query';
import { GetStudentCoursesQuery } from '../../../application/courses/queries/get-student-courses/get-student-courses.query';
import { ListCourseFolderQuery } from '../../../application/courses/queries/list-course-folder/list-course-folder.query';
import { UserRole } from '../../../domain/auth/role.enum';
import { CsvFile } from '../../../domain/shared/csv-file';
import { Roles } from '../../auth/decorators/role.decorator';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { ReqWithUser, RoleGuard } from '../../auth/guards/role.guard';
import { DomainErrorFilter } from '../../error-handling/domain-error.filter';
import { ProfessorPresenter } from '../../presenters/professor.presenter';
import { StudentPresenter } from '../../presenters/student.presenter';
import { AddProfessorsToCourseDto } from '../dtos/add-professors-to-course.dto';
import { AddStudentsToCourseDto } from '../dtos/add-students-to-course.dto';
import { CreateAnnouncementDto } from '../dtos/create-announcement.dto';
import { CreateCourseDto } from '../dtos/create-course.dto';
import { AnnouncementPresenter } from '../presenters/announcement.presenter';
import { CourseCreatedPresenter } from '../presenters/course-created.presenter';
import { CourseFilePresenter } from '../presenters/course-file.presenter';
import { CoursePresenter } from '../presenters/course.presenter';
import { DownloadLinkPresenter } from '../presenters/download-link.presenter';
import { FileExtensionValidator } from '../validators/file-extension.validator';
import { ListCourseFileTreeQuery } from '../../../application/courses/queries/list-course-file-tree/list-course-file-tree.query';
import { GetCourseAnnouncementsQuery } from '../../../application/courses/queries/get-course-announcements/get-course-announcements.query';
@Controller('courses')
@UseFilters(DomainErrorFilter)
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
        user.id,
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
  async listFolder(
    @Param('folder') folder: string,
    @Req() { user }: ReqWithUser,
  ) {
    const files = await this.queryBus.execute(
      new ListCourseFolderQuery(user.id, folder),
    );

    if (!files) return [];
    return files.map((file) => new CourseFilePresenter(file));
  }

  @UseGuards(JwtGuard)
  @Get('/:title/files/tree')
  async listFileTree(
    @Param('title') title: string,
    @Req() { user }: ReqWithUser,
  ) {
    const files = await this.queryBus.execute(
      new ListCourseFileTreeQuery(user.id, title),
    );
    return files;
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('/folder/:folder')
  async deleteFolder(
    @Req() { user }: ReqWithUser,
    @Param('folder') folder: string,
  ) {
    console.log(folder);
    await this.commandBus.execute(new DeleteFolderCommand(user.id, folder));
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('/file/:path')
  async deleteFile(@Req() { user }: ReqWithUser, @Param('path') path: string) {
    await this.commandBus.execute(new DeleteFileCommand(user.id, path));
    return { status: 'SUCCESS' };
  }

  @UseGuards(JwtGuard)
  @Get('/list/folder')
  async listRoot(@Req() { user }: ReqWithUser) {
    return await this.queryBus.execute(new ListCourseFolderQuery(user.id, ''));
  }

  @UseGuards(JwtGuard)
  @Post('/folder/:folder')
  async createFolder(
    @Param('folder') folder: string,
    @Req() { user }: ReqWithUser,
  ) {
    await this.commandBus.execute(new CreateFolderCommand(user.id, folder));
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
  @Get('/')
  async getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const courses = await this.queryBus.execute(
      new GetAllPaginatedQuery(page, limit),
    );
    return courses.map((course) => new CoursePresenter(course));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:title/students')
  async getCourseStudents(
    @Param('title') title: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const students = await this.queryBus.execute(
      new GetCourseStudentsQuery(title, page, limit),
    );
    return students.map((student) => new StudentPresenter(student));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('/:title/students/:id')
  async removeStudentFromCourse(
    @Param('title') title: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.commandBus.execute(
      new RemoveStudentFromCourseCommand(title, id),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('/:title/professors/:id')
  async removeProfessorFromCourse(
    @Param('title') title: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.commandBus.execute(
      new RemoveProfessorFromCourseCommand(title, id),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:title/professors')
  async getCourseProfessors(
    @Param('title') title: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
  ) {
    const professors = await this.queryBus.execute(
      new GetCourseProfessorsQuery(title, page, limit),
    );
    return professors.map((professor) => new ProfessorPresenter(professor));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:title/professors/csv')
  async exportProfessorsToCsv(
    @Param('title') title: string,
    @Res() res: Response,
  ) {
    const stream = await this.queryBus.execute(
      new ExportProfessorsToCsvQuery(title),
    );

    const filename = `${title}-professors.csv`;

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    stream.pipe(res);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:title/students/add')
  async addStudentsToCourse(
    @Body() { students }: AddStudentsToCourseDto,
    @Param('title') title: string,
  ) {
    await this.commandBus.execute(
      new AddStudentsToCourseCommand(students, title),
    );
    return { status: 'SUCCESS' };
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/:title/students/csv')
  async exportStudentsToCsv(
    @Param('title') title: string,
    @Res() res: Response,
  ) {
    const stream = await this.queryBus.execute(
      new ExportStudentsToCsvQuery(title),
    );

    const filename = `${title}-students.csv`;

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    });

    stream.pipe(res);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:title/students/parse')
  async parseStudentsFromCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileExtensionValidator({
            regex: /\.(csv)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 100000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('title') title: string,
  ) {
    const fl = new CsvFile(file.buffer, file.originalname, file.mimetype);
    const students = await this.commandBus.execute(
      new ImportStudentsFromCsvCommand(title, fl),
    );
    return students.map((student) => new StudentPresenter(student));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @UseInterceptors(FileInterceptor('file'))
  @Post('/:title/professors/parse')
  async parseProfessorsFromCsv(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileExtensionValidator({
            regex: /\.(csv)$/,
          }),
          new MaxFileSizeValidator({ maxSize: 100000000 }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('title') title: string,
  ) {
    const fl = new CsvFile(file.buffer, file.originalname, file.mimetype);
    const professors = await this.commandBus.execute(
      new ImportProfessorsFromCsvCommand(title, fl),
    );
    return professors.map((prof) => new ProfessorPresenter(prof));
  }

  @Roles(UserRole.PROFESSOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/:title/announcements')
  async createAnnouncement(
    @Req() { user }: ReqWithUser,
    @Body() { title, body }: CreateAnnouncementDto,
    @Param('title') course,
  ) {
    await this.commandBus.execute(
      new AddAnnouncementCommand(title, body, user.professor.id, course),
    );
    return { status: 'SUCCESS' };
  }

  @UseGuards(JwtGuard)
  @Get('/:title/announcements')
  async getCourseAnnouncements(
    @Req() { user }: ReqWithUser,
    @Param('title') title,
  ) {
    const announcements = await this.queryBus.execute(
      new GetCourseAnnouncementsQuery(user.id, title),
    );
    return announcements.map((ann) => new AnnouncementPresenter(ann));
  }

  @UseGuards(JwtGuard)
  @Get('/:title/announcements/:id')
  async getAnnouncement(
    @Req() { user }: ReqWithUser,
    @Param('title') title: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const announcement = await this.queryBus.execute(
      new GetAnnouncementQuery(user.id, title, id),
    );
    return new AnnouncementPresenter(announcement);
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
