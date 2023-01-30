export default class PaperError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PaperError';
  }
}
