import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {taskGraphBody, taskGraphResponse, taskListResponse} from './types';

const CreateTaskReportCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getTaskGraph: builder.mutation<taskGraphResponse, taskGraphBody>({
      query: body => ({
        url: Urls.taskReportGraph,
        method: 'POST',
        body: body,
      }),
    }),
    taskReportList: builder.mutation<taskListResponse, taskGraphBody>({
      query: body => ({
        url: Urls.taskReportList,
        method: 'POST',
        body: body,
      }),
    }),
  }),
});

export const {useGetTaskGraphMutation, useTaskReportListMutation} =
  CreateTaskReportCollection;
