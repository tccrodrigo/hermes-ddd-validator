// Value Object: Email with validation
export class Email {
  private constructor(private readonly value: string) {}
  
  static create(value: string): Email {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    return new Email(value.toLowerCase());
  }
  
  toString(): string {
    return this.value;
  }
  
  equals(other: Email): boolean {
    return this.value === other.value;
  }
}
