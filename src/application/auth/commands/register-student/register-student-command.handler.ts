import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterStudentCommand } from './register-student.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { User } from '../../../../domain/auth/user';
import { Student } from '../../../../domain/specialization/model/student';
import { UserFactory } from '../../../../domain/auth/user.factory';

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
      this.createFullIndex(specializationName, indexNumber, year),
      null,
      null,
    );
    const user: User = UserFactory.create({
      email,
      password: hashedPassword,
      role,
      student,
    });

    const createdUser = this.eventBus.mergeObjectContext(
      await this.userRepository.createStudent(user),
    );
    createdUser.createAccount();
    createdUser.commit();
    return createdUser;
  }

  private createFullIndex(specialization: string, num: number, year: number) {
    return `${specialization}${num}-${year}`;
  }
}
