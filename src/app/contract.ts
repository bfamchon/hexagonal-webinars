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
}
