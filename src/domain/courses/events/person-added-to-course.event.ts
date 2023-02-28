export class PersonAddedToCourseEvent {
  constructor(public readonly email: string, public readonly course: string) {}
}
