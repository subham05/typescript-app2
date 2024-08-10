import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {InputTextField} from 'components/InputView';
import {StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface ReAllocateTaskBodyProps {
  taskProps: TaskInterface | any;
  isEditable?: boolean | undefined;
}
export const ReAllocateTaskBody: React.FC<ReAllocateTaskBodyProps> = ({
  taskProps,
  isEditable,
}) => {
  const {t} = useTranslation();

  const [reAllocateName, setReAllocateName] = useState<string>(
    taskProps.assigneeName,
  );
  const [designation, setDesignation] = useState<string>('Manager');

  const styles = Styles();
  return (
    <StackItem childrenGap={5} style={styles.openBox}>
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:reAllocateTo')}
      </TextView>
      {isEditable ? (
        <Stack spaceBelow={16}>
          <InputTextField
            placeholder={reAllocateName}
            onChangeText={setReAllocateName}
            value={reAllocateName}
            taskDetails
          />
        </Stack>
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {reAllocateName}
        </TextView>
      )}
      {/* {taskProps.status !== 'Assigned' && ( */}
      <>
        <Divider />
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('taskDetails:designationAssignto')}
        </TextView>
        {isEditable ? (
          <Stack spaceBelow={16}>
            <InputTextField
              placeholder={designation}
              onChangeText={setDesignation}
              value={designation}
              taskDetails
            />
          </Stack>
        ) : (
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {designation}
          </TextView>
        )}
      </>
      {/* )} */}
    </StackItem>
  );
};
