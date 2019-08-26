import { Stream } from 'stream';

export function readStreamAsBuffer(stream: Stream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];

    stream.once('error', reject);
    stream.once('end', () => resolve(Buffer.from(chunks)));
    stream.on('data', chunk => chunks.push(chunk));
  });
}
