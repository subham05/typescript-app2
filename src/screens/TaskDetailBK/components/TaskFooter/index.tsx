import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  ChangeStatusBody,
  TaskDetails,
  useAcceptTaskMutation,
  useApproveTaskMutation,
  useDisapproveTaskMutation,
  useRejectTaskMutation,
} from 'request/ManageTask';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

interface TaskFooterProps {
  taskProps?: TaskDetails;
  isEditable?: boolean;
  onAcceptTask?: () => void;
  onRejectTask?: () => void;
}
export const TaskFooter: React.FC<TaskFooterProps> = ({
  taskProps,
  onAcceptTask,
  onRejectTask,
}) => {
  const {t} = useTranslation();

  const {userData} = useAppSelector(state => state.formanagement);

  const [
    acceptTask,
    {
      isLoading: isLoadingAcceptTask,
      isError: isErrorAcceptTask,
      isSuccess: isSuccessAcceptTask,
      error: AcceptTaskError,
      data: AcceptTaskData,
    },
  ] = useAcceptTaskMutation();

  const [
    rejectTask,
    {
      isLoading: isLoadingRejectTask,
      isError: isErrorRejectTask,
      isSuccess: isSuccessRejectTask,
      error: RejectTaskError,
      data: RejectTaskData,
    },
  ] = useRejectTaskMutation();

  const [
    approveTask,
    {
      isLoading: isLoadingApproveTask,
      isError: isErrorApproveTask,
      isSuccess: isSuccessApproveTask,
      error: ApproveTaskError,
      data: ApproveTaskData,
    },
  ] = useApproveTaskMutation();

  const [
    disApproveTask,
    {
      isLoading: isLoadingDisApproveTask,
      isError: isErrorDisApproveTask,
      isSuccess: isSuccessDisApproveTask,
      error: DisApproveTaskError,
      data: DisApproveTaskData,
    },
  ] = useDisapproveTaskMutation();

  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [disapproveModal, setDisapproveModal] = useState<boolean>(false);
  const [detail, setDetail] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isSuccessAcceptTask) {
      showToast(AcceptTaskData?.message);
      onAcceptTask?.();
      setDetail(undefined);
    } else if (isErrorAcceptTask) {
      showToast(JSON.stringify(AcceptTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    AcceptTaskData?.message,
    AcceptTaskError,
    isErrorAcceptTask,
    isSuccessAcceptTask,
    // onAcceptTask,
  ]);

  useEffect(() => {
    if (isSuccessRejectTask) {
      showToast(RejectTaskData?.message);
      onRejectTask?.();
      setDetail(undefined);
    } else if (isErrorRejectTask) {
      showToast(JSON.stringify(RejectTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    RejectTaskData?.message,
    RejectTaskError,
    isErrorRejectTask,
    isSuccessRejectTask,
    // onRejectTask,
  ]);

  useEffect(() => {
    if (isSuccessApproveTask) {
      showToast(ApproveTaskData?.message);
      onAcceptTask?.();
      setDetail(undefined);
    } else if (isErrorApproveTask) {
      showToast(JSON.stringify(ApproveTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ApproveTaskData?.message,
    ApproveTaskError,
    isErrorApproveTask,
    isSuccessApproveTask,
    // onAcceptTask,
  ]);
  useEffect(() => {
    if (isSuccessDisApproveTask) {
      showToast(DisApproveTaskData?.message);
      onRejectTask?.();
      setDetail(undefined);
    } else if (isErrorDisApproveTask) {
      showToast(JSON.stringify(DisApproveTaskError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    DisApproveTaskData?.message,
    DisApproveTaskError,
    isErrorDisApproveTask,
    isSuccessDisApproveTask,
    // onRejectTask,
  ]);

  const styles = Styles();
  return (
    <>
      {taskProps?.taskStatus === 'Inprogress' &&
      userData?._id === taskProps?.addedBy ? (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton title={t('saveChanges')} onPress={() => {}} />
        </Stack>
      ) : taskProps?.taskStatus === 'Assigned' &&
        userData?._id === taskProps?.assignee?._id &&
        taskProps?.assignee?._id !== taskProps?.addedBy ? (
        <Stack spacing={16} horizontal center style={styles.buttonView}>
          <TouchableOpacity
            onPress={() => {
              let bodyObj: ChangeStatusBody = {
                taskId: taskProps?._id,
              };
              acceptTask(bodyObj);
            }}
            style={styles.approveButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.approve}>
              {t('taskDetails:accept')}
            </TextView>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setDetail(undefined);
              setReopenModal(true);
            }}
            style={styles.disapproveButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.disapprove}>
              {t('taskDetails:reject')}
            </TextView>
          </TouchableOpacity>
        </Stack>
      ) : (
        userData?._id === taskProps?.addedBy &&
        taskProps?.taskStatus === 'AwaitingApproval' && (
          <Stack spacing={16} horizontal center style={styles.buttonView}>
            <TouchableOpacity
              onPress={() => {
                let bodyObj: ChangeStatusBody = {
                  taskId: taskProps?._id,
                };
                approveTask(bodyObj);
              }}
              style={styles.approveButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.approve}>
                {t('taskDetails:approve')}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setDetail(undefined);
                setReopenModal(true);
              }}
              style={styles.disapproveButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.disapprove}>
                {t('taskDetails:disapprove')}
              </TextView>
            </TouchableOpacity>
          </Stack>
        )
      )}
      {disapproveModal && (
        <Modal
          isVisible={true}
          onBackdropPress={() => {
            setDisapproveModal(false);
            setDetail(undefined);
          }}
          onBackButtonPress={() => {
            setDisapproveModal(false);
            setDetail(undefined);
          }}>
          <Stack style={[styles.modalView, styles.modalHeightView]}>
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              style={styles.shareVia}>
              {taskProps?.taskStatus === 'Assigned'
                ? t('taskDetails:reasonReject')
                : t('taskDetails:reason')}
            </TextView>
            <TextField
              style={styles.inputText}
              placeholder={t('taskDetails:addDetailsPlaceholder')}
              onChangeText={text => setDetail(text)}
              value={detail}
              returnKeyType="none"
              maxLength={250}
              isError={detail?.trim().length! === 0}
              multiline
            />
            {detail === '' && (
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.error}>
                {t('taskDetails:addReasonError')}
              </TextView>
            )}
            <Stack style={styles.cancel}>
              <PrimaryButton
                title={t('save')}
                onPress={() => {
                  let bodyObj: ChangeStatusBody = {
                    taskId: taskProps?._id,
                    message: detail?.trim(),
                  };
                  if (!detail || detail?.trim().length! === 0) {
                    setDetail('');
                    Keyboard.dismiss();
                  } else {
                    if (taskProps?.taskStatus === 'Assigned') {
                      rejectTask(bodyObj);
                    } else {
                      disApproveTask(bodyObj);
                    }
                    setDisapproveModal(false);
                  }
                }}
              />
              {/* <TouchableOpacity
                  onPress={() => setDisapproveModal(false)}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('save')}
                  </TextView>
                </TouchableOpacity> */}
            </Stack>
          </Stack>
        </Modal>
      )}
      {reopenModal && (
        <Modal isVisible={reopenModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {taskProps?.taskStatus === 'Assigned'
                  ? t('taskDetails:alertReject')
                  : t('taskDetails:alert')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setReopenModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setReopenModal(false);
                    setDisapproveModal(true);
                  }}>
                  {taskProps?.taskStatus === 'Assigned'
                    ? t('yes')
                    : t('taskDetails:reopened')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {(isLoadingAcceptTask ||
        isLoadingRejectTask ||
        isLoadingApproveTask ||
        isLoadingDisApproveTask) && <Loader />}
    </>
  );
};
