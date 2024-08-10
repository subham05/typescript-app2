import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import Ripple from 'react-native-material-ripple';

interface MenuItemProps {
  icon?: string;
  title: string;
  subMenu?: boolean;
  activeScreen?: boolean;
  onPress: () => void;
  reportIcon?: string;
  isStaff?: boolean;
  isLogs?: boolean;
  isStructure?: boolean;
  isSettings?: boolean;
}
export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  subMenu,
  activeScreen,
  reportIcon,
  // isStaff,
  // isLogs,
  // isStructure,
  // isSettings,
}) => {
  return (
    <Ripple
      onPress={onPress}
      style={
        activeScreen
          ? [styles.activeScreen, styles.paddingView]
          : styles.paddingView
      }>
      <StackItem
        horizontal
        horizontalAlign="space-between"
        style={styles.rightPadding}
        // childrenGap={
        //   isStaff
        //     ? Dimensions.get('screen').width / 2
        //     : isLogs
        //     ? Dimensions.get('screen').width / 2.7
        //     : isStructure
        //     ? Dimensions.get('screen').width / 5.4
        //     : isSettings
        //     ? Dimensions.get('screen').width / 2.3
        //     : Dimensions.get('screen').width / 2.17
        // }
      >
        <StackItem
          horizontal
          childrenGap={15}
          style={styles.titleWidth}
          verticalAlign="center">
          <Icon name={icon!} size={20} color={colors.black} />
          <TextView
            weight="regular"
            variant={subMenu ? FontSizes.small : FontSizes.regular}>
            {title}
          </TextView>
        </StackItem>
        {reportIcon && (
          <Icon name={reportIcon!} size={20} color={colors.black} />
        )}
      </StackItem>
    </Ripple>
  );
};

const styles = StyleSheet.create({
  activeScreen: {
    backgroundColor: colors.grey_002,
  },
  paddingView: {
    paddingVertical: 10,
  },
  titleWidth: {
    width: '200%',
  },
  rightPadding: {
    paddingRight: 5,
  },
});
