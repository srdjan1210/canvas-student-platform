import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { CreateUserCommandHandler } from '../../application/auth/commands/create-user/create-user-command.handler';
import {
  HASHING_SERVICE,
  JWT_EXPIRES_IN,
  JWT_SECRET,
  JWT_SERVICE,
  USER_REPOSITORY,
} from '../../application/auth/auth.constants';
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
import { LoginCommandHandler } from '../../application/auth/commands/login/login-command.handler';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AccountCreatedEventHandler } from '../../application/auth/events/account-created-event.handler';
import { RegisterProfessorCommandHandler } from '../../application/auth/commands/register-professor/register-professor-command.handler';
import { RegisterStudentCommandHandler } from '../../application/auth/commands/register-student/register-student-command.handler';

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
