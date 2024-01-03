export class PaperError extends Error {
  status: number | undefined;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'PaperError';
    this.status = status;
  }
}

export class PaperExpectedAuthError extends PaperError {
  constructor(message: string) {
    super(message);
    this.name = 'PaperExpectedAuthError';
  }
}
