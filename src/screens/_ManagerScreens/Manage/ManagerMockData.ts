import {EventInterface} from 'components/Events/EventItem';
import {TaskInterface} from 'components/Task/TaskItem';

export const taskData = [
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 78,
    priority: 'High',
    status: 'In-progress',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 100,
    priority: 'Low',
    status: 'Completed',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 68,
    priority: 'Medium',
    status: 'Reopened',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 56,
    priority: 'Emergency',
    status: 'Resolved',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 100,
    priority: 'Medium',
    status: 'Assigned',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 78,
    priority: 'High',
    status: 'Resolved',
  },
  {
    name: 'FormData',
    taskName: 'The Walt Disney Company',
    assigneeName: 'Robert Fox',
    date: 'Dec 02, 2021',
    time: '5:00PM',
    taskProgress: 49,
    priority: 'Low',
    status: 'In-progress',
  },
] as TaskInterface[];

export const eventsListData = [
  {
    name: 'Meeting with UI Team',
    description:
      'One line description of this meeting description of this meeting',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Meeting',
  },
  {
    name: 'Complete SRS',
    description: 'One line description of this task description of this task ',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Task',
  },
  {
    name: 'Project review',
    description: 'One line description of this task description of this task',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Task',
  },
  {
    name: 'Landing page redesign',
    description: 'One line description of this task description of this task',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Task',
  },
  {
    name: 'Meeting with UI Team',
    description:
      'One line description of this meeting description of this meeting',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Meeting',
  },
  {
    name: 'Complete SRS',
    description: 'One line description of this task description of this task ',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Task',
  },
  {
    name: 'Project review',
    description: 'One line description of this task description of this task',
    date: 'Jan 04, 2022',
    time: '5:00 AM - 10:00 AM',
    type: 'Task',
  },
] as EventInterface[];
