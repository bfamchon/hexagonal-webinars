export type WebinarDTO = {
  id: string;
  title: string;
  organizer: {
    id: string;
    emailAddress: string;
  };
  startDate: Date;
  endDate: Date;
  seats: {
    available: number;
    reserved: number;
  };
};
