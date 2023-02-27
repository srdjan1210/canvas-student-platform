import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { StudentRepository } from './student.repository';
import { STUDENT_REPOSITORY } from '../../core/specialization/domain/specialization.constants';
import { Provider } from '@nestjs/common/interfaces/modules/provider.interface';
import { StudentMapperFactory } from './factories/student-mapper.factory';

const providers: Provider[] = [
  {
    provide: STUDENT_REPOSITORY,
    useClass: StudentRepository,
  },
  StudentMapperFactory,
];
@Module({
  providers: [...providers],
  exports: [STUDENT_REPOSITORY],
})
export class SpecializationModule {}
