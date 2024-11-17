export class WebinarFullException extends Error {
  constructor() {
    super('Webinar is full');
    this.name = 'WebinarFullException';
  }
}
