export interface ReminderModal {
  userId: string;
  companyId: string[];
  startDate: string;
  startTime: string;
  startDateUTCObject: string;
  reminderType: string;
  reminderObject: {
    reminderFor: string | undefined;
    remindTo: (string | undefined)[];
    type: string;
    notificationType: string;
    reminderType: string;
    customReminderType: string;
    reminderValue: number;
    documentId: string | undefined;
    documentCollection: string;
  };
  type: string;
}
export interface reminderRepo {
  data: any;
  success: boolean;
  message: string;
}
interface detailModal {
  _id: string;
  name: string;
}
export interface EventDetailData {
  _id: string;
  companyDetails: detailModal;
  createdAt: string;
  description: string;
  endDate: string;
  endDateUTCObject: string;
  inviteeDetails: detailModal[];
  reminderType: string;
  repeatEnd: {never: false; occurance: null; on: null};
  repeatEvent: string;
  repeatEvery: null;
  repeatEveryNumber: null;
  repeatFrom: null;
  repeatWeek: {
    friday: boolean;
    monday: boolean;
    saturday: boolean;
    sunday: boolean;
    thursday: boolean;
    tuesday: boolean;
    wednesday: boolean;
  };
  startDate: string;
  startDateUTCObject: string;
  subject: string;
  timezone: string;
  type: string;
  updatedAt: string;
  userId: string;
  utcOffset: string;
  venue: string;
}
export interface eventDetailRepo {
  data: EventDetailData;
  message: string;
  success: boolean;
}
