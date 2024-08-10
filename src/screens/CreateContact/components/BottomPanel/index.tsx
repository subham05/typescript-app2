import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';

interface CreateContactBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  isCameraOpen?: (value: boolean) => void;
  isGalleryOpen?: (value: boolean) => void;
}

export const CreateContactBottomPanel: React.FC<CreateContactBottomPanel> = ({
  panelState,
  onPressClose,
  isCameraOpen,
  isGalleryOpen,
}) => {
  const {t} = useTranslation();

  const panelProps = {
    fullWidth: true,
    openLarge: false,
    onlySmall: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    smallPanelHeight: 300,
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <StackItem spacing={25} childrenGap={18} style={styles.swipable}>
        <TouchableOpacity
          onPress={() => {
            isCameraOpen!(true);
            closePanel();
          }}>
          <StackItem childrenGap={10} horizontal style={styles.modalView}>
            <Icon name="camera" size={28} color={colors.primary} />
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.modalText}>
              {t('takePhoto')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} />
        <TouchableOpacity
          onPress={() => {
            isGalleryOpen!(true);
            closePanel();
          }}>
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
      </StackItem>
    </SwipeablePanel>
  );
};
