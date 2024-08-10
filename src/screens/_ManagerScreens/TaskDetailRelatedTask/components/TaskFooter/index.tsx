import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {InputTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from './index.styles';

export const TaskFooter = (status: any) => {
  const {t} = useTranslation();

  const [reopenModal, setReopenModal] = useState<boolean>(false);
  const [disapproveModal, setDisapproveModal] = useState<boolean>(false);
  const [detail, setDetail] = useState<string>('');

  const styles = Styles();
  return (
    <>
      {(status.status === 'Resolved' && !status?.self) ||
      status.status === 'Assigned' ? (
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
      ) : (
        status?.self && (
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('taskDetails:markAsCompleted')}
              onPress={() => {}}
            />
          </Stack>
        )
      )}
      {disapproveModal && (
        <Modal isVisible={disapproveModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {status.status === 'Assigned'
                  ? t('taskDetails:reasonDisapprove')
                  : t('taskDetails:reason')}
              </TextView>
              <InputTextField
                style={styles.inputText}
                placeholder={t('taskDetails:addDetailsPlaceholder')}
                onChangeText={text => setDetail(text)}
                value={detail}
              />
              <Stack style={styles.cancel}>
                <TouchableOpacity
                  onPress={() => setDisapproveModal(false)}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('save')}
                  </TextView>
                </TouchableOpacity>
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
                {t('taskDetails:alert')}
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
                  {status.status === 'Assigned'
                    ? t('yes')
                    : t('taskDetails:reopen')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
