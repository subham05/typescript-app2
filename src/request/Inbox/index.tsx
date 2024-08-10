import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {
  attachmentModal,
  emailDetailRepo,
  emailLableAsModal,
  emailListData,
  emailListDataRepo,
  emailListModal,
  emailTaskQueryBody,
  emailThreadModal,
  gmailSettingModal,
  relatedTaskModal,
} from './constants';
import {TaskInterface} from 'components/Task/TaskItem';

export interface getTaskListCollection {
  data?: emailCollection;
  message: string;
  success: boolean;
}
interface emailCollection {
  nodes?: TaskInterface[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
  message?: string;
}
export interface emailListDataModal {
  _id: string;
  userId: string;
  threadId: string;
  id: string;
  labelIds: string[];
  date: string;
  from: string;
  to: string;
  subject: string;
  body: string[];
  isActionable?: boolean;
  isInformative?: boolean;
  attachment: attachmentModal[];
  status: string;
  createdAt: string;
  updatedAt: string;
  formattedDate: string;
  formattedTime: string;
  isSeen: boolean;
  formattedDate: string;
  formattedTime: string;
  taskStatus?: string;
  isSelected?: boolean;
  __v: number;
}

const InboxTaskCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getEmails: builder.mutation<getTaskListCollection, emailTaskQueryBody>({
      query: body => {
        return {
          url: 'user/email',
          method: 'POST',
          body: body,
        };
      },
    }),
    addEmailThreads: builder.mutation<getTaskListCollection, emailThreadModal>({
      query: body => {
        return {
          url: Urls.emailThread,
          method: 'POST',
          body: body,
        };
      },
    }),
    gmailSetting: builder.mutation<getTaskListCollection, gmailSettingModal>({
      query: body => {
        return {
          url: Urls.gmailSetting,
          method: 'PUT',
          body: body,
        };
      },
    }),
    getEmailList: builder.mutation<emailListData, emailListModal>({
      query: body => {
        return {
          url: Urls.getemailList,
          method: 'POST',
          body: body,
        };
      },
      transformResponse: (response: emailListDataRepo) => {
        return response.data;
      },
    }),
    getEmailDetail: builder.mutation<emailDetailRepo, string>({
      query: threadId => {
        return {
          url: `${Urls.getEmailDetail}${threadId}`,
          method: 'GET',
        };
      },
      invalidatesTags: ['EmailDetails'],
    }),
    setEmailLableAs: builder.mutation<emailListData, emailLableAsModal>({
      query: body => {
        return {
          url: Urls.emailLableas,
          method: 'POST',
          body: body,
        };
      },
      // transformResponse: (response: emailListDataRepo) => {
      //   return response;
      // },
      invalidatesTags: ['EmailDetails'],
    }),
    mailRelatedTaskList: builder.mutation<
      getTaskListCollection,
      relatedTaskModal
    >({
      query: body => {
        return {
          url: Urls.mailRelatedTask,
          method: 'POST',
          body: body,
        };
      },
    }),
  }),
});

export const {
  useGetEmailsMutation,
  useAddEmailThreadsMutation,
  useGmailSettingMutation,
  useGetEmailListMutation,
  useGetEmailDetailMutation,
  useSetEmailLableAsMutation,
  useMailRelatedTaskListMutation,
} = InboxTaskCollection;
