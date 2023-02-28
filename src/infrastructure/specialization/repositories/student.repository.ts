import { IStudentRepository } from '../../../domain/specialization/interfaces/student-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Student } from '../../../domain/specialization/student';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { StudentMapperFactory } from '../factories/student-mapper.factory';
import { PersonDto } from '../../../domain/specialization/person.dto';

@Injectable()
export class StudentRepository implements IStudentRepository {
  constructor(
    private readonly studentMapperFactory: StudentMapperFactory,
    private readonly prisma: PrismaProvider,
  ) {}
  async findById(id: number): Promise<Student> {
    const student = await this.prisma.studentEntity.findUnique({
      where: { id },
    });
    return this.studentMapperFactory.fromEntity(student);
  }

  async findPersonalInfos(studentIds: number[]): Promise<PersonDto[]> {
    const students = await this.prisma.studentEntity.findMany({
      where: {
        id: { in: studentIds },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return students.map(
      (s) => new PersonDto(s.id, s.name, s.surname, s.user.email),
    );
  }
}
