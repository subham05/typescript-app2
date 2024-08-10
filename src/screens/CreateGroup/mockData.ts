import {ReportProps} from 'components/Report/ReportItem';

export const reportList = new Array(7).fill({
  name: 'Jenny Watson',
  company: 'The Walt Disney Company',
  assigned: '10',
  inprigress: '6',
  overdue: '1',
}) as ReportProps[];
