// Value Object: UserId
export class UserId {
  private constructor(private readonly value: string) {}
  
  static create(value: string): UserId {
    if (!value || value.length !== 36) {
      throw new Error('Invalid UserId format');
    }
    return new UserId(value);
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}
