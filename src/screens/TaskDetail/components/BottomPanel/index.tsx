import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {StackItem} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity} from 'react-native';
import {
  MarkCritical,
  MarkPinned,
  TaskDetails,
  useMarkCriticalMutation,
  useMarkPinnedMutation,
} from 'request/ManageTask';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';
import {chatInviteeModal} from 'request/Message';

interface TaskDetailBottomPanel {
  panelState: boolean;
  taskDetail?: TaskDetails | undefined;
  onPressClose: () => void;
  props: any;
  taskProps: TaskDetails | undefined;
  onPressCritical: () => void;
}

export const TaskDetailBottomPanel: React.FC<TaskDetailBottomPanel> = ({
  panelState,
  onPressClose,
  taskProps,
  onPressCritical,
  props,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);
  const [
    markCriticalTask,
    {
      data: markCriticalData,
      isSuccess: isSuccessMarkCritical,
      isLoading: isLoadingMarkCritical,
      isError: isErrorMarkCritical,
      error: markCriticalError,
    },
  ] = useMarkCriticalMutation();
  const [
    markPinnedTask,
    {
      data: markPinnedData,
      isSuccess: isSuccessMarkPinned,
      isLoading: isLoadingMarkPinned,
      isError: isErrorMarkPinned,
      error: markPinnedError,
    },
  ] = useMarkPinnedMutation();
  const isLoading = isLoadingMarkCritical || isLoadingMarkPinned;

  const panelProps = {
    fullWidth: true,
    openLarge: false,
    onlySmall: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    smallPanelHeight:
      userData?._id === taskProps?.addedBy ||
      userData?._id === taskProps?.assignee._id
        ? Dimensions.get('screen').height / 2.8
        : Dimensions.get('screen').height / 3.8,
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  useEffect(() => {
    if (isSuccessMarkCritical) {
      showToast(markCriticalData?.message);
      closePanel();
      onPressCritical();
    } else if (isErrorMarkCritical) {
      // showToast(JSON.stringify(markCriticalError));
      closePanel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    markCriticalData,
    markCriticalError,
    isSuccessMarkCritical,
    isErrorMarkCritical,
    markCriticalTask,
  ]);

  useEffect(() => {
    if (isSuccessMarkPinned) {
      showToast(markPinnedData?.message);
      closePanel();
      onPressCritical();
    } else if (isErrorMarkPinned) {
      // showToast(JSON.stringify(markPinnedError));
      closePanel();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    markPinnedData,
    markPinnedError,
    isSuccessMarkPinned,
    isErrorMarkPinned,
    markPinnedTask,
  ]);

  const navigateToCreateGrp = () => {
    const memberList: chatInviteeModal[] = [];
    memberList.push(
      {
        _id: taskProps.assignee._id,
        name: taskProps.assignee.name,
        profileUrl: taskProps.assignee.profileUrl!,
      },
      {
        _id: taskProps?.reporter._id,
        name: taskProps?.reporter.name,
        profileUrl: taskProps?.reporter.profileUrl!,
      },
    );
    if (taskProps.reassignTo) {
      memberList.push({
        _id: taskProps?.reassignTo._id,
        name: taskProps?.reassignTo.name,
        profileUrl: taskProps?.reassignTo.profileUrl!,
      });
    }
    props.navigation.navigate('AddGroupName', {
      selectedMemberList: memberList,
      isFromTask: true,
      taskId: taskProps?._id,
    });
    closePanel();
  };

  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <StackItem spacing={25} style={styles.swipable}>
        <TouchableOpacity
          onPress={() => {
            let bodyObj: MarkPinned = {
              taskId: taskProps?._id,
            };
            markPinnedTask(bodyObj);
            // closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="push_pin" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {taskProps?.hasPinned
                ? t('taskDetails:unpinTask')
                : t('taskDetails:pinTask')}
            </TextView>
          </StackItem>
        </TouchableOpacity>

        {(userData?._id === taskProps?.addedBy ||
          userData?._id === taskProps?.assignee._id) && (
          <StackItem childrenGap={12} style={styles.mainView}>
            <Divider size={2} />
            <TouchableOpacity
              onPress={() => {
                let bodyObj: MarkCritical = {
                  taskId: taskProps?._id,
                  isCritical: taskProps?.isCritical ? false : true,
                };
                markCriticalTask(bodyObj);
                // closePanel();
              }}>
              <StackItem horizontal childrenGap={10} verticalAlign="center">
                <Icon name="outlined_flag" size={22} color={colors.black} />
                <TextView weight="regular" variant={FontSizes.regular}>
                  {taskProps?.isCritical
                    ? t('taskDetails:removeFromCritical')
                    : t('taskDetails:markAsCritical')}
                </TextView>
              </StackItem>
            </TouchableOpacity>
          </StackItem>
        )}
        {taskProps?.createGroupAccess ? (
          <StackItem childrenGap={12} style={styles.mainView}>
            <Divider size={2} />
            <TouchableOpacity onPress={navigateToCreateGrp}>
              <StackItem horizontal childrenGap={10} verticalAlign="center">
                <Icon name="group_add" size={22} color={colors.black} />
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('taskDetails:createGroup')}
                </TextView>
              </StackItem>
            </TouchableOpacity>
          </StackItem>
        ) : null}

        {/* <Divider size={2} />
        <TouchableOpacity
          onPress={() => {
            // props.navigation.navigate('AddCompany');
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="outlined_flag" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('taskDetails:markAsCritical')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CreateGroup');
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="group_add" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('taskDetails:createGroup')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} /> */}
        {/* <TouchableOpacity
          onPress={() => {
            // props.navigation.navigate('AddTask', {subTask: true});
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="alarm" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('taskDetails:alarm')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} /> */}
        {taskProps?.taskStatus !== 'Completed' &&
          (userData?._id === taskProps?.addedBy ||
            userData?._id === taskProps?.assignee._id) && (
            <StackItem childrenGap={12} style={styles.mainView}>
              <Divider size={2} />
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate('Reminder', {
                    voiceNotes: false,
                    taskData: taskProps,
                  });
                  closePanel();
                }}>
                <StackItem horizontal childrenGap={10} verticalAlign="center">
                  <Icon
                    name="notification_important"
                    size={22}
                    color={colors.black}
                  />
                  <TextView weight="regular" variant={FontSizes.regular}>
                    {t('taskDetails:reminder')}
                  </TextView>
                </StackItem>
              </TouchableOpacity>
            </StackItem>
          )}
      </StackItem>
      {isLoading && <Loader />}
    </SwipeablePanel>
  );
};
