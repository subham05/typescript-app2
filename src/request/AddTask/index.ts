// Need to use the React-specific entry point to import createApi
// import {membersProps} from 'components/Members/MembersItem';
import {Urls} from 'common/utils/ApiConstants';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {CreateApi} from 'request/CreateApi';
import {VoiceNote} from 'request/ManageTask';
import {AddTaskModel} from 'screens/AddTask/types';
import {pageInfo} from 'screens/Contacts';
import {RequestToDataRepo, requestToData} from 'screens/CreateContact/types';

export interface CompanyResponseCollection {
  data: CompanyProps[];
  success: string;
  message: string;
}

export interface Role {
  type: string;
  roleId: string;
}

export interface AssignToUsers {
  role?: Role;
  _id: string;
  name: string;
  profileUrl?: string;
  profile?: string;
  email?: string;
  designation?: string;
  position?: string;
}
interface MembersResponseCollection {
  data: AssignToUsers[];
  success: string;
  message: string;
}

export interface RelatedTaskModel {
  _id: string;
  type: string;
  title: string;
  taskNumber: string;
  taskId: string;
}

interface RelatedTaskCollection {
  data: RelatedTaskModel[];
  success: string;
  message: string;
}

export interface RelatedTaskQueryModel {
  companyId: string;
  type: string;
}

export interface AddTaskData {
  company: string;
  type: string;
  title: string;
  description: string;
  assignTo: string;
  startDate: string;
  dueDate: string;
  startTime: string;
  dueTime: string;
  // startDateObject: string;
  // dueDateObject: string;
  priority: string;
  reportTo: string;
  relatedTaskName?: string;
  isCritical: boolean;
  attachment: unknown[];
  voiceNote: {
    title: string;
    url: string;
    timeLength: number;
    buffer: number[];
  };
  // taskNumber: string;
  // status: string;
  // addedBy: string;
  // modifiedBy: string;
  // employeeId: string;
  // _id: string;
  // createdAt: string;
  // updatedAt: string;
  // __v: number;
  // taskId: string;
  message: string;
}

export interface EditTaskModel {
  taskId?: string;
  company?: string;
  title?: string;
  type?: string;
  description?: string;
  assignTo?: string;
  startDate?: string;
  dueDate?: string;
  startTime?: string;
  dueTime?: string;
  priority?: string;
  reportTo?: string;
  relatedTaskName?: string;
  isCritical?: boolean;
  attachment?: unknown[];
  voiceNote?: VoiceNote;
  deleteVoiceNote?: string;
  deletedAttachments?: string[];
  startDateObject?: string;
  dueDateObject?: string;
}

interface AddTaskCollection {
  data: AddTaskData;
  success: string;
  message: string;
}

interface UserBody {
  searchText: string;
  companyId: string;
}

export interface GetAssignee {
  _id: string;
  designation: string;
  name: string;
}

export interface subTaskListData {
  pageInfo: pageInfo;
  nodes: subTaskListNode[];
}

export interface subTaskListNode {
  name: string;
  userId: string;
  profile: string;
  email: string;
  mobile: string;
  hrMobile: string;
  companyNumber: string;
  parentTaskId: string;
  pageNo: number;
}

const AddTaskCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getCompanyCollection: builder.query<CompanyProps[], void>({
      query: () => ({
        url: Urls.getCompanyList,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: CompanyResponseCollection) => {
        return response.data;
      },
    }),
    getAssignToCollection: builder.query<AssignToUsers[], UserBody>({
      query: data => ({
        url: 'users/assignlist',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: data,
      }),
      transformResponse: (response: MembersResponseCollection) => {
        return response.data;
      },
    }),
    getReportToCollection: builder.query<requestToData[], UserBody>({
      query: data => ({
        url: 'users/reportinglist',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: RequestToDataRepo) => {
        return response.data;
      },
    }),
    getRelatedTaskCollection: builder.query<
      RelatedTaskModel[],
      RelatedTaskQueryModel
    >({
      query: ({companyId}) => {
        return {
          url: `task/getRelatedTask?companyId=${companyId}`,
          method: 'GET',
          // headers: {
          //   token: 'token',
          // },
        };
      },
      transformResponse: (response: RelatedTaskCollection) => {
        return response.data;
      },
    }),
    addTaskCollection: builder.mutation<AddTaskData, AddTaskModel>({
      query: body => {
        return {
          url: 'task/add',
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: body,
        };
      },
      // transformResponse: (response: AddTaskCollection) => {
      //   return response.data;
      // },
    }),
    editTaskCollection: builder.mutation<AddTaskData, EditTaskModel>({
      query: body => {
        return {
          url: 'task/edit',
          method: 'PUT',
          // headers: {
          //   token: 'token',
          // },
          body: body,
        };
      },
      // transformResponse: (response: AddTaskCollection) => {
      //   return response.data;
      // },
    }),
    editSubTaskCollection: builder.mutation<AddTaskData, EditTaskModel>({
      query: body => {
        return {
          url: 'subtask/edit',
          method: 'PUT',
          body: body,
        };
      },
    }),
    addSubTaskCollection: builder.mutation<AddTaskData, AddTaskModel>({
      query: body => {
        return {
          url: 'subtask/add',
          method: 'POST',
          body: body,
        };
      },
    }),
    getSubTaskList: builder.query<subTaskListData, subTaskListNode[]>({
      query: body => ({
        url: `subtask/list/${body.parentTaskId}/${body.pageNo}`,
        headers: {
          token: 'token',
        },
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetCompanyCollectionQuery,
  useLazyGetAssignToCollectionQuery,
  useLazyGetReportToCollectionQuery,
  useLazyGetRelatedTaskCollectionQuery,
  useAddTaskCollectionMutation,
  useEditTaskCollectionMutation,
  useEditSubTaskCollectionMutation,
  useAddSubTaskCollectionMutation,
  useLazyGetSubTaskListQuery,
} = AddTaskCollection;
