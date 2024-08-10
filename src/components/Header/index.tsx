import React from 'react';
import {View, StyleSheet, ViewStyle, Keyboard} from 'react-native';
import {TextView} from '../TextView';
import {DrawerActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/core';
import {FontSizes} from 'common/theme/font';
import {Stack, StackItem} from 'components/Stack';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {IconView} from 'components/Icon';
import {colors} from 'common/theme/colors';
import Ripple from 'react-native-material-ripple';

interface HeaderProps {
  label?: string | undefined;
  showLabel?: boolean;
  hideLabel?: boolean;
  headerShadow?: boolean;
  padding?: boolean;
  navigationType?: 'DRAWER' | 'STACK' | undefined;
  preventDefault?: boolean | undefined;
  onBackPress?: () => void;
  RenderMainContainer?: React.FC | undefined;
  RenderLeftContainer?: React.FC | undefined;
  translateY: Animated.SharedValue<number>;
  isCloseNavigation?: boolean;
  // This is use for disabling the main container default style
  disableDefaultStyle?: boolean;
  // This is use for styles without and with count over icons
  isCount?: boolean;
  RenderPrivateToggle?: React.FC;
  labelVieStyle?: ViewStyle;
}

export const Header: React.FunctionComponent<HeaderProps> = ({
  label = 'Header Title',
  hideLabel = false,
  RenderMainContainer,
  RenderLeftContainer,
  translateY,
  preventDefault,
  navigationType = 'DRAWER',
  onBackPress,
  isCloseNavigation,
  disableDefaultStyle,
  padding = false,
  isCount,
  RenderPrivateToggle,
  labelVieStyle,
}) => {
  const navigation = useNavigation();

  const MenuIconButton: React.FC = () => {
    const onPress = () => {
      Keyboard.dismiss();
      navigation.dispatch(DrawerActions.toggleDrawer());
    };
    return (
      <Ripple onPress={onPress} style={styles.paddingStyle}>
        <IconView name={'hamburger_menu'} />
      </Ripple>
    );
  };

  const BackIconContainer: React.FC = () => {
    const onPress = () => {
      if (preventDefault) {
        onBackPress?.();
      } else {
        navigation.goBack();
      }
    };
    return (
      <Ripple
        onPress={onPress}
        style={[styles.paddingStyle, {paddingLeft: padding ? 20 : 0}]}>
        <IconView name={isCloseNavigation ? 'close' : 'arrow_back'} />
      </Ripple>
    );
  };
  const LeftButtonContainer: React.FC = () => {
    switch (navigationType) {
      case 'DRAWER':
        return <MenuIconButton />;
      default:
        return <BackIconContainer />;
    }
  };

  const headerAnimatedStyles = useAnimatedStyle(() => {
    const heightVal = interpolate(
      translateY.value,
      [0, 60],
      [100, 60],
      Extrapolate.CLAMP,
    );
    return {
      height: hideLabel ? 60 : heightVal,
      backgroundColor: translateY.value >= 60 ? colors.white : undefined,
      elevation: translateY.value >= 60 ? 20 : 0,
    };
  });
  const textAnimatedStyles = useAnimatedStyle(() => {
    const translateYVal = interpolate(
      translateY.value,
      [0, 60],
      [0, -35],
      Extrapolate.CLAMP,
    );
    const translateXVal = interpolate(
      translateY.value,
      [0, 60],
      [0, 40],
      Extrapolate.CLAMP,
    );
    const fontSizeVal = interpolate(
      translateY.value,
      [0, 60],
      [FontSizes.xlarge, FontSizes.large],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateX: translateXVal}, {translateY: translateYVal}],
      fontSize: fontSizeVal,
    };
  });

  const disableDefaultStyles: ViewStyle | undefined = !disableDefaultStyle
    ? {
        paddingTop: 20,
      }
    : undefined;

  const mainStyles = RenderMainContainer
    ? styles.baseMainContainerStyle
    : headerAnimatedStyles;

  return (
    <View style={styles.main}>
      <Animated.View style={[mainStyles]}>
        <StackItem
          verticalAlign={'flex-start'}
          horizontalAlign={'center'}
          childrenGap={10}
          horizontal={RenderMainContainer ? true : false}
          style={styles.container}>
          <LeftButtonContainer />
          {RenderMainContainer ? (
            <Stack style={disableDefaultStyles}>
              <RenderMainContainer />
            </Stack>
          ) : !hideLabel ? (
            <StackItem
              horizontal
              center
              horizontalAlign="space-between"
              style={labelVieStyle}>
              <TextView
                animated
                weight="semibold"
                variant={FontSizes.xlarge}
                style={textAnimatedStyles}>
                {label}
              </TextView>
              {RenderPrivateToggle && <RenderPrivateToggle />}
            </StackItem>
          ) : null}
        </StackItem>
      </Animated.View>
      <Stack
        center
        style={[
          isCount
            ? styles.leftContainerCountStyles
            : styles.leftContainerStyles,
          disableDefaultStyles,
        ]}>
        {RenderLeftContainer ? <RenderLeftContainer /> : undefined}
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
  },
  container: {
    position: 'absolute',
    zIndex: 200,
    paddingHorizontal: 20,
    // paddingTop: 20,
    top: 0,
  },
  leftContainerStyles: {
    position: 'absolute',
    right: 20,
    height: 55,
    top: -5,
  },
  leftContainerCountStyles: {
    position: 'absolute',
    right: 20,
    height: 55,
    top: -10,
  },
  baseMainContainerStyle: {
    height: 55,
  },
  paddingStyle: {
    paddingTop: 20,
  },
});
export default Header;
