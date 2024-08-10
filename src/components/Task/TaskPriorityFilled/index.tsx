import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React from 'react';
import {Styles} from './index.styles';

interface TaskPriorityFilledProps {
  priorityProps: string;
}

export const TaskPriorityFilled: React.FC<TaskPriorityFilledProps> = ({
  priorityProps,
}) => {
  const styles = Styles();
  return (
    <Stack>
      {priorityProps === 'Emergency' ? (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.emergency}>
          Emergency
        </TextView>
      ) : priorityProps === 'High' ? (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.high}>
          High
        </TextView>
      ) : priorityProps === 'Medium' ? (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.medium}>
          Medium
        </TextView>
      ) : (
        <TextView weight="regular" variant={FontSizes.small} style={styles.low}>
          Low
        </TextView>
      )}
    </Stack>
  );
};
