import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

interface uploadGalleryProps {
  swipeModal: boolean;
  closePanel: () => void;
  onPress: () => void;
}
const UploadGallery: React.FC<uploadGalleryProps> = ({
  swipeModal,
  closePanel,
  onPress,
}) => {
  const {t} = useTranslation();

  return (
    <Modal
      isVisible={swipeModal}
      onBackdropPress={closePanel}
      style={styles.bottomModal}>
      <View style={styles.bottomModalView}>
        <TouchableOpacity onPress={onPress}>
          <StackItem childrenGap={10} horizontal style={styles.modalView}>
            <Icon name="upload" size={28} color={colors.primary} />
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.modalText}>
              {t('uploadGallery')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default UploadGallery;
const styles = StyleSheet.create({
  bottomModal: {justifyContent: 'flex-end', margin: 0},
  bottomModalView: {height: 90, backgroundColor: 'white', paddingVertical: 25},
  modalView: {marginLeft: 20},
  modalText: {color: colors.black},
});
