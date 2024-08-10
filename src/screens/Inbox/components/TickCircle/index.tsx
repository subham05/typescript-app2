import {Icon} from 'components/Icon';
import React from 'react';
import {ViewStyle} from 'react-native';
import {useAppSelector} from 'store/hooks';

interface TickCircleProps {
  name: string | undefined;
}

export const TickCircle: React.FC<TickCircleProps> = ({name}) => {
  const {statusColor} = useAppSelector(state => state?.formanagement);
  const icon: ViewStyle = {
    marginTop: 7,
    alignSelf: 'flex-end',
  };
  return (
    <Icon
      name="check_circle_selected"
      size={20}
      color={
        name === 'Close'
          ? statusColor?.Completed
          : name === 'Completed'
          ? statusColor?.Completed
          : name === 'Reopened'
          ? statusColor?.Reopened
          : name === 'Rejected'
          ? statusColor?.Rejected
          : name === 'AwaitingApproval'
          ? statusColor?.AwaitingApproval
          : name === 'Resolved'
          ? statusColor?.Resolved
          : name === 'Accepted'
          ? statusColor?.Accepted
          : name === 'Inprogress'
          ? statusColor?.Inprogress
          : name === 'In-progress'
          ? statusColor?.Inprogress
          : name === 'Assigned'
          ? statusColor?.Assigned
          : name === 'Overdue'
          ? statusColor?.Overdue
          : undefined
      }
      style={icon}
    />
  );
};
