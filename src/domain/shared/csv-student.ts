export class CSVStudent {
  constructor(
    public readonly name: string,
    public readonly surname: string,
    public readonly specializationName: string,
    public readonly indexNumber: number,
    public readonly year: number,
    public readonly fullIndex: string,
  ) {}
}
