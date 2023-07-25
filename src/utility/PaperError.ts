export class PaperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaperError';
  }
}

export class PaperExpectedAuthError extends PaperError {
  constructor(message: string) {
    super(message);
    this.name = 'PaperExpectedAuthError';
  }
}
