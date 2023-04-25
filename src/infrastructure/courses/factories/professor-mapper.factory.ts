import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { IEntityMapperFactory } from '../../shared/factories/entity-mapper-factory.interface';
import { ProfessorEntity } from '@prisma/client';
import { Professor } from '../../../domain/specialization/model/professor';

@Injectable()
export class ProfessorMapperFactory
  implements IEntityMapperFactory<ProfessorEntity, Professor>
{
  fromEntity({ id, title, name, surname, userId }: ProfessorEntity): Professor {
    return Professor.create({ id, name, surname, title, userId });
  }

  fromModel({ id, title, name, surname, userId }: Professor): ProfessorEntity {
    return {
      id,
      title,
      name,
      surname,
      userId,
    };
  }
}
