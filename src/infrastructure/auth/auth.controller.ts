import { Controller } from '@nestjs/common/decorators/core/controller.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { Body, Post, UseGuards } from '@nestjs/common';
import { LoginCommand } from '../../core/auth/application/commands/login/login.command';
import { LoginDto } from './dtos/login.dto';
import { RegisterStudentDto } from './dtos/register-student.dto';
import { CreateUserCommand } from '../../core/auth/application/commands/create-user/create-user.command';
import { UserRole } from '../../core/auth/domain/role.enum';
import { RegisterProfessorDto } from './dtos/register-professor.dto';
import { UserRegisteredPresenter } from './presenters/user-registered.presenter';
import { LoggedInPresenter } from './presenters/logged-in.presenter';
import { Roles } from './decorators/role.decorator';
import { JwtGuard } from './guards/jwt.guard';
import { RoleGuard } from './guards/role.guard';

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

  @Post('/register/student')
  async registerStudent(@Body() { email, password }: RegisterStudentDto) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(email, password, UserRole.STUDENT),
    );
    return new UserRegisteredPresenter(user);
  }

  @Roles(UserRole.ADMINISTRATOR)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('/register/professor')
  async registerProfessor(@Body() { email, password }: RegisterProfessorDto) {
    const user = await this.commandBus.execute(
      new CreateUserCommand(email, password, UserRole.PROFESSOR),
    );
    return new UserRegisteredPresenter(user);
  }
}
