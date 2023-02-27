import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './create-user.command';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { User } from '../../../domain/user';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({ email, password, role }: CreateUserCommand): Promise<any> {
    const hashedPassword = await this.hashingService.hashPassword(password);
    const user: User = new User(null, email, hashedPassword, role, null, null);
    const createdUser = this.eventBus.mergeObjectContext(
      await this.userRepository.create(user),
    );
    createdUser.createAccount();
    createdUser.commit();
    return createdUser;
  }
}
