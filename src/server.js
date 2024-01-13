import net from 'node:net';
import { Writable } from 'node:stream';
import { randomUUID } from 'crypto';
import colors from 'colors';
import dotenv from 'dotenv/config';

const users = new Map();

const port = process.PORT || 9000;
const server = net.createServer((socket) => {
  socket.write(socket);
});

server.listen(port, () =>
  console.log(
    `Server is running on port ${port} in ${process.env.NODE_ENV} mode...`
      .bgYellow.bold
  )
);

server.on('connection', (socket) => {
  socket.id = randomUUID();
  console.log(`New Connection: ${socket.id}`.bgBlue.bold.white);
  socket.write(
    JSON.stringify({
      id: socket.id.slice(0, 4),
    })
  );
});

server.on('close', (socket) => {
  users.delete(socket.id);
  console.log(`User [${socket.id}] is deconnected`.bgRed.bold.white);
});
