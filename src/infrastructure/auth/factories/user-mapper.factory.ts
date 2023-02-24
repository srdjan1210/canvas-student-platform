import { IEntityMapperFactory } from "../../shared/factories/entity-mapper-factory.interface";
import { User } from "../../../core/auth/domain/user";
import {
  UserEntity,
  UserEntityRole
} from "@prisma/client";
import { UserRole } from "../../../core/auth/domain/role.enum";

export class UserEntityMapperFactory implements IEntityMapperFactory<UserEntity, User> {
  userRoles = {
    'ADMINISTRATOR': UserRole.ADMINISTRATOR,
    'PROFESSOR': UserRole.PROFESSOR,
    'STUDENT': UserRole.STUDENT
  }
  fromEntity({id, email, role, password}: UserEntity): User {
    return new User(id, email, password, this.userRoles[role]);
  }

  fromModel({id, email, role, password}: User) {
    return {
      id,
      email,
      role,
      password
    } as UserEntity
  }
}