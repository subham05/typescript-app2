import {colors} from 'common/theme/colors';
import {Icon} from 'components/Icon';
import {NetworkContext} from 'components/NetworkProvider';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export const OfflineStatusBar = () => {
  const barHeight = useSharedValue(0);
  const translate = useSharedValue(Platform.OS === 'ios' ? -90 : -40);
  const firstRenderRef = useRef<boolean>(true);
  const {netStatus, prevNetStatus} = React.useContext(NetworkContext);
  const [statusBarColor, setStatusBarColor] = useState<string | undefined>(
    undefined,
  );
  const boxStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translate.value}],
      height: barHeight.value,
    };
  });

  const netStateAnimationCallback = useCallback(() => {
    if (!firstRenderRef.current) {
      if (prevNetStatus === undefined && netStatus) {
        // NOTHING TO DO, THIS SITUATION IS FINE,  IF REQUIRED SOME TASKS CAN BE INCLUDED
      }
      if (prevNetStatus && !netStatus) {
        barHeight.value = withTiming(40);
        translate.value = withTiming(0);
        setStatusBarColor(colors.red_001);
      }
      if (!prevNetStatus && netStatus) {
        setStatusBarColor(colors.green_001);
        setTimeout(() => {
          barHeight.value = withTiming(0);
          translate.value = withTiming(Platform.OS === 'ios' ? -90 : -40);
          setStatusBarColor(undefined);
        }, 2000);
      }
    } else {
      firstRenderRef.current = false;
    }
  }, [prevNetStatus, netStatus, barHeight, translate]);

  useEffect(netStateAnimationCallback, [netStateAnimationCallback]);

  const netStatusText = netStatus ? 'Back Online' : 'You are offline';
  const netStatusIcon = netStatus ? 'online' : 'offline';
  const netStatusColor = netStatus ? colors.green_001 : colors.red_001;
  return (
    <>
      <StatusBar backgroundColor={statusBarColor} />
      <Animated.View style={boxStyle}>
        <StackItem
          childrenGap={10}
          horizontal
          center
          style={[styles().container, {backgroundColor: netStatusColor}]}
          spacing={10}>
          <Icon name={netStatusIcon} size={15} color={colors.white} />
          <TextView style={styles().textColors}>{netStatusText}</TextView>
        </StackItem>
      </Animated.View>
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      height: 40,
      zIndex: 99,
      marginHorizontal: -20,
    },
    textColors: {
      color: colors.white,
    },
  });
  return mergeStyles;
};
