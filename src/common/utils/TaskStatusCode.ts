import {taskStatusColor} from 'request/MasterCollection';
import {TaskStatusEnum} from './StatusEnum';

export const getTaskStatusCode = (
  taskStatus: string,
  statusColor: taskStatusColor | undefined,
) => {
  switch (taskStatus) {
    case TaskStatusEnum.Inprogress:
      return statusColor?.Inprogress;
    case TaskStatusEnum.Completed:
      return statusColor?.Completed;
    case TaskStatusEnum.Reopened:
      return statusColor?.Reopened;
    case TaskStatusEnum.Assigned:
      return statusColor?.Assigned;
    case TaskStatusEnum.Accepted:
      return statusColor?.Accepted;
    case TaskStatusEnum.Rejected:
      return statusColor?.Rejected;
    case TaskStatusEnum.AwaitingApproval:
      return statusColor?.AwaitingApproval;
    case TaskStatusEnum.Overdue:
      return statusColor?.Overdue;
    case TaskStatusEnum.Reassigned:
      return statusColor?.Reassigned;
    default:
      return statusColor?.Resolved;
  }
};

export const getTaskProgressPercentage = (taskProgress: string | number) => {
  return taskProgress?.toString().includes('%') ? 0 : taskProgress;
};
