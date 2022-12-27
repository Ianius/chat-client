import { Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../../shared';

export interface MessageData {
    time: Date;
    nickname: string;
    message: string;
    system: boolean;
}

export type ChatClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
