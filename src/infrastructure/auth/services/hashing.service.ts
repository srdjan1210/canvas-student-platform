import { IHashingService } from '../../../core/auth/application/interfaces/hashing-service.interfaces';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService implements IHashingService {
  comparePassword(
    password: string,
    existingPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, existingPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    return bcrypt.hash(password, salt);
  }
}
