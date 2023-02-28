import { IStudentRepository } from '../../../core/specialization/domain/interfaces/student-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Student } from '../../../core/specialization/domain/student';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { StudentMapperFactory } from '../factories/student-mapper.factory';
import { PersonDto } from '../../../core/specialization/domain/person.dto';

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
