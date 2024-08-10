import {EventFormModel} from './types';

export const InitialValues: EventFormModel = {
  subject: '',
  description: '',
  startDate: '',
  endDate: '',
  timezone: '',
  startTime: '',
  endTime: '',
  venue: '',
  repeatEvent: 'DO_NOT_REPEAT',
  reminderType: '15_MINUTES_BEFORE',
  companyId: '',
};

export const InitialEventRecurrence = {
  repeatEveryNumber: '',
  repeatEvery: 'WEEK',
  repeatWeek: {
    sunday: false,
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: true,
    friday: false,
    saturday: false,
  },
  selectedDay: 'Thr',
  repeatFrom: '',
  repeatFromUTCObject: '',
  repeatEnd: {
    never: true,
    on: '',
    occurance: '',
  },
  repeatEndSelected: 'Never',
  pickedDate: '',
};
