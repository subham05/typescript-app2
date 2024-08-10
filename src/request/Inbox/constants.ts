import {pageInfo} from 'screens/Contacts';
import {emailListDataModal} from '.';

export interface emailListData {
  nodes: emailListDataModal[];
  pageInfo: pageInfo;
}
export interface emailListDataRepo {
  data: emailListData;
  message: string;
  success: boolean;
}
export interface emailTaskQueryBody {
  inbox: boolean;
  sentMail: boolean;
}
interface threadMessage {
  id: string;
  threadId: string;
}
export interface emailThreadModal {
  messages: threadMessage[];
  labelIds: string[];
}
export interface gmailSettingModal {
  code: string;
  refresh_token: string;
  access_token: string;
  scope: string;
}
export interface emailListModal {
  pageNo: number;
  action: string;
}
export interface emailLableAsModal {
  emailId: string[];
  isActionable?: boolean;
  isInformative?: boolean;
}
export interface attachmentModal {
  url: string;
  type: string;
  _id: string;
}
export interface relatedTaskModal {
  pageNo: number;
  taskId: string[];
  searchText: string;
}
export interface emailDetailDataModal {
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
  attachment: attachmentModal[];
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  isSeen: boolean;
  taskId: string[];
  isActionable?: boolean;
  isInformative?: boolean;
  priorityTaskId?: {_id: string; taskStatus: string};
  cc: string[];
}
export interface emailDetailRepo {
  data: emailDetailDataModal;
  message: string;
  success: boolean;
}
