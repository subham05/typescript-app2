import {TaskInterface} from 'components/Task/TaskItem';

export interface manageTaskCollection {
  Nodes: TaskInterface[];
  pageInfo: {
    currentPageNo: number;
    lastPageNo: number;
    totalCount: number;
    hasNextPage: boolean;
  };
}
