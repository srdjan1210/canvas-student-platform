import { IProfessorRepository } from '../../../domain/specialization/interfaces/professor-repository.interface';
import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { PrismaProvider } from '../../persistance/prisma/prisma.provider';
import { PersonDto } from '../../../domain/specialization/person.dto';
import { Professor } from '../../../domain/specialization/model/professor';
import { ProfessorMapperFactory } from '../../courses/factories/professor-mapper.factory';
import { CourseMemberSearchParams } from '../../../domain/specialization/types/course-member-search.type';

@Injectable()
export class ProfessorRepository implements IProfessorRepository {
  constructor(
    private readonly prisma: PrismaProvider,
    private readonly professorMapperFactory: ProfessorMapperFactory,
  ) {}
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

  async findById(id: number): Promise<Professor> {
    const professor = await this.prisma.professorEntity.findUnique({
      where: { id },
    });
    return this.professorMapperFactory.fromEntity(professor);
  }

  async searchProfessors(
    text: string,
    page: number,
    limit: number,
  ): Promise<Professor[]> {
    const professors = await this.prisma.professorEntity.findMany({
      where: {
        OR: [
          {
            name: {
              contains: text,
              mode: 'insensitive',
            },
          },
          {
            surname: {
              contains: text,
              mode: 'insensitive',
            },
          },
        ],
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    return professors.map((professor) =>
      this.professorMapperFactory.fromEntity(professor),
    );
  }

  async findAllNotCourseAttendees({
    course,
    page,
    limit,
    text,
  }: CourseMemberSearchParams): Promise<Professor[]> {
    const professors = await this.prisma.professorEntity.findMany({
      where: {
        AND: [
          {
            courses: {
              none: {
                title: course,
              },
            },
          },
          {
            OR: [
              {
                name: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
              {
                surname: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
              {
                title: {
                  contains: text,
                  mode: 'insensitive',
                },
              },
            ],
          },
        ],
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return professors.map((p) => this.professorMapperFactory.fromEntity(p));
  }
}
