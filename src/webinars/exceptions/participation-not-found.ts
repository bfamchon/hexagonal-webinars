export class ParticipationNotFoundException extends Error {
  constructor() {
    super('You are not participating in this webinar');
  }
}
