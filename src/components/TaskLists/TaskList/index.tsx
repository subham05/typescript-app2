import React from 'react';
import {FlatList} from 'react-native';
import {TaskDataModel, TaskItem} from '../TaskItem';

interface TaskListProps {
  data: TaskDataModel[];
  onPress?: (val: TaskDataModel | undefined) => void;
}
export const TaskList: React.FC<TaskListProps> = ({data, onPress}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => <TaskItem item={item} onPress={onPress} />}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
