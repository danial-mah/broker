import { io } from 'socket.io-client';

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? 'http://localhost:4000';

export const marketSocket = io(`${socketUrl}/market`, { autoConnect: false });
export const notificationsSocket = io(`${socketUrl}/notifications`, { autoConnect: false });
