import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { IUserRepository } from '../../../core/auth/domain/interfaces/user-repository.interface';
import { User } from '../../../core/auth/domain/user';
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
    return this.mapperFactory.fromEntity(userEntity);
  }

  async findById(id: number): Promise<User> {
    const userEntity = await this.prisma.userEntity.findUnique({
      where: { id },
    });
    return this.mapperFactory.fromEntity(userEntity);
  }
}