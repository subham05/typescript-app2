import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {TaskPriority} from 'components/Task/TaskPriority';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface TaskItemProps {
  index: number;
  item: TaskInterface;
  onPress: (item: TaskInterface) => void;
  minimal?: boolean;
  vendors?: boolean;
  inProgress?: boolean;
  manage?: boolean;
  notShowAssignee?: boolean;
}

export type TaskInterface = {
  name: string;
  taskName: string;
  assigneeName: string;
  date: string;
  time: string;
  priority: string;
  taskProgress: number;
  status: string;
};

export const ReallocationTaskItem: React.FC<TaskItemProps> = ({
  item,
  onPress,
  minimal,
  vendors,
  manage,
}) => {
  const {name, taskName, assigneeName} = {...item};
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <StackItem childrenGap={2} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            #1234: {name}
          </TextView>
          <TaskPriority priority={item.priority} />
        </Stack>

        {!minimal && !vendors && (
          <Stack spaceBelow={10}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles().text}
              truncate>
              {manage ? 'Task name' : taskName}
            </TextView>
          </Stack>
        )}
        <Stack horizontal horizontalAlign="space-between">
          <StackItem horizontal childrenGap={2}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}
              truncate>
              Re-allocate to:{' '}
            </TextView>
            <TextView weight="regular" variant={FontSizes.small} truncate>
              {assigneeName}
            </TextView>
          </StackItem>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={styles().text}>
            Due date
          </TextView>
        </Stack>
        <Stack horizontal horizontalAlign="space-between">
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles().text}
            truncate>
            {assigneeName}
          </TextView>
          <StackItem childrenGap={3} horizontal>
            <Icon name="calendar" size={18} />
            <TextView weight="medium" variant={FontSizes.xSmall}>
              Dec 02, 2021
            </TextView>
          </StackItem>
        </Stack>
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
      paddingBottom: 10,
    },
    emergency: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.grey_010,
      borderColor: colors.grey_010,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.emergencyText,
    },
    text: {
      color: colors.grey_003,
    },
    bottom: {
      marginBottom: 15,
    },
  });
  return mergeStyles;
};
