import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {Styles} from './index.styles';

interface HomeScreenBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
}

export const HomeScreenBottomPanel: React.FC<HomeScreenBottomPanel> = ({
  panelState,
  onPressClose,
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
    smallPanelHeight: 350,
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
      <StackItem spacing={25} childrenGap={20} style={styles.swipable}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('AddVendor');
            closePanel();
          }}>
          <TextView weight="semibold" variant={FontSizes.medium}>
            {t('managersHomePage:addVendorSupplier')}
          </TextView>
          <View style={styles.line} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('AddEmployee');
            closePanel();
          }}>
          <TextView weight="semibold" variant={FontSizes.medium}>
            {t('managersHomePage:addEmployee')}
          </TextView>
          <View style={styles.line} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('AddTask', {subTask: true});
            closePanel();
          }}>
          <TextView weight="semibold" variant={FontSizes.medium}>
            {t('homePage:addTask')}
          </TextView>
        </TouchableOpacity>
      </StackItem>
    </SwipeablePanel>
  );
};
