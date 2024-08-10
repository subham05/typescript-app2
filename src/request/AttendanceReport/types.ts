import {pageInfo} from 'screens/Contacts';

export interface attendanceListBody {
  companyId: string[];
  year: string;
  month: string;
  date: string;
  role: string[];
  searchText: string;
  pageNo: number;
}

export interface attendanceListRes {
  success: boolean;
  message: string;
  data: attendanceData;
}

export interface attendanceData {
  pageInfo: pageInfo;
  nodes: attendanceListData[];
  navigationFlags: dateNavFlags;
}

export interface dateNavFlags {
  previous: boolean;
  next: boolean;
}

export interface attendanceListData {
  _id: string;
  name: string;
  zone: string;
  attendanceDetails: attendanceDetails;
  role: string;
}

interface attendanceDetails {
  totalDays: number;
  workingDays: number;
  presentDays: number;
  absentDays: number;
}

export interface attendanceDetailRes {
  success: boolean;
  message: string;
  data: attendanceNodes;
}

interface attendanceNodes {
  reportData: attendanceReportData[];
  navigationFlags: dateNavFlags;
  currentDate: string;
}

export interface attendanceReportData {
  range: string;
  weekData: attendanceWeekData[];
  startDate: string;
  endDate: string;
}

export interface attendanceWeekData {
  date: string;
  day: string;
  dayOfMonth: string;
  isAbsent?: boolean;
  color: string;
  holiday?: boolean;
  label?: string;
  checkIn?: string;
  checkOut?: string;
  checkInLocation?: string;
  checkOutLocation?: string;
  workingHours?: string;
  isLeave?: boolean;
}

export interface attendanceDetailBody {
  companyId: string[];
  userId: string;
  month: string;
  year: string;
}

export interface attendanceRequestData {
  companyId: string[];
  date: string;
}

export interface leaveAddRes {
  success: boolean;
  message: string;
  data: leaveAddData;
}

interface leaveAddData {
  userId: string;
  companyId: string;
  date: string;
  utcDate: string;
  color: string;
  type: string;
  addedBy: string;
  reason: string;
  leaveStatus: string;
  status: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface leaveAddBody {
  companyId: string;
  date: string;
  reason: string;
  type: string;
}

export interface leaveRequestRes {
  success: boolean;
  message: string;
  data: leaveRequestData;
}

interface leaveRequestData {
  pageInfo: pageInfo;
  nodes: leaveNodes[];
}
export interface leaveNodes {
  _id: string;
  date: string;
  utcDate: string;
  color: string;
  type: string;
  reason: string;
  leaveStatus: string;
  userName: string;
}
export interface leaveRequestParams {
  pageNo: number;
}

export interface leaveStatusRes {
  success: boolean;
  message: string;
  data: any;
}

export interface leaveStatusBody {
  requestId: string;
  leaveStatus: string;
}
