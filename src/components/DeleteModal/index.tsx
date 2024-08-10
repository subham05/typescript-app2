import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import {t} from 'i18next';
import React from 'react';
import Modal from 'react-native-modal';
import {Dimensions, StyleSheet, View} from 'react-native';

interface deleteInterface {
  itemId?: string;
  reopenModal?: boolean;
  Title?: string;
  setReopenModal: (value: boolean) => void;
  onDeleteClick: (itemId?: string) => void;
  primaryBtnName?: string;
  secondaryBtnName?: string;
}
const DeleteModal: React.FC<deleteInterface> = ({
  Title,
  itemId,
  reopenModal,
  setReopenModal,
  onDeleteClick,
  primaryBtnName = t('ok'),
  secondaryBtnName = t('cancel'),
}) => {
  return (
    <Modal
      isVisible={reopenModal!}
      onBackdropPress={() => setReopenModal(false)}
      onBackButtonPress={() => setReopenModal(false)}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            style={styles.shareVia}>
            {Title ? Title : t('contacts:deleteAlert')}
          </TextView>
          <Stack horizontal style={styles.modal}>
            <TextView
              weight="semibold"
              variant={FontSizes.regular}
              style={styles.reopenModal}
              onPress={() => setReopenModal(false)}>
              {secondaryBtnName}
            </TextView>
            <TextView
              weight="semibold"
              variant={FontSizes.regular}
              style={styles.reopenModal}
              onPress={() => {
                setReopenModal(false);
                onDeleteClick?.(itemId);
              }}>
              {primaryBtnName}
            </TextView>
          </Stack>
        </View>
      </View>
    </Modal>
  );
};
export default DeleteModal;
const styles = StyleSheet.create({
  centeredView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.black_001,
  },
  modalView: {
    backgroundColor: 'white',
    padding: 15,
    width: Dimensions.get('screen').width - 30,
  },
  shareVia: {
    padding: 15,
  },
  modal: {
    alignSelf: 'flex-end',
  },
  reopenModal: {
    padding: 15,
    color: colors.primary,
  },
});
