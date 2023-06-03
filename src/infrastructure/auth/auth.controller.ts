import {
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from '../../application/auth/commands/login/login.command';
import { RegisterProfessorCommand } from '../../application/auth/commands/register-professor/register-professor.command';
import { RegisterStudentCommand } from '../../application/auth/commands/register-student/register-student.command';
import { UserRole } from '../../domain/auth/role.enum';
import { DomainErrorFilter } from '../error-handling/domain-error.filter';
import { Roles } from './decorators/role.decorator';
import { LoginDto } from './dtos/login.dto';
import { RegisterProfessorDto } from './dtos/register-professor.dto';
import { RegisterStudentDto } from './dtos/register-student.dto';
import { JwtGuard } from './guards/jwt.guard';
import { ReqWithUser, RoleGuard } from './guards/role.guard';
import { LoggedInPresenter } from './presenters/logged-in.presenter';
import { ProfilePresenter } from './presenters/profile.presenter';
import { UserRegisteredPresenter } from './presenters/user-registered.presenter';

@Controller('auth')
@UseFilters(DomainErrorFilter)
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(@Body() { email, password }: LoginDto) {
    const token = await this.commandBus.execute(
      new LoginCommand(email, password),
    );
    return new LoggedInPresenter(token);
  }

  @Post('/register/student')
  async registerStudent(
    @Body()
    {
      email,
      password,
      name,
      surname,
      indexNumber,
      year,
      specialization,
    }: RegisterStudentDto,
  ) {
    const user = await this.commandBus.execute(
      new RegisterStudentCommand(
        email,
        password,
        UserRole.STUDENT,
        name,
        surname,
        specialization,
        indexNumber,
        year,
      ),
    );
    return new UserRegisteredPresenter(user);
  }

  @Post('/register/professor')
  async registerProfessor(
    @Body() { email, password, name, surname, title }: RegisterProfessorDto,
  ) {
    const user = await this.commandBus.execute(
      new RegisterProfessorCommand(
        email,
        password,
        UserRole.PROFESSOR,
        name,
        surname,
        title,
      ),
    );
    return new UserRegisteredPresenter(user);
  }

  @Roles(UserRole.PROFESSOR, UserRole.STUDENT, UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('/me')
  async getProfile(@Req() { user }: ReqWithUser) {
    return new ProfilePresenter(user);
  }
}
