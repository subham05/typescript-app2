import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {CustomDataResponse, customDataModal} from './interfaces';

export interface TaskProgressParams {
  companyId: string[];
  duration: string;
  customDate: string;
}

export interface TaskProgressResp {
  success: string;
  message: string;
  data?: TaskProgressData;
}

export type TaskProgressData = TaskProgressDataResp[];

export interface TaskProgressDataResp {
  graphData: GraphDaum[];
  legendsColor: LegendsColor;
}

export interface GraphDaum {
  x: number;
  y: number;
  color: string;
  type: string;
  y2?: number;
  y2Color?: string;
}

export interface LegendsColor {
  assigned: string;
  inprogress: string;
  resolved: string;
  completed: string;
  overdue: string;
  reopened: string;
}

export interface RiskFactorParams {
  companyId: string[];
}
export interface RiskFactorResp {
  success: boolean;
  message: string;
  data: RiskFactorData[];
}

export interface RiskFactorData {
  graphData: any[];
  legendsColor: LegendsColorRiskFactor;
}

export interface LegendsColorRiskFactor {
  lowRisk: string;
  mediumRisk: string;
  highRisk: string;
}

export interface TodaysEventParams {
  companyId: string[];
  selectedDate: string;
  pageNo: string | number;
}

export interface TodaysEventResp {
  success: boolean;
  message: string;
  data: TodaysEventsData;
}

export interface TodaysEventsData {
  todaysEvent: TodaysEvent[];
  pageInfo: PageInfo;
}

export interface TodaysEvent {
  _id: string;
  subject: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  formattedStartDate: string;
  formattedStartTime: string;
  formattedEndTime: string;
  color: string;
  type: string;
}

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface InprogressTaskParams {
  companyId: string[];
  pageNo: string | number;
}

export interface InprogressTaskResp {
  success: boolean;
  message: string;
  data: InprogressTaskData;
}

export interface InprogressTaskData {
  pageInfo: PageInfo;
  nodes: InprogressTask[];
}

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface InprogressTask {
  _id: string;
  company: Company;
  type: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  taskNumber: string;
  taskProgress: string;
  taskStatus: string;
  createdAt: string;
  updatedAt: string;
  rank: number;
  formattedStartDate: string;
  formattedEndDate: string;
  taskId: string;
  assigneeName: string;
  hasFlagged: boolean;
  userDetails: UserDetail[];
}

export interface Company {
  _id: string;
  name: string;
}

export interface UserDetail {
  _id: string;
  name: string;
  profileUrl: any;
}

const CreateDocumentCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    taskProgressFilter: builder.mutation<TaskProgressResp, TaskProgressParams>({
      query: body => {
        return {
          url: 'dashboard/task-progress',
          method: 'POST',
          body: body,
        };
      },
    }),
    riskFactor: builder.mutation<RiskFactorResp, RiskFactorParams>({
      query: body => {
        return {
          url: 'dashboard/risk-factor',
          method: 'POST',
          body: body,
        };
      },
    }),
    todaysEvent: builder.mutation<TodaysEventResp, TodaysEventParams>({
      query: body => {
        return {
          url: 'dashboard/todaysEvents',
          method: 'POST',
          body: body,
        };
      },
    }),
    inProgressDashboard: builder.mutation<
      InprogressTaskResp,
      InprogressTaskParams
    >({
      query: body => {
        return {
          url: 'dashboard/inprogressTask',
          method: 'POST',
          body: body,
        };
      },
    }),
    customSettingSave: builder.mutation<CustomDataResponse, customDataModal>({
      query: body => {
        return {
          url: Urls.graphCustomSetting,
          method: 'PUT',
          body,
        };
      },
    }),
  }),
});

export const {
  useTaskProgressFilterMutation,
  useRiskFactorMutation,
  useTodaysEventMutation,
  useInProgressDashboardMutation,
  useCustomSettingSaveMutation,
} = CreateDocumentCollection;
