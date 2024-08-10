import {Socket, io} from 'socket.io-client';
import {SOCKET_URL} from '@env';
import {DefaultEventsMap} from '@socket.io/component-emitter';
// import {LoginData} from 'request/Authentication';
let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

export const startSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      reconnectionDelay: 15000,
      reconnectionDelayMax: 15000,
      transports: ['polling'],
    });
  }
};

export const initiateSocket = (room: string) => {
  if (!socket) {
    startSocket();
  }
  socket?.emit('connection', room);
};

export const subscribeToChannel = (cb: any, channelId: string) => {
  if (!socket) {
    startSocket();
  }
  socket?.emit('join', {channelId});

  socket?.on('receiveMessage', function (data) {
    cb(data);
  });
};

export const emitSeen = (channelId: string, userId: string, type: string) => {
  if (!socket) {
    startSocket();
  }
  socket?.emit('seen', {channelId, userId, type});
};

export const unSubscribeToChannel = (channelId: string) => {
  socket?.emit('unsubscribe', {channelId});
  socket?.off('join');
  socket?.off('receiveMessage');
  socket?.off('seen');
};

//Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
