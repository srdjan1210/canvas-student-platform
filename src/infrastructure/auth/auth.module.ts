import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { CreateUserCommandHandler } from "../../core/auth/application/commands/create-user/create-user-command.handler";
import { USER_REPOSITORY } from "../../core/auth/application/auth.constants";
import { Provider } from "@nestjs/common/interfaces/modules/provider.interface";
import { UserRepository } from "./repositories/user.repository";
import { PrismaModule } from "../persistance/prisma/prisma.module";
import { SharedModule } from "../shared/shared.module";
import { CqrsModule } from "@nestjs/cqrs";
import { UserEntityMapperFactory } from "./factories/user-mapper.factory";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";


const commandHandlers = [
  CreateUserCommandHandler
]

const providers: Provider[] = [
  {
    provide: USER_REPOSITORY,
    useClass: UserRepository
  },
  UserEntityMapperFactory
]
@Module({
  providers: [...commandHandlers, ...providers],
  imports: [
    PrismaModule,
    SharedModule,
    CqrsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN')
        }
      })
    })
  ],
  controllers: [],
  exports: []
})
export class AuthModule {}