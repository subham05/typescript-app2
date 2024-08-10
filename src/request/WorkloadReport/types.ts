import {TaskInterface} from 'components/Task/TaskItem';
import {pageInfo} from 'screens/Contacts';

export interface workloadListRes {
  success: boolean;
  message: string;
  data: workloadData;
}

interface workloadData {
  pageInfo: pageInfo;
  nodes: workloadListNodes[];
  graphData: workloadGraph[];
}

export interface workloadGraph {
  occupied: {
    x: string;
    y: string;
  }[];
  free: {
    x: string;
    y: string;
  }[];
}

export interface workloadListNodes {
  _id: string;
  name: string;
  zone: string;
  WorkloadDetails: WorkloadDetails;
  companyName: string;
  role: string;
}

interface WorkloadDetails {
  totalAssigned: number;
  inProgress: number;
  overDue: number;
  occupied: string;
  free: string;
  companyId: string;
}

export interface workloadListBody {
  companyId: string[];
  searchText: string;
  pageNo: number;
  role: string[];
}

export interface workloadDetailRes {
  success: boolean;
  message: string;
  data: workloadDetailData;
}

interface workloadDetailData {
  pageInfo: pageInfo;
  nodes: TaskInterface[];
}

export interface workloadDetailBody {
  userId: string;
  searchText: string;
  pageNo: number;
}
