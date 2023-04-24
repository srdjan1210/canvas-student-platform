import { Readable } from 'stream';

export class CsvFile {
  constructor(
    public readonly buffer: Buffer,
    public readonly filename: string,
    public readonly mimetype: string,
  ) {}

  public stream(): Readable {
    const stream = new Readable();
    stream.push(this.buffer);
    stream.push(null);
    return stream;
  }
}
