import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleProp, TextStyle, ViewStyle} from 'react-native';
import {Styles} from './index.styles';
import {TaskStatusEnum} from 'common/utils/StatusEnum';

interface TaskStatusProps {
  status?: string;
  onPress?: () => void;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({status, onPress}) => {
  const styles = Styles();

  const getTextStyles = (): StyleProp<TextStyle> => {
    switch (status) {
      case TaskStatusEnum.Completed:
        return styles.completed;
      case TaskStatusEnum.Inprogress:
        return styles.inprogress;
      case TaskStatusEnum.Reopened:
        return styles.reopen;
      case TaskStatusEnum.Assigned:
        return styles.assigned;
      case TaskStatusEnum.Overdue:
        return styles.overdue;
      case TaskStatusEnum.Accepted:
        return styles.assigned;
      case TaskStatusEnum.Rejected:
        return styles.reject;
      case TaskStatusEnum.AwaitingApproval:
        return styles.awaitingApproval;
      case TaskStatusEnum.Reassigned:
        return styles.assigned;
      default:
        return styles.resolve;
    }
  };
  const heightStyle: StyleProp<ViewStyle> | undefined = {
    height: status === TaskStatusEnum.AwaitingApproval ? undefined : 25,
    // alignContent: 'center',
  };
  return (
    <TextView
      onPress={() => onPress?.()}
      variant={FontSizes.xSmall}
      weight="medium"
      ellipsizeMode="tail"
      numberOfLines={1}
      style={[getTextStyles(), styles.commonStyles, heightStyle]}>
      {status === TaskStatusEnum.Completed
        ? 'Completed'
        : status === TaskStatusEnum.Inprogress
        ? 'In-progress'
        : status === TaskStatusEnum.Reopened
        ? 'Re-opened'
        : status === TaskStatusEnum.Assigned
        ? 'Assigned'
        : status === TaskStatusEnum.Overdue
        ? 'Overdue'
        : status === TaskStatusEnum.Accepted
        ? 'Accepted'
        : status === TaskStatusEnum.Rejected
        ? 'Rejected'
        : status === TaskStatusEnum.Reassigned
        ? 'Reassigned'
        : 'Awaiting approval'}
    </TextView>
  );
};
