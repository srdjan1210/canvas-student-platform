import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RegisterStudentCommand } from './register-student.command';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { HASHING_SERVICE, USER_REPOSITORY } from '../../auth.constants';
import { IUserRepository } from '../../../../domain/auth/interfaces/user-repository.interface';
import { IHashingService } from '../../interfaces/hashing-service.interfaces';
import { User } from '../../../../domain/auth/user';
import { Student } from '../../../../domain/specialization/model/student';
import { EmailAlreadyTakenException } from '../../../../domain/auth/exceptions/email-already-taken.exception';

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
    const student = Student.create({
      name,
      surname,
      specializationName,
      indexNumber,
      year,
      fullIndex: this.createFullIndex(specializationName, indexNumber, year),
    });
    const user = User.create({
      email,
      password: hashedPassword,
      role,
      student,
    });

    const exists = await this.userRepository.findByEmail(user.email);
    if (exists) throw new EmailAlreadyTakenException();

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
