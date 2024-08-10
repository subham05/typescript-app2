import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {
  attendanceDetailBody,
  attendanceDetailRes,
  attendanceListBody,
  attendanceListRes,
  leaveAddBody,
  leaveAddRes,
  leaveRequestParams,
  leaveRequestRes,
  leaveStatusBody,
  leaveStatusRes,
} from './types';

const AttendanceReportCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getAttendanceList: builder.mutation<attendanceListRes, attendanceListBody>({
      query: body => ({
        url: Urls.attendanceList,
        method: 'POST',
        body: body,
      }),
    }),
    getAttendanceDetail: builder.mutation<
      attendanceDetailRes,
      attendanceDetailBody
    >({
      query: body => ({
        url: Urls.attendanceDetail,
        method: 'POST',
        body: body,
      }),
    }),
    addLeave: builder.mutation<leaveAddRes, leaveAddBody>({
      query: body => ({
        url: Urls.addLeave,
        method: 'POST',
        body: body,
      }),
    }),
    leaveRequest: builder.mutation<leaveRequestRes, leaveRequestParams>({
      query: params => ({
        url: Urls.leaveRequest,
        method: 'GET',
        params: params,
      }),
    }),
    leaveChangeStatus: builder.mutation<leaveStatusRes, leaveStatusBody>({
      query: body => ({
        url: Urls.leaveStatusUpdate,
        method: 'PUT',
        body: body,
      }),
    }),
  }),
});

export const {
  useGetAttendanceListMutation,
  useGetAttendanceDetailMutation,
  useAddLeaveMutation,
  useLeaveRequestMutation,
  useLeaveChangeStatusMutation,
} = AttendanceReportCollection;
