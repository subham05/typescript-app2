import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from 'screens/ViewGroup/index.styles';

interface AlertModalProps {
  data?: MessageContactProps | undefined;
  groupName: string | undefined;
  value: boolean;
  onPress: (val: boolean) => void;
  onPressOkay?: () => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  data,
  groupName,
  value,
  onPress,
  onPressOkay,
}) => {
  const {t} = useTranslation();
  const [openModal, setOpenModal] = useState<boolean>(value);

  const styles = Styles();
  return (
    <Modal isVisible={openModal}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles.shareVia}>
            {t('group:removeUserAlert_1')} {data?.name.split(' ', 1)} {''}
            {t('group:removeUserAlert_2')} {'"'} {groupName} {'" '}
            {t('group:removeUserAlert_3')}
          </TextView>
          <Stack horizontal style={styles.modal}>
            <TextView
              weight="bold"
              variant={FontSizes.regular}
              style={styles.reopenModal}
              onPress={() => {
                setOpenModal(false);
                onPress(false);
              }}>
              {t('cancel')}
            </TextView>
            <TextView
              weight="bold"
              variant={FontSizes.regular}
              style={styles.reopenModal}
              onPress={() => {
                onPressOkay?.();
              }}>
              {t('ok')}
            </TextView>
          </Stack>
        </View>
      </View>
    </Modal>
  );
};
