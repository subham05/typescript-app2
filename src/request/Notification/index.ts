import {CreateApi} from 'request/CreateApi';

export interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface NotificationNode {
  _id: string;
  notificationType: string;
  taskId: string;
  receiverId: string;
  heading: string;
  message: string;
  actionType: string;
  seen: boolean;
  status: string;
  createdAt: Date;
  formattedTime: string;
  senderName: string;
  senderImage?: any;
  senderRole: string;
  formatedDate: string;
}

export interface Data {
  pageInfo: PageInfo;
  nodes: NotificationNode[];
}

export interface NotificationListing {
  success: boolean;
  message: string;
  data: Data;
}

const NotificationListing = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getNotification: builder.mutation<NotificationListing, number>({
      query: pageNo => ({
        url: `/notification/list?pageNo=${pageNo}`,
        method: 'POST',
      }),
    }),
  }),
});
export const {useGetNotificationMutation} = NotificationListing;
