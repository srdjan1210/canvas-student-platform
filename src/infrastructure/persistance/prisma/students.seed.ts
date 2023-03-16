import { UserRole } from '../../../domain/auth/role.enum';
import { PrismaClient, UserEntityRole } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const mockUsers = [];
  for (let i = 0; i < 20; i++) {
    mockUsers.push({
      email: `student${i}@example.com`,
      password: '$2b$10$56lZVSSC6r01u8FuAj82GuGUkRQssezIlvc7CKt0zE/JcslMDreZK',
      role: UserRole.STUDENT,
      student: {
        create: {
          name: `Student${i}`,
          surname: `Surname${i}`,
          fullIndex: `RA${i}-2023`,
          specializationName: 'RA',
          indexYear: 2023,
          indexNumber: i,
        },
      },
    });
  }
  for (const user of mockUsers) {
    await prisma.userEntity.create({
      data: user,
    });
  }
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
