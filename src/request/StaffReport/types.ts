export interface staffListBody {
  companyId: string[];
  staff: string;
  searchText: string;
  pageNo: number;
}

export interface staffListRes {
  success: boolean;
  message: string;
  data: StaffData;
}

export interface StaffData {
  pageInfo: PageInfo;
  nodes: StaffListNode[];
}

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface StaffListNode {
  _id: string;
  name: string;
  taskStatus: TaskStatus;
  companyName: string;
  role: string;
}

export interface TaskStatus {
  totalAssigned: number;
  inProgress: number;
  completed: number;
  companyId: string;
}

export interface StaffDetailRes {
  success: boolean;
  message: string;
  data: StaffDetailData;
}

export interface StaffDetailData {
  pageInfo: PageInfo;
  nodes: StaffDetailNode[];
}

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface StaffDetailNode {
  _id: string;
  company: Company;
  type: string;
  title: string;
  dueDate: any;
  dueTime: any;
  priority: string;
  taskNumber: string;
  taskProgress: string;
  users: any[];
  taskStatus: string;
  createdAt: string;
  updatedAt: string;
  rank: number;
  Pinned: any[];
  formattedStartDate: string;
  formattedEndDate: string;
  taskId: string;
  assigneeName: string;
  hasPinned: boolean;
  hasFlagged: boolean;
  userDetails: UserDetail[];
}

export interface Company {
  _id: string;
  name: string;
}

export interface UserDetail {
  _id?: string;
  name?: string;
  profileUrl?: string;
}

export interface staffDetailBody {
  userId: string;
  searchText: string;
  pageNo: number;
}
