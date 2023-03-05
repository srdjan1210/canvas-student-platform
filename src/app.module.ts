import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './infrastructure/auth/auth.module';
import { CourseModule } from './infrastructure/courses/course.module';
import { WebsocketModule } from './infrastructure/sockets/websocket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    ConfigModule.forRoot(),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    AuthModule,
    CourseModule,
    WebsocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
