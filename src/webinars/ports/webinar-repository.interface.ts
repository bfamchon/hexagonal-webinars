import { Webinar } from 'src/webinars/entities/webinar.entity';

export const I_WEBINAR_REPOSITORY = 'I_WEBINAR_REPOSITORY';
export interface IWebinarRepository {
  findById(id: string): Promise<Webinar | null>;
  create(webinar: Webinar): Promise<void>;
  update(webinar: Webinar): Promise<void>;
  delete(id: string): Promise<void>;
}
