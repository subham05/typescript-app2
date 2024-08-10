import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {InputTextField} from 'components/InputView';
import {StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from '../../index.styles';

interface TasksTaskBodyProps {
  taskProps: TaskInterface | any;
}
export const TasksTaskBody: React.FC<TasksTaskBodyProps> = ({taskProps}) => {
  const {t} = useTranslation();

  const [parentTaskName, setParentTaskName] = useState<string>(
    'Landing page redesign',
  );
  const [relatedTaskName, setRelatedTaskName] = useState<string>(
    taskProps.tasksProps.name,
  );
  const [taskName, setTaskName] = useState<string>(taskProps.tasksProps.name);
  const [taskDescription, setTaskDescription] = useState<string>(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fringilla pellentesque quam lorem in hendrerit.',
  );
  const styles = Styles();
  return (
    <StackItem childrenGap={5} style={styles.openBox}>
      {taskProps?.tasksProps?.name === 'Subtask' && (
        <>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:parentTask')}
          </TextView>
          {taskProps.isEditable ? (
            <InputTextField
              placeholder={parentTaskName}
              onChangeText={setParentTaskName}
              value={parentTaskName}
              taskDetails
            />
          ) : (
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.value}>
              {parentTaskName}
            </TextView>
          )}
          <Divider />
        </>
      )}
      {taskProps?.tasksProps?.self && (
        <>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:relatedTask')}
          </TextView>
          {taskProps.isEditable ? (
            <InputTextField
              placeholder={relatedTaskName}
              onChangeText={setRelatedTaskName}
              value={relatedTaskName}
              taskDetails
            />
          ) : (
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.value}>
              {relatedTaskName}
            </TextView>
          )}
          <Divider />
        </>
      )}
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:taskName')}
      </TextView>
      {taskProps.isEditable ? (
        <InputTextField
          placeholder={taskName}
          onChangeText={setTaskName}
          value={taskName}
          taskDetails
        />
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {taskName}
        </TextView>
      )}
      <Divider />
      <TextView weight="regular" variant={FontSizes.small} style={styles.label}>
        {t('taskDetails:description')}
      </TextView>
      {taskProps.isEditable ? (
        <InputTextField
          placeholder={taskDescription}
          onChangeText={setTaskDescription}
          value={taskDescription}
          // multiline
          taskDetailsDescription
        />
      ) : (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.value}>
          {taskDescription}
        </TextView>
      )}
    </StackItem>
  );
};
