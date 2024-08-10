import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {IconButton} from 'components/IconButtons';
import {
  NavActions,
  navigationReducer,
  navInitialState,
} from 'navigation/Reducers/navigationReducer';
import React, {useReducer, useState} from 'react';
import {StyleSheet} from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

interface ToolTipProps {
  data: string;
  icon: string;
  onPress?: (val: string) => void;
  type: string;
}
export const ToolTip: React.FC<ToolTipProps> = ({
  data,
  icon,
  type,
  onPress,
}) => {
  const [navContextState, dispatchNav] = useReducer(
    navigationReducer,
    navInitialState,
  );
  const {} = {
    ...navContextState,
  };
  const [tooltipVisible, setTooltipVisible] = useState<boolean>(true);

  const saveDocumentTooltip = () => {
    if (type === 'Document') {
      dispatchNav({
        type: NavActions.SAVE_DOCUMENT_TOOLTIP_SEEN,
        payload: true,
      });

      AsyncStorage.setItem(STR_KEYS.TOOLTIP_DOCUMENT_SEEN, 'true');
      dispatchNav({
        type: NavActions.SAVE_DOCUMENT_TOOLTIP_SEEN,
        payload: true,
      });
    } else if (type === 'Renewal') {
      dispatchNav({
        type: NavActions.SAVE_RENEWALS_TOOLTIP_SEEN,
        payload: true,
      });

      AsyncStorage.setItem(STR_KEYS.TOOLTIP_RENEWALS_SEEN, 'true');
      dispatchNav({
        type: NavActions.SAVE_RENEWALS_TOOLTIP_SEEN,
        payload: true,
      });
    } else {
      dispatchNav({
        type: NavActions.SAVE_CONTACT_TOOLTIP_SEEN,
        payload: true,
      });

      AsyncStorage.setItem(STR_KEYS.TOOLTIP_CONTACT_SEEN, 'true');
      dispatchNav({
        type: NavActions.SAVE_CONTACT_TOOLTIP_SEEN,
        payload: true,
      });
    }
  };

  return (
    <Tooltip
      // backgroundColor={colors.primary}
      contentStyle={styles.contentStyle}
      isVisible={tooltipVisible}
      content={
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.tooltipText}>
          {data}
        </TextView>
      }
      placement="bottom"
      onClose={() => {
        setTooltipVisible(false);
        saveDocumentTooltip();
        onPress!('true');
      }}>
      <IconButton
        name={icon}
        size={24}
        color={colors.black}
        onPress={() => {
          setTooltipVisible(true);
        }}
      />
    </Tooltip>
  );
};

const styles = StyleSheet.create({
  tooltipText: {
    color: colors.white,
    paddingHorizontal: 10,
  },
  contentStyle: {backgroundColor: colors.primary, height: 38},
});
