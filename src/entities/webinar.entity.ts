type WebinarProps = {
  id: string;
  title: string;
  startDate: Date;
  endDate: Date;
  seats: number;
};
export class Webinar {
  constructor(public props: WebinarProps) {}
}
