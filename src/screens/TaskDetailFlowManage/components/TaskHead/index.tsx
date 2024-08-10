import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {Icon} from 'components/Icon';
import {RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {TaskPriority} from 'components/Task/TaskPriority';
import {TaskStatus} from 'components/Task/TaskStatus';
import {TextField} from 'components/TextField';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  DeleteTask,
  TaskDetails,
  useDeleteTaskMutation,
} from 'request/ManageTask';
import {useAppSelector} from 'store/hooks';
import {DueDatePicker} from './components/DatePicker';
import {Styles} from './index.styles';

interface TaskHeadProps {
  taskProps?: TaskDetails;
  isEditable?: boolean;
  onPress?: (val: boolean) => void;
  vendors?: boolean;
  hideButtons?: boolean;
  props?: any;
  isReallocation?: boolean;
  onEndDaySelect: (value: string) => void;
  deletedAttachments: any[];
}
export const TaskHead: React.FC<TaskHeadProps> = ({
  taskProps,
  isEditable,
  onPress,
  vendors,
  hideButtons,
  props,
  isReallocation,
  onEndDaySelect,
  deletedAttachments,
}) => {
  const {t} = useTranslation();

  const {userData} = useAppSelector(state => state.formanagement);

  const [
    deleteTask,
    {
      data: DeleteTaskData,
      isSuccess: isSuccessDeleteTask,
      isLoading: isLoadingDeleteTask,
      isError: isErrorDeleteTask,
      error: DeleteTaskError,
    },
  ] = useDeleteTaskMutation();

  const isLoading = isLoadingDeleteTask;
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [resolveModal, setResolveModal] = useState<boolean>(false);
  const [startModal, setStartModal] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);

  const [reasonModal, setReasonModal] = useState<boolean>(false);
  const [detail, setDetail] = useState<string>('');
  // const [dueTime, setDueTime] = useState<string>('');

  // useEffect(() => {
  //   setDueTime(moment(taskProps?.dueTime, 'HH:MM').format('hh:mm A'));
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (isSuccessDeleteTask) {
      showToast(DeleteTaskData?.message);
      // setDeleteModal(false);
      props.navigation.navigate({
        name: 'ManageTask',
        params: {deleted_Id: taskProps?._id},
      });
    } else if (isErrorDeleteTask) {
      showToast(JSON.stringify(DeleteTaskError));
      // setDeleteModal(false);
    }
  }, [
    DeleteTaskData,
    DeleteTaskError,
    isSuccessDeleteTask,
    isErrorDeleteTask,
    deleteTask,
    props.navigation,
    taskProps?._id,
  ]);

  // const chatItem = {
  //   name: 'Employees',
  //   time: '2:35 PM',
  //   message:
  //     'Lorem ipsum content...Lorem ipsum content...Lorem ipsum content...',
  //   seen: true,
  //   image:
  //     'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
  // };

  const styles = Styles();
  return (
    <>
      <Stack horizontal horizontalAlign="space-between" spacing={16}>
        <StackItem horizontal childrenGap={10} verticalAlign="center">
          <TextView weight="medium" variant={FontSizes.medium}>
            {taskProps?.taskNumber}: {taskProps?.type}
          </TextView>
          {taskProps?.hasPinned && (
            <Icon name="pin_filled" color={colors.primary} size={18} />
          )}
          {taskProps?.isCritical && (
            <Icon name="outlined_flag" color={colors.red} size={18} />
          )}
        </StackItem>
        {taskProps?.taskStatus === 'Assigned' &&
          !isEditable &&
          !vendors &&
          !hideButtons &&
          !isReallocation &&
          userData?._id === taskProps?.addedBy && (
            <StackItem horizontal childrenGap={10}>
              <RippleIconButton
                name="edit"
                onPress={() => {
                  onPress!(!isEditable);
                }}
                size={22}
                color={colors.black}
              />
              <RippleIconButton
                name="delete"
                onPress={() => {
                  setDeleteModal(true);
                }}
                size={22}
                color={colors.black}
              />
              {/* <Ripple
              onPress={() => {
                onPress!(!isEditable);
              }}>
              <Icon name="edit" size={22} color={colors.black} />
            </Ripple>
            <Ripple
              onPress={() => {
                setDeleteModal(true);
              }}>
              <Icon name="delete" size={22} color={colors.black} />
            </Ripple> */}
            </StackItem>
          )}
      </Stack>
      {/* <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('ChattingScreen', {
            type: 'Groups',
            data: chatItem,
          });
        }}>
        <StackItem
          horizontal
          childrenGap={5}
          verticalAlign="center"
          spacing={16}>
          <Icon name="attachment" size={18} color={colors.primary_007} />
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={{color: colors.primary_007}}>
            {t('taskDetails:chat')}
          </TextView>
        </StackItem>
      </TouchableOpacity> */}
      <View style={styles.view}>
        <Stack spacing={16} spaceBelow={16}>
          <StackItem
            // childrenGap={20}
            horizontal
            horizontalAlign="space-between">
            <StackItem
              childrenGap={5}
              // spaceBelow={46}
              horizontal
              style={{width: Dimensions.get('screen').width / 2}}
              verticalAlign="center">
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.smallLabel}>
                {t('taskDetails:startDate')}:
              </TextView>
              {taskProps?.startDate && (
                <Stack horizontal>
                  <Icon name="calendar" size={18} style={styles.smallIcon} />
                  <TextView weight="medium" variant={FontSizes.xxSmall}>
                    {taskProps?.formattedStartDate}
                    {/* {moment(taskProps?.startDate, 'YYYY-MM-DD').format(
                      'MMM DD, YYYY',
                    )} */}
                  </TextView>
                </Stack>
              )}
            </StackItem>
            <StackItem
              childrenGap={5}
              horizontal
              style={{width: Dimensions.get('screen').width / 2}}
              verticalAlign="center">
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.smallLabel}>
                {t('taskDetails:dueDate')}:
              </TextView>
              {isEditable ? (
                <DueDatePicker
                  // dateFromDB={moment(taskProps?.dueDate, 'YYYY-MM-DD').format(
                  //   'MMM DD, YYYY',
                  // )}
                  // startDate={moment(taskProps?.startDate).format(
                  //   'MMM DD, YYYY',
                  // )}
                  dateFromDB={taskProps?.formattedEndDate}
                  startDate={taskProps?.formattedStartDate}
                  onDateSelected={date => {
                    onEndDaySelect(moment(date).format('YYYY-MM-DD'));
                    // setDueTime(moment(date).format('hh:mm A'));
                  }}
                  fontSize={FontSizes.xxSmall}
                />
              ) : (
                <>
                  {taskProps?.dueDate && (
                    <Stack horizontal>
                      <Icon
                        name="calendar"
                        size={18}
                        style={styles.smallIcon}
                      />
                      <TextView weight="medium" variant={FontSizes.xxSmall}>
                        {taskProps?.formattedEndDate}
                        {/* {moment(taskProps?.dueDate, 'YYYY-MM-DD').format(
                          'MMM DD, YYYY',
                        )} */}
                      </TextView>
                    </Stack>
                  )}
                </>
              )}
            </StackItem>
          </StackItem>
        </Stack>
        <Stack spacing={16} spaceBelow={16}>
          <StackItem
            // childrenGap={37.5}
            horizontalAlign="space-between"
            horizontal>
            <StackItem
              childrenGap={3}
              horizontal
              verticalAlign="center"
              style={{width: Dimensions.get('screen').width / 2}}>
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.smallLabel}>
                {t('taskDetails:startTime')}:
              </TextView>
              {taskProps?.startTime && (
                <Stack horizontal>
                  <Icon name="time" size={22} style={styles.smallIcon} />
                  <TextView
                    weight="medium"
                    variant={FontSizes.xxSmall}
                    style={styles.date}>
                    {/* {moment(taskProps?.startTime, 'HH:MM').format('HH:MM A')} */}
                    {taskProps?.startTime}
                  </TextView>
                </Stack>
              )}
            </StackItem>
            <StackItem
              childrenGap={3}
              horizontal
              verticalAlign="center"
              style={{width: Dimensions.get('screen').width / 2}}>
              <TextView
                weight="regular"
                variant={FontSizes.xxSmall}
                style={styles.smallLabel}>
                {t('taskDetails:dueTime')}:
              </TextView>
              {taskProps?.dueTime && (
                <Stack horizontal>
                  <Icon name="time" size={22} style={styles.smallIcon} />
                  <TextView
                    weight="medium"
                    variant={FontSizes.xxSmall}
                    style={styles.date}>
                    {/* {moment(taskProps?.dueTime, 'hh:mm').format('hh:mm A')} */}
                    {taskProps?.dueTime}
                  </TextView>
                </Stack>
              )}
            </StackItem>
          </StackItem>
        </Stack>
      </View>

      <Stack spacing={16} spaceBelow={16}>
        <StackItem
          // childrenGap={20}
          horizontal
          horizontalAlign="space-between">
          <StackItem
            childrenGap={10}
            horizontal
            style={{width: Dimensions.get('screen').width / 2}}>
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.smallLabel}>
              {t('taskDetails:status')}:
            </TextView>
            {taskProps?.taskStatus && (
              <TaskStatus status={taskProps?.taskStatus} />
            )}
          </StackItem>
          <StackItem
            childrenGap={10}
            horizontal
            style={{width: Dimensions.get('screen').width / 2}}>
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.smallLabel}>
              {t('taskDetails:priority')}:
            </TextView>
            {taskProps?.priority && (
              <Stack style={styles.priority}>
                <TaskPriority priority={taskProps?.priority} outlined={true} />
              </Stack>
            )}
          </StackItem>
        </StackItem>
      </Stack>
      {taskProps?.taskStatus !== 'Completed' &&
      taskProps?.taskStatus !== 'Resolve' &&
      taskProps?.type !== '2' &&
      !vendors &&
      !hideButtons &&
      // userData?._id === taskProps?.assignee?._id &&
      !isReallocation ? (
        <Stack
          horizontal
          horizontalAlign="flex-end"
          style={styles.buttonsGroup}
          verticalAlign="center">
          <>
            {/* <TouchableOpacity
              onPress={() => props.navigation.navigate('AddSubTask')}>
              <Stack
                horizontal
                spacing={16}
                spaceBelow={16}
                verticalAlign="center">
                <Icon
                  name="add_subtask"
                  size={22}
                  color={colors.primary}
                  style={styles.icon}
                />
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.attachFile}>
                  {t('taskDetails:addSubtask')}
                </TextView>
              </Stack>
            </TouchableOpacity> */}
          </>
          <>
            {taskProps?.taskStatus === 'Inprogress' &&
              !vendors &&
              // taskProps?.self &&
              !hideButtons &&
              !isReallocation &&
              userData?._id === taskProps?.assignee?._id && (
                <Stack spacing={16} style={styles.button}>
                  <PrimaryButton
                    title={t('taskDetails:resolve')}
                    onPress={() => {
                      setResolveModal(true);
                    }}
                    height={38}
                  />
                </Stack>
              )}
            {taskProps?.taskStatus === 'reopen' &&
              !vendors &&
              !hideButtons &&
              !isReallocation &&
              userData?._id === taskProps?.assignee?._id && (
                <Stack spacing={16} style={styles.button}>
                  <PrimaryButton
                    title={t('taskDetails:start')}
                    onPress={() => {
                      setStartModal(true);
                    }}
                    height={38}
                  />
                </Stack>
              )}
            {taskProps?.taskStatus === 'Accepted' &&
              !vendors &&
              // taskProps?.self &&
              !hideButtons &&
              !isReallocation &&
              userData?._id === taskProps?.assignee?._id && (
                <Stack spacing={16} style={styles.button}>
                  <PrimaryButton
                    title={t('taskDetails:start')}
                    onPress={() => {
                      setStartModal(true);
                    }}
                    height={38}
                  />
                </Stack>
              )}
            {taskProps?.taskStatus === 'Completed' &&
              !vendors &&
              !hideButtons &&
              !isReallocation &&
              userData?._id === taskProps?.addedBy && (
                <Stack spacing={16} style={styles.button}>
                  <PrimaryButton
                    title={t('taskDetails:reopen')}
                    onPress={() => {
                      setReopenModal(true);
                    }}
                    height={38}
                  />
                </Stack>
              )}
          </>
        </Stack>
      ) : (
        <>
          {taskProps?.taskStatus === 'Inprogress' &&
            // taskProps?.name !== 'Subtask' &&
            !vendors &&
            // taskProps?.self &&
            !isReallocation &&
            !hideButtons &&
            userData?._id === taskProps?.assignee?._id && (
              <Stack spacing={16} style={styles.button}>
                <PrimaryButton
                  title={t('taskDetails:resolve')}
                  onPress={() => {
                    setResolveModal(true);
                  }}
                  height={38}
                />
              </Stack>
            )}
          {taskProps?.taskStatus === 'reopen' &&
            !vendors &&
            !hideButtons &&
            !isReallocation &&
            userData?._id === taskProps?.assignee?._id && (
              <Stack spacing={16} style={styles.button}>
                <PrimaryButton
                  title={t('taskDetails:start')}
                  onPress={() => {
                    setStartModal(true);
                  }}
                  height={38}
                />
              </Stack>
            )}
          {taskProps?.taskStatus === 'Assigned' &&
            !vendors &&
            // taskProps?.name !== 'Subtask' &&
            // taskProps?.self &&
            !hideButtons &&
            !isReallocation &&
            userData?._id === taskProps?.assignee?._id && (
              <Stack spacing={16} style={styles.button}>
                <PrimaryButton
                  title={t('taskDetails:start')}
                  onPress={() => {
                    setStartModal(true);
                  }}
                  height={38}
                />
              </Stack>
            )}
          {taskProps?.taskStatus === 'Completed' &&
            !vendors &&
            !hideButtons &&
            userData?._id === taskProps?.assignee?._id && (
              // taskProps?.name !== 'Subtask' &&
              <Stack spacing={16} style={styles.button}>
                <PrimaryButton
                  title={t('taskDetails:reopen')}
                  onPress={() => {
                    setReopenModal(true);
                  }}
                  height={38}
                />
              </Stack>
            )}
          {taskProps?.taskStatus === 'Resolve' &&
            !vendors &&
            !hideButtons &&
            // taskProps?.self &&
            // taskProps?.name !== 'Subtask' &&
            !isReallocation &&
            userData?._id === taskProps?.assignee?._id && (
              <Stack spacing={16} style={styles.button}>
                <PrimaryButton
                  title={t('taskDetails:resolved')}
                  onPress={() => {}}
                  height={38}
                />
              </Stack>
            )}
        </>
      )}
      {deleteModal && (
        <Modal isVisible={deleteModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('taskDetails:alertDelete')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    let bodyObj: DeleteTask = {
                      taskId: taskProps?._id,
                      deletedAttachments: deletedAttachments,
                    };
                    deleteTask(bodyObj);
                    setDeleteModal(false);
                  }}>
                  {t('delete')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {resolveModal && (
        <Modal isVisible={resolveModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('taskDetails:alertResolve')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setResolveModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setResolveModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {startModal && (
        <Modal isVisible={startModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('taskDetails:alertStart')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setStartModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setStartModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {reopenModal && (
        <Modal isVisible={reopenModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('taskDetails:alertReopen')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setReopenModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setReopenModal(false);
                    setReasonModal(true);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {reasonModal && (
        <Modal isVisible={reasonModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('taskDetails:reason')}
              </TextView>
              <TextField
                style={styles.inputText}
                placeholder={t('taskDetails:addDetailsPlaceholder')}
                onChangeText={text => setDetail(text)}
                value={detail}
                returnKeyType="none"
              />
              <Stack style={styles.cancel}>
                <PrimaryButton
                  title={t('save')}
                  onPress={() => setReasonModal(false)}
                />
                {/* <TouchableOpacity
                  onPress={() => setReasonModal(false)}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.share}>
                    {t('save')}
                  </TextView>
                </TouchableOpacity> */}
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {isLoading && <Loader />}
    </>
  );
};
