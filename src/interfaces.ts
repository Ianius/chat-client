import { Socket } from "socket.io-client";

export interface ServerToClientEvents {
    messageSent: (nickname: string, message: string) => void;
    userJoinedChatroom: (nickname: string) => void;
    userLeftChatroom: (nickname: string) => void;
}

export interface ClientToServerEvents {
    setNickname: (nickname: string, callback: (response: "success" | "unavailable") => void) => void;
    getAllChatrooms: (callback: (response: Chatroom[]) => void) => void;
    joinChatroom: (name: string, onSuccess: () => void) => void;
    sendMessage: (message: string, onSuccess: () => void) => void;
    getUsersInChatroom: (callback: (response: string[]) => void) => void;
}

export interface Chatroom {
    name: string;
    description: string;
}

export interface MessageData {
    time: Date;
    nickname: string;
    message: string;
    system: boolean;
}

export type ChatClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
