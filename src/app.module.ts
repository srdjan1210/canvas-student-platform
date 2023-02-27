import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CourseModule } from './infrastructure/courses/course.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, CourseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
