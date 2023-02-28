import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { User } from '../../../domain/auth/user';
import { UserEntity } from '@prisma/client';
import { UserRole } from '../../../domain/auth/role.enum';

export class UserEntityMapperFactory
  implements IEntityMapperFactory<UserEntity, User>
{
  userRoles = {
    ADMINISTRATOR: UserRole.ADMINISTRATOR,
    PROFESSOR: UserRole.PROFESSOR,
    STUDENT: UserRole.STUDENT,
  };
  fromEntity({ id, email, role, password }: UserEntity): User {
    return new User(id, email, password, this.userRoles[role], null, null);
  }

  fromModel({ id, email, role, password }: User) {
    return {
      id,
      email,
      role,
      password,
    } as UserEntity;
  }
}
