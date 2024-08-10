// Need to use the React-specific entry point to import createApi
import {CreateApi} from 'request/CreateApi';

export interface ChangeTimezoneCollection {
  success: boolean;
  message: string;
  data: ChangeTimezoneResponse;
}

export interface ChangeTimezoneBody {
  timezone?: string;
  utcOffset?: string;
  country_long?: string;
}

export interface ChangeTimezoneResponse {
  name: string;
  _id: string;
  timezone: string;
  utcOffset: string;
  country_long: string;
}

export interface GetAllTimezonesBody {
  country: string;
}

export interface GetAllTimezones {
  zoneName?: string;
  gmtOffset?: number;
  gmtOffsetName?: string;
  abbreviation?: string;
  tzName?: string;
}

export interface GetAllTimezonesCollection {
  success: boolean;
  message: string;
  data: GetAllTimezones[];
}

const Timezone = CreateApi.injectEndpoints({
  endpoints: builder => ({
    changeTimezone: builder.mutation<
      ChangeTimezoneResponse,
      ChangeTimezoneBody
    >({
      query: body => {
        return {
          url: 'users/changetimezone',
          method: 'PUT',
          body: body,
        };
      },
    }),
    getAllTimezones: builder.mutation<GetAllTimezones[], GetAllTimezonesBody>({
      query: body => {
        return {
          url: `/master/timezonelist/${body.country}`,
          method: 'GET',
        };
      },
      transformResponse: (response: GetAllTimezonesCollection) => {
        return response.data;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useChangeTimezoneMutation, useGetAllTimezonesMutation} = Timezone;
