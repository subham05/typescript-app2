import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {
  workloadDetailBody,
  workloadDetailRes,
  workloadListBody,
  workloadListRes,
} from './types';

const CreateWorkloadCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getWorkloadList: builder.mutation<workloadListRes, workloadListBody>({
      query: body => ({
        url: Urls.workloadList,
        method: 'POST',
        body: body,
      }),
    }),
    workloadDetail: builder.mutation<workloadDetailRes, workloadDetailBody>({
      query: body => ({
        url: Urls.workloadDetail,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {useGetWorkloadListMutation, useWorkloadDetailMutation} =
  CreateWorkloadCollection;
