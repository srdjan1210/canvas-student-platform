import { IProfessorRepository } from '../../../domain/specialization/interfaces/professor-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { PersonDto } from '../../../domain/specialization/person.dto';

@Injectable()
export class ProfessorRepository implements IProfessorRepository {
  constructor(private readonly prisma: PrismaProvider) {}
  async findPersonalInfos(professorIds: number[]): Promise<PersonDto[]> {
    const professors = await this.prisma.professorEntity.findMany({
      where: {
        id: { in: professorIds },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return professors.map(
      (p) => new PersonDto(p.id, p.name, p.surname, p.user.email),
    );
  }
}
