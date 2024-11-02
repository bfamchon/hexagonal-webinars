import { differenceInDays } from 'date-fns';

type WebinarProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};
export class Webinar {
  constructor(public props: WebinarProps) {}

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
}
