// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';

export interface ViewAttendanceRes {
  success: boolean;
  message: string;
  data: ViewAttendData;
}

export interface ViewAttendData {
  checkIn: string;
  checkOut: string;
  workingHours: string;
}

export interface CheckInBodyObj {
  latitude: string;
  longitude: string;
  checkInLocation: string;
}

export interface CheckOutBodyObj {
  checkOutLocation: string;
}

const UserMarkAttendance = CreateApi.injectEndpoints({
  endpoints: builder => ({
    viewAttendance: builder.query<ViewAttendanceRes, void>({
      query: () => {
        return {
          url: Urls.viewAttendance,
          method: 'POST',
        };
      },
    }),
    checkIn: builder.mutation<ViewAttendanceRes, CheckInBodyObj>({
      query: bodyObj => {
        return {
          url: Urls.checkInAttendance,
          method: 'POST',
          body: bodyObj,
        };
      },
    }),
    checkOut: builder.query<ViewAttendanceRes, CheckOutBodyObj>({
      query: body => {
        return {
          url: Urls.checkOutAttendance,
          method: 'POST',
          body: body,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyViewAttendanceQuery,
  useCheckInMutation,
  useLazyCheckOutQuery,
} = UserMarkAttendance;
