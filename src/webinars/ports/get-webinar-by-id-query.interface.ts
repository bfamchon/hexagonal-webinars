import { WebinarDTO } from 'src/webinars/dto/webinar.dto';

export const I_GET_WEBINAR_BY_ID_QUERY = 'I_GET_WEBINAR_BY_ID_QUERY';
export interface GetWebinarByIdQuery {
  execute(webinarId: string): Promise<WebinarDTO>;
}
