import { WebinarDTO } from 'src/webinars/dto/webinar.dto';
import { z } from 'zod';

export namespace WebinarAPI {
  export namespace OrganizeWebinar {
    export const schema = z.object({
      title: z.string(),
      seats: z.number(),
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }

  export namespace ChangeSeats {
    export const schema = z.object({
      seats: z.number(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace ChangeDates {
    export const schema = z.object({
      startDate: z.coerce.date(),
      endDate: z.coerce.date(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace BookSeat {
    export type Request = void;
    export type Response = void;
  }

  export namespace GetWebinarById {
    export type Response = WebinarDTO;
  }
}
