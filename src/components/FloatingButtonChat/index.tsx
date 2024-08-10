import {colors} from 'common/theme/colors';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Chat from '../../assets/svgs/chat.svg';

const FAB_SIZE = 61;

interface FloatingButtonProps {
  onPress?: () => void;
  name: string;
  styles?: ViewStyle;
  size?: number;
}

export const FloatingButtonChat: React.FC<FloatingButtonProps> = ({
  onPress,
  styles,
}) => {
  const container: ViewStyle = {position: 'absolute', bottom: 30, right: 20};
  const buttonView: ViewStyle = {
    borderColor: colors.white,
    borderWidth: 0.5,
    backgroundColor: colors.primary,
    borderRadius: FAB_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    width: FAB_SIZE,
    height: FAB_SIZE,
  };
  return (
    <Ripple
      rippleContainerBorderRadius={FAB_SIZE / 2}
      rippleColor={'white'}
      removeClippedSubviews
      onPress={onPress}
      style={styles ? styles : container}>
      <View style={buttonView}>
        <Chat />
      </View>
    </Ripple>
  );
};
