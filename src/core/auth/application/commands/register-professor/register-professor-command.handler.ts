import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterProfessorCommand } from './register-professor.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { User } from '../../../domain/user';
import { Professor } from '../../../../specialization/domain/professor';

@CommandHandler(RegisterProfessorCommand)
export class RegisterProfessorCommandHandler
  implements ICommandHandler<RegisterProfessorCommand>
{
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    @Inject(HASHING_SERVICE) private readonly hashingService: IHashingService,
    private readonly eventBus: EventPublisher,
  ) {}
  async execute({
    email,
    password,
    role,
    surname,
    title,
    name,
  }: RegisterProfessorCommand): Promise<User> {
    const hashedPassword = await this.hashingService.hashPassword(password);
    const professor = new Professor(null, name, surname, title);
    const user: User = new User(
      null,
      email,
      hashedPassword,
      role,
      null,
      professor,
    );

    const createdUser = this.eventBus.mergeObjectContext(
      await this.userRepository.createProfessor(user),
    );
    createdUser.createAccount();
    createdUser.commit();
    return createdUser;
  }
}
