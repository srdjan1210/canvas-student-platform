import { PrismaClient, SpecializationEntity } from '@prisma/client';
import { UserRole } from '../../../domain/auth/role.enum';

const prisma = new PrismaClient();

const getSpecialization = (
  shortName: string,
  name: string,
): SpecializationEntity => {
  return {
    name,
    shortName,
    id: undefined,
  };
};

async function main() {
  const specialization = getSpecialization('RA', 'Racunarstvo i automatika');
  // await prisma.specializationEntity.create({
  //   data: specialization,
  // });
  await prisma.userEntity.create({
    data: {
      email: 'admin@gmail.com',
      password: '$2b$10$56lZVSSC6r01u8FuAj82GuGUkRQssezIlvc7CKt0zE/JcslMDreZK',
      role: UserRole.ADMINISTRATOR,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
