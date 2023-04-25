export class Specialization {
  protected constructor(
    public readonly id: number,
    public readonly shortName: string,
    public readonly fullName: string,
  ) {}

  static create({ id, shortName, fullName }: Partial<Specialization>) {
    return new Specialization(id, shortName, fullName);
  }
}
