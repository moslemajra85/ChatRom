import net from 'node:net';
import { stdout } from 'node:process';
import { Writable } from 'node:stream';

const output = Writable({
  write(chunk, encoding, callback) {
    stdout.write(chunk);
  },
});
process.stdin.pipe(net.connect(3000)).pipe(output);
