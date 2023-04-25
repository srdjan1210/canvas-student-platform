import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { IUserRepository } from '../../../domain/auth/interfaces/user-repository.interface';
import { User } from '../../../domain/auth/user';
import { UserEntityMapperFactory } from '../factories/user-mapper.factory';
import { UserEntityRole } from '@prisma/client';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly mapperFactory: UserEntityMapperFactory,
  ) {}

  async create(user: User): Promise<User> {
    const userEntity = await this.prisma.userEntity.create({
      data: {
        email: user.email,
        password: user.password,
        role: user.role as UserEntityRole,
      },
    });
    return this.mapperFactory.fromEntity(userEntity);
  }

  async findByEmail(email: string): Promise<User> {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: { email },
    });
    if (!userEntity) return null;
    return this.mapperFactory.fromEntity(userEntity);
  }

  async findById(id: number): Promise<User> {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: { id },
    });
    return this.mapperFactory.fromEntity(userEntity);
  }

  async findByIdPopulated(id: number): Promise<User> {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: { id },
      include: {
        student: true,
        professor: true,
      },
    });
    return this.mapperFactory.fromEntity(userEntity);
  }

  async createStudent({ email, password, role, student }: User): Promise<User> {
    const user = await this.prisma.userEntity.create({
      data: {
        email,
        password,
        role,
        student: {
          create: {
            name: student.name,
            surname: student.surname,
            indexYear: student.year,
            indexNumber: student.indexNumber,
            specializationName: student.specializationName,
            fullIndex: student.fullIndex,
          },
        },
      },
    });
    return this.mapperFactory.fromEntity(user);
  }

  async createProfessor({ email, role, password, professor }: User) {
    const user = await this.prisma.userEntity.create({
      data: {
        email,
        role,
        password,
        professor: {
          create: {
            name: professor.name,
            surname: professor.surname,
            title: professor.title,
          },
        },
      },
    });
    return this.mapperFactory.fromEntity(user);
  }
}
