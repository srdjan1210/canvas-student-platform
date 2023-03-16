import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { UserRole } from '../../domain/auth/role.enum';
import { SearchAndPaginationDto } from './dtos/search-and-pagination.dto';
import { SearchStudentsQuery } from '../../application/specialization/queries/search-students/search-students.query';
import { SearchProfessorQuery } from '../../application/specialization/queries/search-professors/search-professor.query';
import { ProfessorPresenter } from '../presenters/professor.presenter';
import { StudentPresenter } from '../presenters/student.presenter';
import { SearchStudentsNotAttendingQuery } from '../../application/specialization/queries/get-students-not-attending/search-students-not-attending.query';

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
      new SearchStudentsNotAttendingQuery(course, search, page, limit),
    );

    return students.map((student) => new StudentPresenter(student));
  }
}
