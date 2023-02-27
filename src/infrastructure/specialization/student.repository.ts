import { IStudentRepository } from '../../core/specialization/domain/interfaces/student-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { Student } from '../../core/specialization/domain/student';
import { PrismaProvider } from '../persistance/prisma/prisma.provider';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';
import { StudentMapperFactory } from './factories/student-mapper.factory';

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
}
