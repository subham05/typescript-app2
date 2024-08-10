import {Urls} from 'common/utils/ApiConstants';
import {TaskInterface} from 'components/Task/TaskItem';
import {CreateApi} from 'request/CreateApi';
import {UploadedFileModal} from 'screens/AddTask';
// import {manageTaskCollection} from 'screens/Manage/types';

interface getTaskListCollection {
  data: manageTaskCollection;
  message: string;
  success: boolean;
}

interface manageTaskCollection {
  nodes: TaskInterface[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}
interface manageTaskQueryBody {
  companyId: string[];
  searchText: string;
  type: string[];
  priority: string[];
  status: string[];
  from: string;
  to: string;
  pageNo: number;
}

export interface editObjModal {
  commentId: string;
  taskId?: string;
  comment: string;
  attachment: UploadedFileModal[] | [] | AttachmentDB[];
  isAttachment: boolean;
  deletedAttachments: string[];
}

// interface NodeData {
//   _id: string;
//   company: string;
//   type: string;
//   title: string;
//   dueDate: string;
//   dueTime: string;
//   priority: string;
//   taskNumber: string;
//   pinnedBy: any[];
//   users: any[];
//   rank: number;
//   taskId: string;
//   taskProgress: string;
//   assigneeName: string;
//   companyName: string;
//   hasPinned: boolean;
//   hasFlagged: boolean;
// }

export interface VoiceNote {
  _id?: string;
  link: unknown;
  buffer?: number[];
  timeLength: number;
}

export interface TaskDetails {
  _id: string;
  company: string;
  // company: {_id: string; name: string};
  parentTaskTitle: string;
  type: string;
  title: string;
  description: string;
  assignTo: string;
  assignee: {
    _id: string;
    designation: string;
    name: string;
    profileUrl?: string;
  };
  startDate: string;
  dueDate: string;
  startTime: string;
  dueTime: string;
  startDateObject?: string;
  dueDateObject?: string;
  priority: string;
  reportTo: string;
  reporter: {
    _id: string;
    designation: string;
    name: string;
    profileUrl: string;
  };
  relatedTaskName: string;
  isCritical: boolean;
  attachment: unknown[] | string[];
  voiceNote: VoiceNote;
  taskNumber: string;
  status: string;
  taskStatus: string;
  addedBy: string;
  modifiedBy: string;
  employeeId: string;
  pinnedBy: any[];
  flag: boolean;
  taskProgress: number;
  users: any[];
  taskType: number;
  hasPinned: boolean;
  chatId: string;
  chatOwner?: string;
  chatWith?: string;
  emailId?: string[];
  isReassigned?: boolean;
  reassignTo?: {
    _id: string;
    name: string;
    profileUrl: string;
  };
  groupId: string[];
  createGroupAccess: boolean;
  // createdAt: Date;
  // updatedAt: Date;
  // __v: number;
}

export interface MarkCritical {
  taskId: string | undefined;
  isCritical: boolean;
}

export interface MarkCriticalCollection {
  success: boolean;
  message: string;
}

export interface MarkPinned {
  taskId: string | undefined;
}

export interface MarkPinnedCollection {
  success: boolean;
  message: string;
}
export interface DeleteTask {
  taskId: string | undefined;
  deletedAttachments: string[];
}

export interface DeleteTaskCollection {
  success: boolean;
  message: string;
}

export interface Attachment {
  url: string | null | undefined;
  type: string;
}

export interface AddCommentBody {
  taskId: string;
  comment: string;
  attachment: Attachment[];
  isAttachment: boolean;
  date?: string;
}

export interface AttachmentDB {
  url: string;
  type: string;
  _id: string;
}

export interface Comment {
  taskId: string;
  comment: string;
  attachment: AttachmentDB[] | [] | UploadedFileModal[];
  isAttachment: boolean;
  date: string;
  time: string;
  addedBy: string;
  userRole: string;
  status: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  message: string;
}
interface CommentsCollection {
  code: number;
  flag: boolean;
  message: string;
  data: Comment;
}

interface TaskDetailsCollection {
  data: TaskDetails;
  message: string;
  success: boolean;
}

interface GetCommentsCollection {
  data: GetComments;
  message: string;
  success: boolean;
}

export interface GetComments {
  record: Comment[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}

export interface EditCommentBody {
  commentId: string;
  taskId: string;
  comment: string;
  attachment: Attachment[];
  isAttachment: boolean;
  date?: Date;
}

export interface UpdateComment {
  _id: string;
  taskId: string;
  comment: string;
  attachment: AttachmentDB[];
  isAttachment: boolean;
  date: string;
  time: string;
  addedBy: string;
  userRole: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  message: string;
}

export interface UpdateCommentCollection {
  code: number;
  flag: boolean;
  message: string;
  update: UpdateComment;
}
interface DeleteCommentCollection {
  code: string;
  flag: boolean;
  message: string;
}

export interface DeleteCommentBody {
  commentId: string;
  deletedAttachments: string[];
}

export interface GetCommentData {
  taskId?: string;
  pageNo: number;
}

export interface ChangeStatus {
  taskStatus: string;
  message: string;
}
export interface ChangeStatusBody {
  taskId?: string;
  message?: string;
  assignTo?: string;
  body?: ChangeStatus;
}

export interface ChangeStatusResponse {
  success: boolean;
  message: string;
}

export interface ChangeStatusResponseCollection {
  data: ChangeStatusResponse;
  message: string;
  success: boolean;
}

export interface HistoryParams {
  taskId: string;
  pageNo: number;
}

export interface PageInfo {
  currentPageNo: string;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface History {
  _id: string;
  title: string;
  createdAt: Date;
  formattedTime: string;
  formatedDate: string;
  formattedStartDate: string;
  userId: string;
  username: string;
  role: string;
  designation: string;
}

export interface TaskHistoryRecord {
  taskTitle: string;
  assigneeName: string;
  reporterName: string;
  history: History[];
}

export interface TaskHistoryData {
  pageInfo: PageInfo;
  record: TaskHistoryRecord;
}

export interface TaskHistory {
  success: boolean;
  message: string;
  data: TaskHistoryData;
}

export interface ChatTaskBody {
  pageNo: number;
  chatId: string;
  searchText: string;
}

export interface GroupTaskBody {
  pageNo: number;
  groupId: string;
  searchText: string;
}
export interface ReassignParams {
  taskId: string;
  assignTo: string;
}

const ManageTaskCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getManageTaskCollection: builder.mutation<
      getTaskListCollection,
      manageTaskQueryBody
    >({
      query: body => {
        return {
          url: 'task/mainlist',
          method: 'POST',
          // headers: {
          //   token: 'token',
          // },
          body: body,
        };
      },
    }),
    getTaskDetails: builder.query<TaskDetails, string | undefined>({
      query: taskId => ({
        url: `task/get/${taskId}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: TaskDetailsCollection) => {
        return response.data;
      },
    }),
    markCritical: builder.mutation<MarkCriticalCollection, MarkCritical>({
      query: body => ({
        url: 'task/markCritical',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
      // transformResponse: (response: TaskDetailsCollection) => {
      //   return response.data;
      // },
    }),
    markPinned: builder.mutation<MarkPinnedCollection, MarkPinned>({
      query: body => ({
        url: 'task/pinnedBy',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
      // transformResponse: (response: TaskDetailsCollection) => {
      //   return response.data;
      // },
    }),
    deleteTask: builder.mutation<DeleteTaskCollection, DeleteTask>({
      query: body => ({
        url: 'task/delete',
        method: 'DELETE',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
      // transformResponse: (response: TaskDetailsCollection) => {
      //   return response.data;
      // },
    }),
    addComment: builder.mutation<Comment, AddCommentBody>({
      query: data => {
        return {
          url: 'comment/add',
          method: 'POST',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: CommentsCollection) => {
            return response.data;
          },
        };
      },
    }),
    getComments: builder.query<GetComments, GetCommentData>({
      query: data => ({
        url: `comment/list?taskId=${data.taskId}&pageNo=${data.pageNo}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: GetCommentsCollection) => {
        return response.data;
      },
    }),
    editComment: builder.mutation<UpdateComment, EditCommentBody>({
      query: data => {
        return {
          url: `comment/edit/${data.commentId}`,
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: UpdateCommentCollection) => {
            return response.update;
          },
        };
      },
    }),
    deleteComment: builder.mutation<DeleteCommentCollection, DeleteCommentBody>(
      {
        query: data => {
          return {
            url: 'comment/delete',
            method: 'DELETE',
            body: data,
            // headers: {
            //   token: 'token',
            // },
          };
        },
      },
    ),
    changeStatus: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: `task/changestatus/${data.taskId}`,
          method: 'PUT',
          body: data.body,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    acceptTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/acceptTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    rejectTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/rejectTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    startTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/startTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    resolveTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/resolveTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    approveTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/approveTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    disapproveTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/disapproveTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    assignTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/assignuser',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    selfAssignedTask: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `task/selfassigned?pageNo=${pageNo}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
    }),
    rejectedTaskList: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `task/rejectedtask?pageNo=${pageNo}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
    }),
    pendingApproval: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `task/pendingapproval?pageNo=${pageNo}`,
        method: 'GET',
        // headers: {
        //   token: 'token',
        // },
      }),
    }),
    selfStartTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/selfassignedStartTask',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    completeTask: builder.mutation<ChangeStatusResponse, ChangeStatusBody>({
      query: data => {
        return {
          url: 'task/markAsCompleted',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    taskHistory: builder.mutation<TaskHistory, HistoryParams>({
      query: data => ({
        url: `task/taskhistory/${data.taskId}/${data.pageNo}`,
        method: 'GET',
      }),
    }),
    pinnedTask: builder.mutation<getTaskListCollection, number>({
      query: pageNo => {
        return {
          url: `/task/pinnedTaskList?pageNo=${pageNo}`,
          method: 'GET',
        };
      },
    }),
    assignedByPATask: builder.mutation<getTaskListCollection, number>({
      query: pageNo => {
        return {
          url: `/task/assignedbypa?pageNo=${pageNo}`,
          method: 'GET',
        };
      },
    }),
    relatedTaskList: builder.mutation<getTaskListCollection, number>({
      query: pageNo => {
        return {
          url: `/task/relatedTaskList?pageNo=${pageNo}`,
          method: 'GET',
        };
      },
    }),
    chatRelatedTask: builder.mutation<getTaskListCollection, ChatTaskBody>({
      query: body => {
        return {
          url: Urls.chatRelatedTask,
          method: 'POST',
          body: body,
        };
      },
    }),
    groupRelatedTask: builder.mutation<getTaskListCollection, GroupTaskBody>({
      query: body => {
        return {
          url: Urls.groupRelatedTask,
          method: 'POST',
          body: body,
        };
      },
    }),
    reassignTask: builder.mutation<ChangeStatusResponse, ReassignParams>({
      query: data => {
        return {
          url: 'task/reassignuser',
          method: 'PUT',
          body: data,
          // headers: {
          //   token: 'token',
          // },
          transformResponse: (response: ChangeStatusResponseCollection) => {
            return response.data;
          },
        };
      },
    }),
    reallocatedTask: builder.mutation<getTaskListCollection, number>({
      query: pageNo => {
        return {
          url: `/task/reallocate?pageNo=${pageNo}`,
          method: 'GET',
        };
      },
    }),
    AssignedToMeTask: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `task/assignedto/me?pageNo=${pageNo}`,
        method: 'GET',
      }),
    }),
    reportedByMeTask: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `${Urls.reportedByMeList}${pageNo}`,
        method: 'GET',
      }),
    }),
    reportedByPaTask: builder.mutation<
      getTaskListCollection,
      number | undefined
    >({
      query: pageNo => ({
        url: `${Urls.reportedByPaList}${pageNo}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetManageTaskCollectionMutation,
  useGetTaskDetailsQuery,
  useLazyGetTaskDetailsQuery,
  useAddCommentMutation,
  useGetCommentsQuery,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useMarkCriticalMutation,
  useMarkPinnedMutation,
  useDeleteTaskMutation,
  useLazyGetCommentsQuery,
  useChangeStatusMutation,
  useAcceptTaskMutation,
  useRejectTaskMutation,
  useStartTaskMutation,
  useResolveTaskMutation,
  useApproveTaskMutation,
  useDisapproveTaskMutation,
  useAssignTaskMutation,
  useSelfAssignedTaskMutation,
  useRejectedTaskListMutation,
  usePendingApprovalMutation,
  useSelfStartTaskMutation,
  useCompleteTaskMutation,
  useTaskHistoryMutation,
  usePinnedTaskMutation,
  useAssignedByPATaskMutation,
  useRelatedTaskListMutation,
  useChatRelatedTaskMutation,
  useGroupRelatedTaskMutation,
  useReassignTaskMutation,
  useReallocatedTaskMutation,
  useAssignedToMeTaskMutation,
  useReportedByMeTaskMutation,
  useReportedByPaTaskMutation,
} = ManageTaskCollection;
