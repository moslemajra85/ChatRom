import net from 'node:net';
import { stdout } from 'node:process';
import { Writable } from 'node:stream';

const output = Writable({
  write(chunk, encoding, callback) {
    const { id, message } = JSON.parse(chunk);

    if (message) {
      stdout.write(message);
    } else {
      stdout.write('...');
    }
    callback();
  },
});

process.stdin.pipe(net.connect(3000)).pipe(output);
