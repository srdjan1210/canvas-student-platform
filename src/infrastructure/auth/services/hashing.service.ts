import { IHashingService } from "../../../core/auth/application/interfaces/hashing-service.interfaces";
import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import * as bcrypt from "bcrypt"

@Injectable()
export class HashingService implements IHashingService {
  comparePassword(password: string, existingPassword: string): Promise<boolean> {
    return bcrypt.compare(password, existingPassword)
  }

  hashPassword(password: string): Promise<string> {
    const salt = bcrypt.genSalt(10);
    return bcrypt.hash(password, salt)
  }
}