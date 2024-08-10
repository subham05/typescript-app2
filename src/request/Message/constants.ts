import {FormattedAttachmentModal} from 'common/utils/mediaObjFormat';
import {pageInfo} from 'screens/Contacts';
import {GroupImageDetailsObj} from 'screens/EditGroupIcon';

export interface chatAddModal {
  chatWith: string;
}
export interface chatListModal {
  pageNo: number;
}
export interface messageListModal {
  pageNo: number;
  chatId?: string;
  groupId?: string;
}

export interface sendMsgResponse {
  success: boolean;
  data: sendResponse;
  message: string;
}
interface sendResponse {
  __v?: number;
  _id: string;
  addedBy?: string;
  chatId: string;
  createdAt: string;
  isAttachment: boolean;
  message?: string;
  messageType?: string;
  recieverId?: string;
  senderId?: string;
  senderRole?: string;
  status?: string;
  taskId?: any[];
  updatedAt: string;
  attachmentUrl?: string;
  voiceNote?: {
    buffer: any[];
  };
}
export interface sendMessageModal {
  message?: string;
  attachmentUrl?: string | unknown;
  voiceNote?: {
    timeLength: number;
    timeLengthInSec: number;
    buffer: number[];
  };
  isAttachment: boolean;
  messageType?: string;
  groupId?: string;
  recieverId?: string;
  chatId?: string;
  senderProfileUrl?: string;
  groupName?: string;
  groupImage?: string;
  size?: string;
  attachmentUrlDetails?: FormattedAttachmentModal;
}
export interface chatModal {
  _id: string;
  chatOwner: string;
  chatWith: string;
  seenBy?: string;
  isSeen?: boolean;
  ownerRole: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    user: string;
    messageId: string;
    isAttachment: boolean;
    attachmentUrl?: string;
    message?: string;
    messageType: string;
    createdAt: string;
    isDeleted: boolean;
  };
  user: string;
  formattedTime: string | null;
  formattedDate: string | null;
  username?: string;
  userImage?: string;
  role: string;
  messageUnseenCount?: number;
  groupName?: string;
  groupImage?: string;
}
export interface messageModal {
  senderProfile?: string | undefined;
  senderName?: string;
  _id: string;
  message: string;
  isAttachment: boolean;
  attachmentUrl: string;
  messageType: string;
  senderId: string;
  recieverId: string;
  senderRole: string;
  createdAt: string;
  updatedAt: string;
  isOwn: boolean;
  formattedTime: string;
  formattedDate: string;
  voiceNote?: {
    timeLength: number;
    timeLengthInSec: number;
    buffer: number[];
  };
  size?: string;
  taskId?: string[];
  isDeleted: boolean;
  attachmentUrlDetails: FormattedAttachmentModal;
}
interface chatListData {
  pageInfo: pageInfo;
  record: chatModal[] | messageModal[];
  addRemoveAccess?: boolean;
  groupMembersNumber?: number;
  groupInfo?: groupObj;
}

export interface groupObj {
  groupName: string;
  groupImage: string;
}
export interface chatListRepo {
  success: boolean;
  message: string;
  data: chatListData;
}

export interface groupChatAddModal {
  groupMembers: string[];
  groupType: string;
}
export interface groupChatListModal {
  pageNo: number;
}

export interface deleteMessageModal {
  chatId: string;
  body: deleteMsgBody;
}
interface deleteMsgBody {
  isLastMessage: boolean;
  deletedAttachments?: string[];
  taskId?: string[];
}

export interface deleteMessageRepo {
  success: boolean;
  message: string;
}

export interface groupInfoModal {
  pageNo: number;
  groupId: string;
  searchText: string;
}

export interface groupInfoResp {
  success: boolean;
  message: string;
  data: groupInfoData;
}

export interface groupImageUpdateResp {
  success: boolean;
  message: string;
  data: groupDetails;
}

export interface groupInfoData {
  pageInfo: pageInfo;
  gorupDetails: groupDetails;
  record: groupMembersRecord[];
}

export interface groupDetails {
  _id: string;
  groupOwner: string;
  groupImage: string;
  groupName: string;
  groupType: string;
  groupAdmins: string[];
  groupMembers: string[];
  seenBy: any[];
  isSeen: boolean;
  ownerRole: string;
  addedBy: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface groupMembersRecord {
  _id: string;
  name: string;
  profileUrl: string;
}

export interface groupInviteList {
  success: boolean;
  message: string;
  data: inviteListData;
}

interface inviteListData {
  pageInfo: pageInfo;
  nodes: inviteList[];
}

export interface inviteList {
  _id: string;
  name: string;
  profileUrl: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  alreadyAdded?: boolean;
}

export interface addGroupMemberModal {
  groupId: string;
  body: {
    users: string[];
  };
}

export interface removeGroupMemberModal {
  groupId: string;
  body: {
    user: string;
  };
}
export interface groupDeleteIconModal {
  groupId: string;
}

export interface chatDetailData {
  success: boolean;
  message: string;
  data: chatDetailResponse;
}

interface chatDetailResponse {
  pageInfo: pageInfo;
  userDetails: userDetails;
  record: groupInCommon[];
}

export interface userDetails {
  role: string;
  _id: string;
  companyId: CompanyId[];
  name: string;
  profileUrl: string;
  dob: string;
  designation: string;
  email: string;
  mobile: string;
  countryCode: string;
}

interface CompanyId {
  officeAddress: {
    latlong: {
      latitude: number;
      longitude: number;
    };
    address: string;
    country: string;
    state: string;
    city: string;
    landmark: string;
    zipcode: string;
  };
  _id: string;
  name: string;
}

export interface groupInCommon {
  _id: string;
  groupOwner: string;
  groupImage: string;
  groupName: string;
  groupMembers: string[];
  seenBy: string[];
  isSeen: boolean;
  ownerRole: string;
  createdAt: string;
  updatedAt: string;
  lastMessage?: {
    user: string;
    messageId: string;
    isAttachment: boolean;
    message: string;
    messageType: string;
    createdAt: string;
  };
  formattedTime?: string;
  formattedDate?: string;
}

export interface chatDetailModal {
  pageNo: number;
  chatWith: string;
  chatOwner: string;
  userId: string;
}
export interface groupNameEditModal {
  groupId: string;
  body: {
    groupName: string;
  };
}

export interface groupImageEditModal {
  groupId: string;
  body: {
    groupImage: string;
    groupImageDetails: GroupImageDetailsObj;
  };
}

export interface groupTaskRes {
  success: boolean;
  message: string;
}

export interface groupTaskAddBody {
  groupImage: string;
  groupName: string;
  taskId: string;
  groupType: string;
}
