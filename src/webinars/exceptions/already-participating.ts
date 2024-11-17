export class AlreadyParticipatingException extends Error {
  constructor() {
    super('You are already participating in this webinar');
    this.name = 'AlreadyParticipatingException';
  }
}
