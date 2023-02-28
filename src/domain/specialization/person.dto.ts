export class PersonDto {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly surname: string,
    public readonly email: string,
  ) {}
}
