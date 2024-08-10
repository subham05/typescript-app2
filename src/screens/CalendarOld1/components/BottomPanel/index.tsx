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

interface CalendarBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
}

export const CalendarBottomPanel: React.FC<CalendarBottomPanel> = ({
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
    smallPanelHeight: 320,
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
      <StackItem spacing={25} childrenGap={16} style={styles.swipable}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('CreateEvent');
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="event_note" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('calendarPage:createEvents')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} color={colors.grey_002} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SelectMember');
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon name="calendar" size={22} color={colors.black} />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('calendarPage:viewCalendar')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
        <Divider size={2} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Reminder');
            closePanel();
          }}>
          <StackItem horizontal childrenGap={10} verticalAlign="center">
            <Icon
              name="notification_important"
              size={22}
              color={colors.black}
            />
            <TextView weight="regular" variant={FontSizes.regular}>
              {t('calendarPage:reminder')}
            </TextView>
          </StackItem>
        </TouchableOpacity>
      </StackItem>
    </SwipeablePanel>
  );
};
