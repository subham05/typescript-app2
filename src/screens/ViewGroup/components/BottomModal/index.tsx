import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from 'screens/ViewGroup/index.styles';
import {useAppSelector} from 'store/hooks';

interface BottomModalProps {
  data: MessageContactProps | undefined;
  openValue: boolean;
  reopenValue: boolean;
  onPressChattingScreen: () => void;
  onPressViewScreen: () => void;
  onPressOpenModal: (val: boolean) => void;
  onPressReopenModal: (val: boolean) => void;
  isAdmin?: boolean;
}

export const BottomModal: React.FC<BottomModalProps> = ({
  data,
  openValue,
  reopenValue,
  onPressOpenModal,
  onPressReopenModal,
  onPressChattingScreen,
  onPressViewScreen,
  isAdmin,
}) => {
  const {t} = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openModal, setOpenModal] = useState<boolean>(openValue);
  const [reopenModal, setReopenModal] = useState<boolean>(reopenValue);
  const {userData} = useAppSelector(state => state.formanagement);

  const styles = Styles();
  return (
    <Modal
      isVisible={reopenModal}
      style={styles.bottomModal}
      onBackdropPress={() => {
        setReopenModal(false);
        onPressReopenModal(false);
      }}>
      <View style={styles.bottomModalView}>
        <Stack spacing={20}>
          {userData?._id !== data._id && (
            <View>
              <TouchableOpacity
                onPress={() => {
                  setReopenModal(false);
                  onPressReopenModal(false);
                  onPressChattingScreen();
                }}>
                <TextView
                  weight="bold"
                  variant={FontSizes.medium}
                  style={styles.swipableShareText}>
                  {t('group:message')} {data?.name.split(' ', 1)}
                </TextView>
              </TouchableOpacity>
              <View style={styles.swipableModalDivide} />
            </View>
          )}

          <TouchableOpacity
            onPress={() => {
              setReopenModal(false);
              onPressReopenModal(false);
              onPressViewScreen();
            }}>
            <TextView
              weight="bold"
              variant={FontSizes.medium}
              style={styles.swipableShareText}>
              {t('group:view')} {data?.name.split(' ', 1)}
            </TextView>
          </TouchableOpacity>

          {isAdmin && userData?._id !== data._id && (
            <>
              <View style={styles.swipableModalDivide} />
              <TouchableOpacity
                onPress={() => {
                  setReopenModal(false);
                  setOpenModal(true);
                  onPressReopenModal(false);
                  onPressOpenModal(true);
                }}>
                <TextView
                  weight="bold"
                  variant={FontSizes.medium}
                  style={styles.swipableShareText}>
                  {t('group:remove')} {data?.name.split(' ', 1)}
                </TextView>
              </TouchableOpacity>
            </>
          )}
        </Stack>
      </View>
    </Modal>
  );
};
