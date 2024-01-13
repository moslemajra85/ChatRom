import net from 'node:net';
import { stdout } from 'node:process';
import { Writable, PassThrough } from 'node:stream';
import * as readline from 'node:readline';
import colors from 'colors';

const logger = (message) => {
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(colors.yellow(message));
};

const output = Writable({
  write(chunk, encoding, callback) {
    const { id, message } = JSON.parse(chunk);

    if (message) {
      logger(message);
    } else {
      stdout.write('type: ');
    }
    callback();
  },
});

process.stdin.pipe(net.connect(9000)).pipe(output);
