import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Stack} from 'stack-container';

interface TaskItemProps {
  item: TaskDataModel | undefined;
  onPress?: (val: TaskDataModel | undefined) => void;
}

export interface TaskDataModel {
  _id: string;
  taskId: string;
  taskNumber: string;
  title: string;
  type: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({item, onPress}) => {
  const onClick = () => {
    onPress!(item);
  };
  return (
    <>
      <TouchableOpacity style={styles().container} onPress={onClick}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            <Stack style={styles().view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {item?.title}
              </TextView>
              <TextView weight="regular" variant={FontSizes.small}>
                {item?.type}
              </TextView>
            </Stack>
          </Stack>
        </Stack>
      </TouchableOpacity>
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      // width: '75%',
    },
  });
  return mergeStyles;
};
