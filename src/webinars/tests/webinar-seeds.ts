import { Webinar } from 'src/webinars/entities/webinar.entity';

export const testWebinar = {
  webinar1: new Webinar({
    id: 'webinar1',
    organizerId: 'organizer1',
    title: 'Webinar 1',
    startDate: new Date('2022-01-01T10:00:00Z'),
    endDate: new Date('2022-01-01T11:00:00Z'),
    seats: 100,
  }),
  webinar2: new Webinar({
    id: 'webinar2',
    organizerId: 'organizer2',
    title: 'Webinar 2',
    startDate: new Date('2022-01-01T10:00:00Z'),
    endDate: new Date('2022-01-01T11:00:00Z'),
    seats: 200,
  }),
};
