import {FooterComponent} from 'components/FooterComponent';
import {Stack} from 'components/Stack';
import React from 'react';
import {FlatList} from 'react-native';
import {TaskInterface, ReallocationTaskItem} from '../TaskItem';

interface TaskListViewProps {
  data: TaskInterface[];
  onPress?: (item: TaskInterface) => void;
  minimal?: boolean;
  vendors?: boolean;
  inProgress?: boolean;
  manage?: boolean;
  notShowAssignee?: boolean;
}
export const ReallocationTaskListView: React.FC<TaskListViewProps> = ({
  data,
  onPress,
  minimal,
  vendors,
  inProgress,
  manage,
  notShowAssignee,
}) => {
  return (
    <>
      <FlatList
        data={data}
        renderItem={({item, index}) => (
          <Stack spaceBelow={20}>
            <ReallocationTaskItem
              key={index}
              item={item}
              onPress={onPress!}
              index={index}
              minimal={minimal}
              vendors={vendors}
              inProgress={inProgress}
              manage={manage}
              notShowAssignee={notShowAssignee}
            />
          </Stack>
        )}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => <FooterComponent />}
      />
    </>
  );
};
