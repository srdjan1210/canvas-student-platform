import { UserRole } from "./role.enum";

export type TokenPayload = {
  email: string,
  role: UserRole,
  id: number
}