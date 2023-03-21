import { IHashingService } from '../../../application/auth/interfaces/hashing-service.interfaces';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService implements IHashingService {
  comparePassword(
    password: string,
    existingPassword: string,
  ): Promise<boolean> {
    console.log(password, existingPassword);
    return bcrypt.compare(password, existingPassword);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
