// Domain Event: UserCreatedEvent
export class UserCreatedEvent {
  readonly occurredAt: Date;
  
  constructor(
    readonly userId: string,
    readonly email: string
  ) {
    this.occurredAt = new Date();
  }
}
