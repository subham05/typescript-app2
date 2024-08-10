import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import {t} from 'i18next';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {LoginData} from 'request/Authentication';

interface ConfirmationModalInterface {
  itemId?: string;
  isVisible?: boolean;
  Title?: string;
  closeModal: (value: boolean) => void;
  onAccept: (itemId?: string) => void;
  data?: LoginData;
}
const ConfirmationModal: React.FC<ConfirmationModalInterface> = ({
  isVisible,
  closeModal,
  data,
  onAccept,
}) => {
  return (
    <Modal
      isVisible={isVisible!}
      onBackdropPress={() => closeModal(false)}
      onBackButtonPress={() => closeModal(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextView
            weight="semibold"
            variant={FontSizes.medium}
            style={styles.shareVia}>
            {t('login:confirmationLoginTitle')}
          </TextView>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.shareVia}>
            {`${t('login:confirmationLoginDescription1')}, ${data} ${t(
              'login:confirmationLoginDescription2',
            )}`}
          </TextView>
          <Stack horizontal horizontalAlign="space-between">
            <PrimaryButton
              title={t('confirm')}
              onPress={onAccept}
              style={styles.primaryButtonStyle}
            />
            <DefaultButton
              title={t('cancel')}
              onPress={() => closeModal(false)}
              style={styles.defaultButtonStyle}
            />
          </Stack>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmationModal;
const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
    width: globalScreenWidth - 30,
  },
  shareVia: {
    padding: 15,
  },
  modal: {
    alignSelf: 'flex-end',
  },
  isVisible: {
    padding: 15,
    color: colors.primary,
  },
  primaryButtonStyle: {
    width: globalScreenWidth / 2.5,
  },
  defaultButtonStyle: {
    width: globalScreenWidth / 2.5,
  },
});
