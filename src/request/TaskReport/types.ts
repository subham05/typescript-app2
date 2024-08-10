import {TaskInterface} from 'components/Task/TaskItem';
import {pageInfo} from 'screens/Contacts';

export interface taskGraphBody {
  companyId: string[];
  priority: string;
  staff: string;
  sortBy: string;
  pageNo?: number;
}

export interface taskGraphResponse {
  success: boolean;
  message: string;
  data: taskGraphData[];
}

export interface taskGraphData {
  graphData: graphData[];
  legendsColor: legendsColor;
}

export interface graphData {
  x: number;
  y: number;
  color: string;
  type: string;
}

interface legendsColor {
  completed: string;
  inprogress: string;
  resolved: string;
  reopened: string;
  overdue: string;
}

export interface taskListResponse {
  success: boolean;
  message: string;
  data: taskListData;
}

export interface taskListData {
  pageInfo: pageInfo;
  nodes: TaskInterface[];
}
