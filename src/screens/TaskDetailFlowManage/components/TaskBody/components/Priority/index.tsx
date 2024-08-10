import {PriorityComponent} from 'components/Priority';
import React from 'react';
import {TaskDetails} from 'request/ManageTask';

interface PriorityTaskBodyProps {
  taskProps: TaskDetails;
  onPress: (value: string) => void;
}
export const PriorityTaskBody: React.FC<PriorityTaskBodyProps> = ({
  taskProps,
  onPress,
}) => {
  return (
    <>
      <PriorityComponent
        value={taskProps?.priority}
        onSelect={value => {
          onPress(value!);
        }}
      />
    </>
  );
};
