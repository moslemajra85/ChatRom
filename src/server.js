import net from 'node:net';
import { Writable } from 'node:stream';
import { randomUUID } from 'crypto';
import colors from 'colors';
import dotenv from 'dotenv/config';

const users = new Map();

const notifyUsers = (socketId, data) => {
  [...users.values()]
    .filter((userSocket) => userSocket.id !== socketId)
    .forEach((userSocket) => userSocket.write(data));
};

const streamProadcaster = (socket) => {
  return Writable({
    write(chunk, encoding, callback) {
      const data = JSON.stringify({
        message: chunk.toString(),
        id: socket.id,
      });
      notifyUsers(socket.id, data);
      callback();
    },
  });
};

const server = net.createServer((socket) => {
  socket.pipe(streamProadcaster(socket));
});

const port = process.PORT || 9000;
server.listen(port, () =>
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode...`
      .bgYellow.bold
  )
);

server.on('connection', (socket) => {
  socket.id = randomUUID();
  console.log(`New Connection: ${socket.id}`.bgBlue.bold);
  users.set(socket.id, socket);

  socket.write(
    JSON.stringify({
      id: socket.id.slice(0, 4),
    })
  );

  socket.on('close', (_) => {
    console.log(`User [${socket.id}] deconnected`.bgRed.bold);
    users.delete(socket.id);
  });
});
