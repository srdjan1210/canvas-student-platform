import { PrismaClient, SpecializationEntity } from '@prisma/client';

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
  await prisma.specializationEntity.create({
    data: specialization,
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
