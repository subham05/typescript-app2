import {CreateApi} from 'request/CreateApi';
import {Urls} from './constants';

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface PerformanceDetails {
  totalAssigned: number;
  inProgress: number;
  overDue: number;
  completed: number;
  onTime: number;
  beforeTime: number;
  afterTime: number;
}

export interface PerfReportNode {
  _id: string;
  name: string;
  zone: string;
  PerformanceDetails: PerformanceDetails;
  companyName: string;
  role: string;
}

export interface Data {
  pageInfo: PageInfo;
  nodes: PerfReportNode[];
}

export interface PerformanceApiResponse {
  success: boolean;
  data: Data;
}

export interface PerfBodyParams {
  companyId: string[];
  role: string[];
  type: string[];
  searchText: string;
  sortingOrder: number;
  pageNo: number;
}

export interface PerformanceDetailResp {
  success: boolean;
  data: {
    pageInfo: {
      currentPageNo: number;
      lastPageNo: number;
      totalCount: number;
      hasNextPage: boolean;
    };
    nodes: PerformanceDetailNode;
  };
}

export interface PerformanceDetail {
  totalAssigned: string;
  inProgress: string;
  overDue: string;
  completed: string;
  onTime: string;
  beforeTime: string;
  afterTime: string;
  reopened: string;
  resolved: string;
  companyId?: string;
}

export interface PerformanceDetailNode {
  _id: string;
  name: string;
  zone: string;
  PerformanceDetails: PerformanceDetail;
  EmergencyDetails: {
    totalAssigned: number;
    inProgress: number;
    overDue: number;
    completed: number;
    onTime: number;
    beforeTime: number;
    afterTime: number;
    reopened: number;
    resolved: number;
  };
  HighDetails: {
    totalAssigned: number;
    inProgress: number;
    overDue: number;
    completed: number;
    onTime: number;
    beforeTime: number;
    afterTime: number;
    reopened: number;
    resolved: number;
  };
  MediumDetails: {
    totalAssigned: number;
    inProgress: number;
    overDue: number;
    completed: number;
    onTime: number;
    beforeTime: number;
    afterTime: number;
    reopened: number;
    resolved: number;
    companyId: string;
  };
  LowDetails: {
    totalAssigned: number;
    inProgress: number;
    overDue: number;
    completed: number;
    onTime: number;
    beforeTime: number;
    afterTime: number;
    reopened: number;
    resolved: number;
  };
  companyName: string;
  role: string;
  totalAssignedNumber: number;
}

export interface performanceBody {
  userId: string;
  searchText: string;
  pageNo: number;
}

const PerformanceReport = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getPerformanceList: builder.mutation<
      PerformanceApiResponse,
      PerfBodyParams
    >({
      query: body => ({
        url: Urls.performanceReportList,
        method: 'POST',
        body,
      }),
    }),
    getUserPerformanceDetails: builder.mutation<
      PerformanceDetailNode,
      performanceBody
    >({
      query: body => ({
        url: Urls.performanceDetail,
        method: 'POST',
        body,
      }),
      transformResponse: (response: PerformanceDetailResp) => {
        return response?.data?.nodes;
      },
    }),
  }),
});

export const {
  useGetPerformanceListMutation,
  useGetUserPerformanceDetailsMutation,
} = PerformanceReport;
