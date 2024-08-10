import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
// import {Divider} from 'components/Divider';
import {StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';

interface FABBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  onRequestClick?: () => void;
  props: any;
}

export const FABBottomPanel: React.FC<FABBottomPanel> = ({
  panelState,
  onPressClose,
  onRequestClick,
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
    smallPanelHeight: 250,
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
      <StackItem spacing={25} childrenGap={12} style={styles.swipable}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CreateContact');
            closePanel();
          }}>
          <TextView weight="medium" variant={FontSizes.xMedium}>
            {t('contacts:createContact')}
          </TextView>
        </TouchableOpacity>
        <Divider size={2} />
        <TouchableOpacity
          onPress={() => {
            onRequestClick?.();
            closePanel();
          }}>
          <TextView weight="medium" variant={FontSizes.xMedium}>
            {t('contacts:requestContact')}
          </TextView>
        </TouchableOpacity>
      </StackItem>
    </SwipeablePanel>
  );
};
