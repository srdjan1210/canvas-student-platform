import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../domain/auth/role.enum';
import { SearchStudentsQuery } from '../../application/specialization/queries/search-students/search-students.query';
import { SearchProfessorQuery } from '../../application/specialization/queries/search-professors/search-professor.query';
import { ProfessorPresenter } from '../presenters/professor.presenter';
import { StudentPresenter } from '../presenters/student.presenter';
import { GetStudentsNotAttendingCourseQuery } from '../../application/specialization/queries/get-students-not-attending/get-students-not-attending-course.query';
import { GetProfessorsNotCourseMembersQuery } from '../../application/specialization/queries/get-professors-not-course-members/get-professors-not-course-members.query';
import { Response } from 'express';
import { ExportStudentsQuery } from '../../application/specialization/queries/export-students/export-students.query';
import { ExportProfessorsQuery } from '../../application/specialization/queries/export-professors/export-professors.query';

@Controller('specialization')
export class SpecializationController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(JwtGuard, RoleGuard)
  @Get('students')
  async getStudents(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ) {
    const students = await this.queryBus.execute(
      new SearchStudentsQuery(search, page, limit),
    );
    return students.map((student) => new StudentPresenter(student));
  }

  @UseGuards(JwtGuard, RoleGuard)
  @Get('professors')
  async getProfessors(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ) {
    const professors = await this.queryBus.execute(
      new SearchProfessorQuery(search, page, limit),
    );
    return professors.map((professor) => new ProfessorPresenter(professor));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/students/course/:title/not-attendee')
  async getStudentsNotAttendees(
    @Param('title') course: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ) {
    const students = await this.queryBus.execute(
      new GetStudentsNotAttendingCourseQuery(course, search, page, limit),
    );

    return students.map((student) => new StudentPresenter(student));
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/professors/course/:title/not-member')
  async getProfessorsNotMembers(
    @Param('title') course: string,
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('search') search: string,
  ) {
    const professors = await this.queryBus.execute(
      new GetProfessorsNotCourseMembersQuery(course, search, page, limit),
    );
    return professors.map((professor) => new ProfessorPresenter(professor));
  }

  @Get('/students/csv')
  async exportStudentsToCsv(@Res() res: Response) {
    const stream = await this.queryBus.execute(new ExportStudentsQuery());
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="students.csv"',
    });
    stream.pipe(res);
  }

  @Get('/professors/csv')
  async exportProfessorsToCsv(@Res() res: Response) {
    const stream = await this.queryBus.execute(new ExportProfessorsQuery());
    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="professors.csv"',
    });
    stream.pipe(res);
  }
}
