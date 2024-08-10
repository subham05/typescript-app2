interface data {
  time: string;
  status: string;
}
export interface taskHistoryModel {
  data: data[];
  day: string;
}
export const taskHistoryData: taskHistoryModel[] = [
  {
    day: 'June 6',
    data: [
      {time: '11:00 AM', status: 'Task completed'},
      {time: '12:00 AM', status: 'Task approved by Leslie Alexander'},
      {time: '05:00 PM', status: 'Pending for approval'},
    ],
  },
  {
    day: 'June 7',
    data: [
      {time: '11:00 AM', status: 'Task completed'},
      {time: '12:00 AM', status: 'Task approved by Leslie Alexander'},
      {time: '07:00 PM', status: 'Pending for approval'},
    ],
  },
  {
    day: 'June 8',
    data: [
      {time: '11:00 AM', status: 'Task completed'},
      {time: '12:00 AM', status: 'Task approved by Leslie Alexander'},
      {time: '07:00 PM', status: 'Pending for approval'},
    ],
  },
  {
    day: 'June 9',
    data: [
      {time: '11:00 AM', status: 'Task completed'},
      {time: '12:00 AM', status: 'Task approved by Leslie Alexander'},
      {time: '07:00 PM', status: 'Pending for approval'},
    ],
  },
];
