export interface IHashingService {
  hashPassword(password: string): Promise<string>;
  comparePassword(password: string, existingPassword: string): Promise<boolean>;
}
