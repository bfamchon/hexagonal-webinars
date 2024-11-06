import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  organizerId: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};
export class Webinar {
  public props: WebinarProps;
  public initialState: WebinarProps;
  constructor(data: WebinarProps) {
    this.initialState = { ...data };
    this.props = { ...data };

    Object.freeze(this.initialState);
  }

  isTooSoon(now: Date): boolean {
    const diff = differenceInDays(this.props.startDate, now);
    return diff < 3;
  }

  hasTooManySeats(): boolean {
    return this.props.seats > 1000;
  }

  hasNotEnoughSeats(): boolean {
    return this.props.seats < 1;
  }

  update(data: Partial<WebinarProps>): void {
    this.props = { ...this.props, ...data };
  }

  commit(): void {
    this.initialState = this.props;
  }
}
