import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {lengthConstants} from 'common/utils/LengthConstants';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {IconButton} from 'components/IconButtons';
import {StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {TaskDetails} from 'request/ManageTask';
import {SpeechToText} from 'screens/AddTask/components/SpeechToText';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

export interface TaskModel {
  parentTaskName?: string;
  relatedTaskName?: string;
  taskName?: string;
  taskDescription?: string;
}
interface TasksTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onTaskChange: (values: TaskModel) => void;
}
export const TasksTaskBody: React.FC<TasksTaskBodyProps> = ({
  taskProps,
  isEditable,
  onTaskChange,
}) => {
  const {t} = useTranslation();

  // const [parentTaskName, setParentTaskName] = useState<string | undefined>(
  //   taskProps?.parentTaskTitle,
  // );
  const [parentTaskName, setParentTaskName] = useState<string | undefined>(
    'UI designing',
  );
  const [speechField, setSpeechField] = useState('');
  // const [relatedTaskName, setRelatedTaskName] = useState<string | undefined>(
  //   taskProps?.relatedTaskName,
  // );
  const [taskName, setTaskName] = useState<string | undefined>();
  const [taskDescription, setTaskDescription] = useState<string | undefined>(
    taskProps?.description,
  );
  const [isSpeechModalOpen, setIsSpeechModalOpen] = useState(false);

  useEffect(() => {
    setTaskName(taskProps?.title);
    setTaskDescription(taskProps?.description);
  }, [taskProps?.description, taskProps?.title]);

  const RenderRightContainer = (nameLength: number, type: string) => {
    return (
      <>
        {taskProps?.taskStatus === 'Assigned' && (
          <TouchableOpacity>
            <IconButton
              name="mic"
              size={20}
              color={colors.primary_003}
              onPress={() => {
                switch (type) {
                  case 'taskName':
                    if (nameLength < lengthConstants.nameAddTask) {
                      setIsSpeechModalOpen(true);
                      setSpeechField('taskName');
                    } else {
                      showToast('Maximum length reached');
                    }
                    break;
                  case 'description':
                    if (nameLength < lengthConstants.descriptionAddTask) {
                      setIsSpeechModalOpen(true);
                      setSpeechField('description');
                    } else {
                      showToast('Maximum length reached');
                    }
                    break;
                  default:
                    break;
                }
              }}
            />
          </TouchableOpacity>
        )}
      </>
    );
  };

  const SpeechToTextModal = () => {
    return (
      isSpeechModalOpen && (
        <SpeechToText
          close={() => setIsSpeechModalOpen(false)}
          text={text => {
            if (speechField === 'taskName') {
              setTaskName(prev =>
                (prev?.length ? prev + ' ' + text : text).substring(
                  0,
                  lengthConstants.nameAddTask,
                ),
              );
            } else if (speechField === 'description') {
              setTaskDescription(prev =>
                (prev?.length ? prev + ' ' + text : text).substring(
                  0,
                  lengthConstants.descriptionAddTask,
                ),
              );
            }
          }}
        />
      )
    );
  };

  const styles = Styles();

  return (
    <>
      {!isEditable ? (
        <StackItem childrenGap={5} style={styles.openBox}>
          {taskProps?.type === '2' && (
            <>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.label}>
                {t('taskDetails:parentTask')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.value}>
                {parentTaskName}
              </TextView>
              <Divider />
            </>
          )}
          {/* {taskProps?.self && (
            <>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.label}>
                {t('taskDetails:relatedTask')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.value}>
                {relatedTaskName}
              </TextView>
              <Divider />
            </>
          )} */}
          {taskProps?.type === '2' ? (
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.label}>
              {t('taskDetails:subTaskName')}
            </TextView>
          ) : (
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.label}>
              {t('taskDetails:taskName')}
            </TextView>
          )}
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {taskName}
          </TextView>
          <Divider />
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:description')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {taskDescription}
          </TextView>
        </StackItem>
      ) : (
        <>
          {taskProps?.type === '2' && (
            <Stack spaceBelow={16}>
              <TextField
                label={t('taskDetails:parentTask')}
                placeholder={parentTaskName}
                onChangeText={text => {
                  setParentTaskName(text);
                  onTaskChange({
                    parentTaskName: text,
                    relatedTaskName: '',
                    taskName: taskName,
                    taskDescription: taskDescription,
                  });
                }}
                value={parentTaskName}
                maxLength={lengthConstants.nameAddTask}
                isError={parentTaskName?.trim()?.length === 0}
                editable={taskProps?.taskStatus === 'Assigned' ? true : false}
              />
              {parentTaskName?.trim()?.length === 0 && (
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.error}>
                  {t('addTask:nameError')}
                </TextView>
              )}
            </Stack>
          )}
          {/* {taskProps?.self && (
            <Stack spaceBelow={16}>
              <TextField
                label={t('taskDetails:relatedTask')}
                placeholder={relatedTaskName}
                onChangeText={(text)=>{setRelatedTaskName(text);
                  onTaskChange({
                    parentTaskName: parentTaskName,
                    relatedTaskName: text,
                    taskName: taskName,
                    taskDescription: taskDescription,
                  });}}
                value={relatedTaskName}
              />
            </Stack>
          )} */}
          <StackItem childrenGap={10} spaceBelow={16}>
            <Stack>
              <TextField
                label={t('taskDetails:taskName')}
                placeholder={taskName}
                onChangeText={text => {
                  setTaskName(text);
                  onTaskChange({
                    parentTaskName: parentTaskName,
                    relatedTaskName: '',
                    taskName: text,
                    taskDescription: taskDescription,
                  });
                }}
                value={taskName}
                maxLength={lengthConstants.nameAddTask}
                isError={taskName?.trim()?.length === 0}
                RenderRightContainer={() =>
                  RenderRightContainer(taskName?.length!, 'taskName')
                }
                editable={taskProps?.taskStatus === 'Assigned' ? true : false}
              />
              {taskName?.trim()?.length === 0 && (
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.error}>
                  {t('addTask:taskNameError')}
                </TextView>
              )}
            </Stack>
            <Stack>
              <TextField
                label={t('taskDetails:description')}
                placeholder={taskDescription}
                onChangeText={text => {
                  setTaskDescription(text);
                  onTaskChange({
                    parentTaskName: parentTaskName,
                    relatedTaskName: '',
                    taskName: taskName,
                    taskDescription: text,
                  });
                }}
                value={taskDescription?.substring(0, 250)}
                multiline
                numberOfLines={3}
                maxLength={lengthConstants.descriptionAddTask}
                isError={taskDescription?.trim()?.length === 0}
                RenderRightContainer={() =>
                  RenderRightContainer(taskDescription?.length!, 'description')
                }
                editable={taskProps?.taskStatus === 'Assigned' ? true : false}
              />
              {taskDescription?.trim()?.length === 0 && (
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.error}>
                  {t('addTask:descriptionError')}
                </TextView>
              )}
              {SpeechToTextModal()}
            </Stack>
          </StackItem>
        </>
      )}
    </>
  );
};
