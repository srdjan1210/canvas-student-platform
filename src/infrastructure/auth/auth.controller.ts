import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { Body, Post, UseGuards } from '@nestjs/common';
import { LoginCommand } from '../../application/auth/commands/login/login.command';
import { LoginDto } from './dtos/login.dto';
import { RegisterStudentDto } from './dtos/register-student.dto';
import { UserRole } from '../../domain/auth/role.enum';
import { RegisterProfessorDto } from './dtos/register-professor.dto';
import { UserRegisteredPresenter } from './presenters/user-registered.presenter';
import { LoggedInPresenter } from './presenters/logged-in.presenter';
import { Roles } from './decorators/role.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';
import { RegisterProfessorCommand } from '../../application/auth/commands/register-professor/register-professor.command';
import { RegisterStudentCommand } from '../../application/auth/commands/register-student/register-student.command';

@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/login')
  async login(@Body() { email, password }: LoginDto) {
    const token = await this.commandBus.execute(
      new LoginCommand(email, password),
    );
    return new LoggedInPresenter(token);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
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

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
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
}
