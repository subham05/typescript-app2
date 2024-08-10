import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {
  StaffDetailRes,
  staffDetailBody,
  staffListBody,
  staffListRes,
} from './types';

const CreateStaffCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getStaffList: builder.mutation<staffListRes, staffListBody>({
      query: body => ({
        url: Urls.staffList,
        method: 'POST',
        body: body,
      }),
    }),
    staffDetail: builder.mutation<StaffDetailRes, staffDetailBody>({
      query: body => ({
        url: Urls.staffDetail,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {useGetStaffListMutation, useStaffDetailMutation} =
  CreateStaffCollection;
