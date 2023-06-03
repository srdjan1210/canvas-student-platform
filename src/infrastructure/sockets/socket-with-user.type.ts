import { Socket } from 'socket.io';

export type SocketWithUser = Socket & { userId: number };
