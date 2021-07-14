export class EntityValidationError extends Error {
  name = 'EntityValidationError';

  constraints: object[] = [];

  constructor(messages: string[]) {
    super();
    this.message = 'failed on entity validation';
    this.validationConstraints(messages);
  }

  private validationConstraints(messages: string[]): void {
    const errors = messages.reduce((acc: any, nxt: any): any => {
      const newErr = { ...acc, ...nxt['constraints'] };
      return newErr;
    }, {});

    this.constraints.push(errors);
  }
}
