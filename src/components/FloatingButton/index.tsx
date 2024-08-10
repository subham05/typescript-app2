import {colors} from 'common/theme/colors';
import {Icon} from 'components/Icon';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import Ripple from 'react-native-material-ripple';

const FAB_SIZE = 50;

interface FloatingButtonProps {
  onPress?: () => void;
  name: string;
  styles?: ViewStyle;
  size?: number;
  isButtonDisabled?: boolean;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  name,
  size = 24,
  styles,
  isButtonDisabled,
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
      disabled={isButtonDisabled}
      onPress={onPress}
      style={styles ? styles : container}>
      <View
        style={[
          buttonView,
          {
            backgroundColor: isButtonDisabled
              ? colors.grey_004
              : colors.primary,
          },
        ]}>
        <Icon name={name} size={size} color={colors.white} />
      </View>
    </Ripple>
  );
};
