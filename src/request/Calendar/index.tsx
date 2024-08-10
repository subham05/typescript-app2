// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {eventDetailRepo, ReminderModal, reminderRepo} from './constant';

export interface Timezone {
  zoneName: string;
  gmtOffset: number;
  gmtOffsetName: string;
  abbreviation: string;
  tzName: string;
}

export interface TimezoneData {
  _id: string;
  name: string;
  iso2: string;
  timezones: Timezone[];
}

export interface TimezoneDataCollection {
  success: boolean;
  message: string;
  data: TimezoneData[];
}

export interface RepeatWeek {
  sunday: boolean;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
}

export interface RepeatEnd {
  never: boolean;
  on: string;
  occurance: string;
}

export interface CreateEventBody {
  userId: string;
  eventId?: string;
  companyId: string;
  subject: string;
  description: string;
  timezone: string;
  utcOffset: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  startDateUTCObject: Date;
  endDateUTCObject: Date;
  venue: string;
  repeatEvent: string;
  repeatEveryNumber: number;
  repeatEvery: string;
  repeatWeek: RepeatWeek;
  repeatFrom: string;
  repeatEnd: RepeatEnd;
  reminderType: string;
  isPrivate: boolean;
  invitedUsers: any[];
}

export interface GetAllInviteeBody {
  companyId: string[];
  searchText: string;
  pageNo: number;
}

interface PageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface InviteeUserData {
  _id: string;
  name: string;
  profileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  role: string;
  position?: string;
  email?: string;
}

export interface InviteeData {
  pageInfo: PageInfo;
  nodes: InviteeUserData[];
}

export interface InviteeUserDataCollection {
  success: boolean;
  message: string;
  data: InviteeData;
}
export interface GetDayCalendarBody {
  companyId: any[];
  viewType?: string;
  selectedDate: string;
}

export interface DisplayArray {
  _id: string;
  subject: string;
  description: string;
  startTime: string;
  endTime: string;
  start: string;
  end: string;
  color: string;
  type: string;
}

export interface MoreEvent {
  _id: string;
  subject: string;
  description: string;
  startTime: string;
  endTime: string;
  start: string;
  end: string;
  color: string;
}

export interface ShowMoreArray {
  batchMin: string;
  top: number;
  moreEvents: MoreEvent[];
}

export interface Data {
  displayArray: DisplayArray[];
  showMoreArray: ShowMoreArray[];
  eventsCount: number;
}

export interface GetDayCalendarCollection {
  success: boolean;
  message: string;
  data: Data;
}

export interface MarkedDatesCalendarBody {
  companyId: any[];
  viewType: string;
  selectedDate: string;
}

export interface Dot {
  _id: string;
  subject: string;
  startDate: string;
  endDate: string;
  color: string;
}

export interface MarkedDatesCalendar {
  _id: string;
  date: string;
  dots: Dot[];
}

export interface MarkedDatesCalendarCollection {
  success: boolean;
  message: string;
  data: MarkedDatesCalendar[];
}
export interface selectMemberModal {
  companies: string[];
  role: string[];
  pageNo: number;
  searchValue: string;
}
interface selectMemberData {
  nodes: selectMember[];
  pageInfo: PageInfo;
}
interface selectMemebrRepo {
  data: selectMemberData;
  success: boolean;
  message: string;
}
export interface selectMember {
  companyName: string;
  companyNumber: string;
  email: string;
  hrMobile: string;
  mobile: string;
  name: string;
  profile: string;
  role: string;
  userId: string;
}

export interface GetRemindToListData {
  success: boolean;
  message: string;
  data: RemindToData;
}

export interface RemindToData {
  pageInfo: RemindToPageInfo;
  nodes: NodeRemindTo[];
}

export interface NodeRemindTo {
  _id: string;
  companyId: string[];
  name: string;
  profileUrl: string;
  createdAt: string;
  role: string;
}
export interface RemindToPageInfo {
  currentPageNo: number;
  lastPageNo: number;
  totalCount: number;
  hasNextPage: boolean;
}

export interface getReminderListBody {
  companyId: string[];
  searchText: string;
  pageNo: number;
}

const CalendarCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    getAllTimezoneCollection: builder.query<TimezoneDataCollection, void>({
      query: () => ({
        url: '/master/timezonelist',
        method: 'GET',
      }),
    }),
    createEvent: builder.mutation<TimezoneDataCollection, CreateEventBody>({
      query: body => ({
        url: '/event/add',
        method: 'POST',
        body: body,
      }),
    }),
    getInviteeList: builder.mutation<
      InviteeUserDataCollection,
      GetAllInviteeBody
    >({
      query: body => ({
        url: '/event/invitee/list',
        method: 'POST',
        body: body,
      }),
    }),
    getDayCalendar: builder.mutation<
      GetDayCalendarCollection,
      GetDayCalendarBody
    >({
      query: body => {
        return {
          url: 'event/dayEvents',
          method: 'POST',
          body: body,
        };
      },
    }),
    markedDatesCalendar: builder.mutation<
      MarkedDatesCalendarCollection,
      MarkedDatesCalendarBody
    >({
      query: body => {
        return {
          url: '/event/markedList',
          method: 'POST',
          body: body,
        };
      },
    }),
    getSelectMemberList: builder.mutation<selectMemebrRepo, selectMemberModal>({
      query: body => {
        return {
          url: Urls.memberList,
          method: 'POST',
          body: body,
        };
      },
    }),
    setReminder: builder.mutation<reminderRepo, ReminderModal>({
      query: body => {
        return {
          url: Urls.reminder,
          method: 'POST',
          body: body,
        };
      },
    }),
    editEvent: builder.mutation<TimezoneDataCollection, CreateEventBody>({
      query: body => ({
        url: Urls.editEvent,
        method: 'POST',
        body: body,
      }),
      invalidatesTags: ['Event'],
    }),
    eventDetails: builder.query<eventDetailRepo, string>({
      query: eventId => ({
        url: `${Urls.eventDetail}${eventId}`,
        method: 'GET',
      }),
      providesTags: ['Event'],
    }),
    getRemindToList: builder.mutation<GetRemindToListData, getReminderListBody>(
      {
        query: body => ({
          url: Urls.reminderToList,
          method: 'POST',
          body: body,
        }),
      },
    ),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllTimezoneCollectionQuery,
  useCreateEventMutation,
  useGetInviteeListMutation,
  useGetDayCalendarMutation,
  useMarkedDatesCalendarMutation,
  useGetSelectMemberListMutation,
  useSetReminderMutation,
  useEditEventMutation,
  useLazyEventDetailsQuery,
  useGetRemindToListMutation,
} = CalendarCollection;
