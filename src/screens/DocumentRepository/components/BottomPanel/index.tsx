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

interface DocumentRepositoryBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  isCameraOpen?: (value: boolean) => void;
  isGalleryOpen?: (value: boolean) => void;
  isCopyText?: (value: boolean) => void;
  isHideCopyPaste?: boolean;
}

export const DocumentRepositoryBottomPanel: React.FC<
  DocumentRepositoryBottomPanel
> = ({
  panelState,
  onPressClose,
  isCameraOpen,
  isCopyText,
  isGalleryOpen,
  isHideCopyPaste = false,
  props,
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
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const styles = Styles();
  return (
    <SwipeablePanel
      {...panelProps}
      isActive={isPanelActive}
      smallPanelHeight={isHideCopyPaste ? 280 : 400}
      // smallPanelHeight={250}
    >
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
        {!isHideCopyPaste && <Divider size={2} />}
        {!isHideCopyPaste && (
          <TouchableOpacity
            onPress={() => {
              isCopyText!(true);
              props.navigation.navigate('CreateDocument');
              closePanel();
            }}>
            <StackItem childrenGap={10} horizontal style={styles.modalView}>
              <Icon name="file_copy" size={28} color={colors.primary} />
              <TextView
                weight="medium"
                variant={FontSizes.xMedium}
                style={styles.modalText}>
                {t('copy_Paste')}
              </TextView>
            </StackItem>
          </TouchableOpacity>
        )}
      </StackItem>
    </SwipeablePanel>
  );
};
