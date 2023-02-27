import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CreateUserCommandHandler } from '../../core/auth/application/commands/create-user/create-user-command.handler';
import {
  HASHING_SERVICE,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_SERVICE,
  USER_REPOSITORY,
} from '../../core/auth/application/auth.constants';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { UserRepository } from './repositories/user.repository';
import { PrismaModule } from '../persistance/prisma/prisma.module';
import { SharedModule } from '../shared/shared.module';
import { CqrsModule } from '@nestjs/cqrs';
import { UserEntityMapperFactory } from './factories/user-mapper.factory';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTService } from './services/jwt.service';
import { HashingService } from './services/hashing.service';
import { LoginCommandHandler } from '../../core/auth/application/commands/login/login-command.handler';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccountCreatedEvent } from '../../core/auth/events/account-created/account-created.event';
import { AccountCreatedEventHandler } from '../../core/auth/events/account-created/account-created-event.handler';
import { RegisterProfessorCommandHandler } from '../../core/auth/application/commands/register-professor/register-professor-command.handler';
import { RegisterStudentCommandHandler } from '../../core/auth/application/commands/register-student/register-student-command.handler';

const commandHandlers = [
  CreateUserCommandHandler,
  LoginCommandHandler,
  RegisterProfessorCommandHandler,
  RegisterStudentCommandHandler,
];
const eventHandlers = [AccountCreatedEventHandler];

const providers: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository,
  },
  {
    provide: HASHING_SERVICE,
    useClass: HashingService,
  },
  {
    provide: JWT_SERVICE,
    useClass: JWTService,
  },
  JwtStrategy,
  UserEntityMapperFactory,
];
@Module({
  providers: [...commandHandlers, ...providers, ...eventHandlers],
  imports: [
    PrismaModule,
    SharedModule,
    CqrsModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(JWT_SECRET),
        signOptions: {
          expiresIn: configService.get(JWT_EXPIRES_IN),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
