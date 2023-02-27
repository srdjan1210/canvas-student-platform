import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterStudentCommand } from './register-student.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { IUserRepository } from '../../../domain/interfaces/user-repository.interface';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { User } from '../../../domain/user';
import { Student } from '../../../../specialization/domain/student';

@CommandHandler(RegisterStudentCommand)
export class RegisterStudentCommandHandler
  implements ICommandHandler<RegisterStudentCommand>
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
    name,
    year,
    specializationName,
    indexNumber,
    surname,
  }: RegisterStudentCommand): Promise<User> {
    const hashedPassword = await this.hashingService.hashPassword(password);
    const student = new Student(
      null,
      name,
      surname,
      specializationName,
      null,
      indexNumber,
      year,
      null,
      null,
    );
    const user: User = new User(
      null,
      email,
      hashedPassword,
      role,
      student,
      null,
    );

    const createdUser = this.eventBus.mergeObjectContext(
      await this.userRepository.createStudent(user),
    );
    createdUser.createAccount();
    createdUser.commit();
    return createdUser;
  }
}
