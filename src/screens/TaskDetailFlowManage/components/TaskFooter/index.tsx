import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  ChangeStatusBody,
  TaskDetails,
  useAcceptTaskMutation,
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

  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [disapproveModal, setDisapproveModal] = useState<boolean>(false);
  const [detail, setDetail] = useState<string>('');

  useEffect(() => {
    if (isSuccessAcceptTask) {
      showToast(AcceptTaskData?.message);
      onAcceptTask?.();
    } else if (isErrorAcceptTask) {
      showToast(JSON.stringify(AcceptTaskError));
    }
  }, [
    AcceptTaskData?.message,
    AcceptTaskError,
    isErrorAcceptTask,
    isSuccessAcceptTask,
    onAcceptTask,
  ]);

  useEffect(() => {
    if (isSuccessRejectTask) {
      showToast(RejectTaskData?.message);
      onRejectTask?.();
    } else if (isErrorRejectTask) {
      showToast(JSON.stringify(RejectTaskError));
    }
  }, [
    RejectTaskData?.message,
    RejectTaskError,
    isErrorRejectTask,
    isSuccessRejectTask,
    onRejectTask,
  ]);

  const styles = Styles();
  return (
    <>
      {taskProps?.taskStatus === 'Inprogress' &&
      userData?._id === taskProps?.assignee?._id ? (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton title={t('saveChanges')} onPress={() => {}} />
        </Stack>
      ) : taskProps?.taskStatus === 'Assigned' &&
        userData?._id === taskProps?.assignee?._id ? (
        <Stack
          spacing={16}
          spaceBelow={16}
          horizontal
          center
          style={styles.buttonView}>
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
            onPress={() => setReopenModal(true)}
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
        userData?._id === taskProps?.assignee?._id && (
          <Stack
            spacing={16}
            spaceBelow={16}
            horizontal
            center
            style={styles.buttonView}>
            <TouchableOpacity onPress={() => {}} style={styles.approveButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.approve}>
                {t('taskDetails:approve')}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setReopenModal(true)}
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
          isVisible={disapproveModal}
          onBackdropPress={() => setDisapproveModal(false)}
          onBackButtonPress={() => setDisapproveModal(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
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
              />
              <Stack style={styles.cancel}>
                <PrimaryButton
                  title={t('save')}
                  onPress={() => {
                    let bodyObj: ChangeStatusBody = {
                      taskId: taskProps?._id,
                      message: detail,
                    };
                    rejectTask(bodyObj);
                    setDisapproveModal(false);
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
            </View>
          </View>
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
                    : t('taskDetails:reopen')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {(isLoadingAcceptTask || isLoadingRejectTask) && <Loader />}
    </>
  );
};
