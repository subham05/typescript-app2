import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {RippleIconButton} from 'components/IconButtons';
import {StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {useLazyGetRelatedTaskCollectionQuery} from 'request/AddTask';
import {colors} from 'common/theme/colors';
import {TaskDataModel} from 'components/TaskLists/TaskItem';
import {TaskList} from 'components/TaskLists/TaskList';
import {TaskDetails} from 'request/ManageTask';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface RelatedTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onRelatedTaskChange: (value: TaskDataModel) => void;
}
export const RelatedTaskBody: React.FC<RelatedTaskBodyProps> = ({
  taskProps,
  isEditable,
  onRelatedTaskChange,
}) => {
  const {t} = useTranslation();

  const [trigger] = useLazyGetRelatedTaskCollectionQuery();

  const [relatedTask, setRelatedTask] = useState<TaskDataModel>();
  const [relatedTaskModal, setRelatedTaskModal] = useState<boolean>(false);
  const [taskData, setTaskData] = useState<TaskDataModel[]>([]);
  const [searchRelatedTaskText, setSearchRelatedTaskText] = useState('');

  useEffect(() => {
    setRelatedTask(
      {
        _id: taskProps?.relatedTaskName?._id,
        title: taskProps?.relatedTaskName?.title,
        taskId: '',
        taskNumber: '',
        type: '',
      }!,
    );
  }, [taskProps?.relatedTaskName]);

  useEffect(() => {
    if (taskProps?.company?._id && taskProps?.company?._id !== '') {
      let relatedTaskAPIQuery = {
        companyId: taskProps?.company?._id,
        type: 'relatedtask',
      };
      trigger(relatedTaskAPIQuery).then(res => {
        setTaskData([]);
        let resultData = res.data;
        let tempTaskData: any = [];
        if (resultData?.length && !taskData.length) {
          resultData?.map((item: TaskDataModel) =>
            tempTaskData.push({
              _id: item._id,
              taskId: item.taskId,
              taskNumber: item.taskNumber,
              title: item.title,
              type: item.type,
            }),
          );
          setTaskData(tempTaskData);
        }
      });
    } else if (taskProps?.company && taskProps?.company !== '') {
      let relatedTaskAPIQuery = {
        companyId: taskProps?.company,
        type: 'relatedtask',
      };
      trigger(relatedTaskAPIQuery).then(res => {
        setTaskData([]);
        let resultData = res.data;
        let tempTaskData: any = [];
        if (resultData?.length && !taskData.length) {
          resultData?.map((item: TaskDataModel) =>
            tempTaskData.push({
              _id: item._id,
              taskId: item.taskId,
              taskNumber: item.taskNumber,
              title: item.title,
              type: item.type,
            }),
          );
          setTaskData(tempTaskData);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskProps?.company]);

  const RenderRelatedTaskView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center">
          <Stack style={styles.relatedTaskView}>
            {relatedTask?.title ? (
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {relatedTask?.title}
              </TextView>
            ) : (
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={{color: colors.primary_003}}>
                {t('addTask:relatedTaskPlaceholder')}
              </TextView>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <>
      {!isEditable ? (
        taskProps?.relatedTaskName?.title && (
          <StackItem childrenGap={5} style={styles.openBox}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.label}>
              {t('taskDetails:relatedTaskName')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.value}>
              {taskProps?.relatedTaskName?.title}
            </TextView>
          </StackItem>
        )
      ) : (
        <Stack style={styles.marginRelatedTask}>
          <TouchableField
            label={t('addTask:relatedTask')}
            icon={'arrow_expand_more'}
            RenderView={RenderRelatedTaskView}
            onPress={() => {
              setRelatedTaskModal(true);
            }}
            placeholder={
              relatedTask ? undefined : t('addTask:relatedTaskPlaceholder')
            }
          />
        </Stack>
      )}
      {relatedTaskModal && (
        <Modal
          avoidKeyboard
          isVisible={relatedTaskModal}
          style={styles.bottomModal}
          onBackdropPress={() => setRelatedTaskModal(false)}>
          <View style={[styles.bottomModalView, styles.bottomPadding]}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              spacing={16}>
              <Stack>
                <TextView weight="bold" variant={FontSizes.large}>
                  Tasks
                </TextView>
              </Stack>
              <RippleIconButton
                name="close"
                size={22}
                onPress={() => setRelatedTaskModal(false)}
              />
            </Stack>
            <Stack spacing={16} style={styles.attachmentView}>
              <SearchTextField
                showBorder
                value={searchRelatedTaskText}
                setSearchValue={setSearchRelatedTaskText}
              />
            </Stack>
            <Stack spacing={16}>
              <TaskList
                data={taskData.filter(item =>
                  item?.title.includes(searchRelatedTaskText),
                )}
                onPress={val => {
                  setRelatedTask(val);
                  onRelatedTaskChange(val);
                  setRelatedTaskModal(false);
                }}
              />
            </Stack>
          </View>
        </Modal>
      )}
    </>
  );
};
