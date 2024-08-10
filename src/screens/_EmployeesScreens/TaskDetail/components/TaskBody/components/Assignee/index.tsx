import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {InputTextField} from 'components/InputView';
import {StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from '../../index.styles';

interface AssigneeTaskBodyProps {
  taskProps: TaskInterface | any;
}
export const AssigneeTaskBody: React.FC<AssigneeTaskBodyProps> = ({
  taskProps,
}) => {
  const {t} = useTranslation();

  const [assigneeName, setAssigneeName] = useState<string>(
    taskProps.tasksProps.name,
  );
  const [designation, setDesignation] = useState<string>('Manager');

  const styles = Styles();
  return (
    <StackItem childrenGap={5} style={styles.openBox}>
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:assigneeName')}
      </TextView>
      {taskProps.isEditable ? (
        <InputTextField
          placeholder={assigneeName}
          onChangeText={setAssigneeName}
          value={assigneeName}
          taskDetails
        />
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {assigneeName}
        </TextView>
      )}
      {taskProps.tasksProps.status !== 'Assigned' && (
        <>
          <Divider />
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:designation')}
          </TextView>
          {taskProps.isEditable ? (
            <InputTextField
              placeholder={designation}
              onChangeText={setDesignation}
              value={designation}
              taskDetails
            />
          ) : (
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.value}>
              {designation}
            </TextView>
          )}
        </>
      )}
    </StackItem>
  );
};
