import {
  AttendanceModel,
  AttendanceReportModel,
} from './components/AttendanceItem';

const week1: AttendanceModel[] = [
  {
    date: '10',
    day: 'Mon',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
  {
    date: '11',
    day: 'Tue',
    holiday: true,
  },
  {
    date: '12',
    day: 'Wed',
    checkIn: '9:30AM',
  },
  {
    date: '13',
    day: 'Thu',
    isAbsent: true,
  },
  {
    date: '14',
    day: 'Fri',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
  {
    date: '15',
    day: 'Sat',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
];
const week2: AttendanceModel[] = [
  {
    date: '3',
    day: 'Mon',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
  {
    date: '4',
    day: 'Tue',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '2:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '05:00:00',
  },
  {
    date: '5',
    day: 'Wed',
    isLeave: true,
  },

  {
    date: '6',
    day: 'Thu',
    isAbsent: true,
  },
  {
    date: '7',
    day: 'Fri',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
  {
    date: '8',
    day: 'Sat',
    checkIn: '9:30AM',
    checkInLocation: 'Icon tower,Baner',
    checkOut: '6:30PM',
    checkOutLocation: 'Icon tower,Baner',
    workingHours: '09:00:00',
  },
];

export const AttendanceReportData: AttendanceReportModel[] = [
  {range: 'Sept 10 - 16', nodes: week1},
  {range: 'Sept 3 - 9', nodes: week2},
];
