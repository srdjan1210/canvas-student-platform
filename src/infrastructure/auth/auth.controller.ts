import { Controller } from "@nestjs/common/decorators/core/controller.decorator";
import { CommandBus } from "@nestjs/cqrs";

@Controller()
export class AuthController {

  constructor(
    private readonly commandBus: CommandBus
  ) {
  }
}