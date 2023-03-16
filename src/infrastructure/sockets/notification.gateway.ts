import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { AnnouncementCreatedPayload } from '../../application/courses/events/internal/announcement-created-payload.dto';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  private connections: Map<Socket, number> = new Map();

  @SubscribeMessage('register')
  registerUser(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
    this.connections.set(client, data);
  }
  @OnEvent('announcement.created')
  handleAnnouncementCreated({ ids, notification }: AnnouncementCreatedPayload) {
    this.connections.forEach((value: number, key: Socket) => {
      if (ids.includes(value))
        key.emit('notification', {
          id: notification.id,
          body: notification.body,
          title: notification.title,
          professorName: notification.professor.name,
          professorSurname: notification.professor.surname,
        });
    });
  }
}
