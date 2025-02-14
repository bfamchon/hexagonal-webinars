import { Participation } from 'src/webinars/entities/participation.entity';

export const testParticipation = {
  participation1: new Participation({
    userId: 'user1',
    webinarId: 'webinar1',
  }),
  participation2: new Participation({
    userId: 'user2',
    webinarId: 'webinar1',
  }),
};
