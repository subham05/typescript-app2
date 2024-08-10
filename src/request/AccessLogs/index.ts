import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {PageInfo} from 'request/ManageTask';

export interface accessLogsModal {
  voicenoteId: string | undefined;
  action: string;
  pageNo: number;
}
export interface accessLogsObjModal {
  _id: string;
  documentTitle: string;
  documentDescription: string;
  createdAt: string;
  role: string;
  name: string;
  company: string;
}
export interface accessLogsData {
  pageInfo: PageInfo;
  nodes: accessLogsObjModal[];
}
export interface accessLogsDataRepo {
  success: boolean;
  message: string;
  data: accessLogsData;
}
const AccessLogs = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getAccessLogs: builder.mutation<accessLogsData, accessLogsModal>({
      query: accessLogObj => {
        return {
          url: Urls.docAccessLogs,
          method: 'POST',
          body: accessLogObj,
        };
      },
      transformResponse: (response: accessLogsDataRepo) => {
        return response.data;
      },
    }),
    getContactLogs: builder.mutation<accessLogsData, accessLogsModal>({
      query: accessLogObj => {
        return {
          url: Urls.contactAccessLogs,
          method: 'POST',
          body: accessLogObj,
        };
      },
      transformResponse: (response: accessLogsDataRepo) => {
        return response.data;
      },
    }),
    getVoiceNoteAccessLog: builder.mutation<accessLogsData, accessLogsModal>({
      query: accessLogObj => {
        return {
          url: Urls.voiceNoteAccessLogs,
          method: 'POST',
          body: accessLogObj,
        };
      },
      transformResponse: (response: accessLogsDataRepo) => {
        return response.data;
      },
    }),
  }),
});
export const {
  useGetAccessLogsMutation,
  useGetContactLogsMutation,
  useGetVoiceNoteAccessLogMutation,
} = AccessLogs;
