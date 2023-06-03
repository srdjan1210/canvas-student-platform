import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import NotificationGateway from './notification.gateway';

@Module({
  providers: [NotificationGateway],
  imports: [ConfigModule, AuthModule],
})
export class WebsocketModule {}
