import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateUserCommand } from "./create-user.command";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { USER_REPOSITORY } from "../../auth.constants";
import { Inject } from "@nestjs/common/decorators/core/inject.decorator";
import { IUserRepository } from "../../../domain/interfaces/user-repository.interface";
import { User } from "../../../domain/user";

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository
  ) {
  }
    async execute({email, password, role}: CreateUserCommand): Promise<any> {
      const user: User = new User(null, email, password, role)
      const saved = await this.userRepository.create(user)
      return saved;
    }
}