import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {PageInfo} from 'request/ManageTask';

export interface activityLogsModal {
  pageNo: number;
  companyId: string[];
  searchText: string;
  from: string;
  to: string;
}
export interface activityLogsObjModal {
  _id: string;
  documentTitle: string;
  documentDescription: string;
  createdAt: string;
  name: string;
  company: string;
  date: string;
  time: string;
}
export interface activityLogsData {
  pageInfo: PageInfo;
  nodes: activityLogsObjModal[];
}
export interface activityLogsDataRepo {
  success: boolean;
  message: string;
  data: activityLogsData;
}
const ActivityLogs = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getOwnerActivityLog: builder.mutation<activityLogsData, activityLogsModal>({
      query: activityLogObj => {
        return {
          url: Urls.ownerActivityLogs,
          method: 'POST',
          body: activityLogObj,
        };
      },
      transformResponse: (response: activityLogsDataRepo) => {
        return response.data;
      },
    }),
    getManagerActivityLog: builder.mutation<
      activityLogsData,
      activityLogsModal
    >({
      query: activityLogObj => {
        return {
          url: Urls.managerActivityLogs,
          method: 'POST',
          body: activityLogObj,
        };
      },
      transformResponse: (response: activityLogsDataRepo) => {
        return response.data;
      },
    }),
    getEmployeeActivityLog: builder.mutation<
      activityLogsData,
      activityLogsModal
    >({
      query: activityLogObj => {
        return {
          url: Urls.employeeActivityLogs,
          method: 'POST',
          body: activityLogObj,
        };
      },
      transformResponse: (response: activityLogsDataRepo) => {
        return response.data;
      },
    }),
    getGMActivityLog: builder.mutation<activityLogsData, activityLogsModal>({
      query: activityLogObj => {
        return {
          url: Urls.gmActivityLogs,
          method: 'POST',
          body: activityLogObj,
        };
      },
      transformResponse: (response: activityLogsDataRepo) => {
        return response.data;
      },
    }),
    getPAActivityLog: builder.mutation<activityLogsData, activityLogsModal>({
      query: activityLogObj => {
        return {
          url: Urls.paActivityLogs,
          method: 'POST',
          body: activityLogObj,
        };
      },
      transformResponse: (response: activityLogsDataRepo) => {
        return response.data;
      },
    }),
    getVendorActivityLog: builder.mutation<activityLogsData, activityLogsModal>(
      {
        query: activityLogObj => {
          return {
            url: Urls.vendorActivityLogs,
            method: 'POST',
            body: activityLogObj,
          };
        },
        transformResponse: (response: activityLogsDataRepo) => {
          return response.data;
        },
      },
    ),
  }),
});
export const {
  useGetOwnerActivityLogMutation,
  useGetManagerActivityLogMutation,
  useGetEmployeeActivityLogMutation,
  useGetGMActivityLogMutation,
  useGetPAActivityLogMutation,
  useGetVendorActivityLogMutation,
} = ActivityLogs;
