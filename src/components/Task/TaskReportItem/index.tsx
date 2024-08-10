import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Progress} from 'components/Progress';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {TaskPriorityFilled} from '../TaskPriorityFilled';

interface TaskReportItemProps {
  TaskDetailReport: () => void;
}

export const TaskReportItem: React.FC<TaskReportItemProps> = ({
  TaskDetailReport,
}) => {
  return (
    <TouchableOpacity onPress={() => TaskDetailReport()}>
      <StackItem childrenGap={10} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <TextView weight="bold" variant={FontSizes.medium}>
            #1234: Task name
          </TextView>
          <TaskPriorityFilled priorityProps={'Emergency'} />
        </Stack>
        <TextView
          weight="semibold"
          variant={FontSizes.small}
          style={styles().text}>
          The Walt Disney Company
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.small}
          style={styles().text}>
          Assignee name
        </TextView>
        <Stack>
          <TextView
            weight="medium"
            variant={FontSizes.xSmall}
            style={styles().text}>
            Due date and Time
          </TextView>
          <StackItem horizontal childrenGap={20}>
            <StackItem childrenGap={5} horizontal>
              <Icon name="calendar" size={18} color={colors.grey_003} />
              <TextView weight="medium" variant={FontSizes.small}>
                Nov 20, 2021
              </TextView>
            </StackItem>
            <StackItem childrenGap={5} horizontal>
              <Icon name="time" size={18} color={colors.grey_003} />
              <TextView weight="medium" variant={FontSizes.small}>
                5:00 PM
              </TextView>
            </StackItem>
          </StackItem>
        </Stack>
        <Progress progress={0.24} />
        <View style={styles().bottom} />
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
    },
    emergency: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.grey_010,
      borderColor: colors.emergencyText,
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
