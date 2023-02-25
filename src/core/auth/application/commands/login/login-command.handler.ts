import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginCommand } from './login.command';
import {
  HASHING_SERVICE,
  JWT_SERVICE,
  USER_REPOSITORY,
} from '../../auth.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { IJwtService } from '../../interfaces/jwt-service.interface';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { InvalidCredentialsException } from '../../exceptions/invalid-credentials.exception';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
    @Inject(JWT_SERVICE) private readonly jwtService: IJwtService,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
  ) {}

  async execute({ email, password }: LoginCommand): Promise<string> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new InvalidCredentialsException();

    const isPasswordCorrect = await this.hashingService.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordCorrect) throw new InvalidCredentialsException();
    return await this.jwtService.generateToken({
      role: user.role,
      id: user.id,
      email,
    });
  }
}
