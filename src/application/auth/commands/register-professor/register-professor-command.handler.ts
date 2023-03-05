import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterProfessorCommand } from './register-professor.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { User } from '../../../../domain/auth/user';
import { ProfessorFactory } from '../../../../domain/specialization/factories/professor.factory';
import { UserFactory } from '../../../../domain/auth/user.factory';

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
    const professor = ProfessorFactory.create({ name, surname, title });
    const user: User = UserFactory.create({
      email,
      password: hashedPassword,
      role,
      professor,
    });

    const createdUser = this.eventBus.mergeObjectContext(
      await this.userRepository.createProfessor(user),
    );
    createdUser.createAccount();
    createdUser.commit();
    return createdUser;
  }
}
