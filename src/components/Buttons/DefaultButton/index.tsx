import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import React from 'react';
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ButtonCommonProps} from '../interface';

type DefaultButtonProps = ButtonCommonProps;

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  style,
  onPress,
  iconProps,
  width,
  title,
  loading,
  disabled,
  height = 47,
  iconPosition = 'left',
}) => {
  const isDisabled = disabled || loading;
  const color = iconProps?.color
    ? iconProps?.color
    : loading
    ? colors.white
    : colors.primary;

  const buttonStyles: StyleProp<ViewStyle> = {
    backgroundColor: isDisabled ? colors.primary_005 : undefined,
    borderWidth: isDisabled ? undefined : 2,
    borderColor: isDisabled ? undefined : colors.primary,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    flexDirection: 'row',
    borderRadius: 3,
  };
  const buttonTextStyles: StyleProp<TextStyle> = {
    color,
  };

  return (
    <Ripple
      disabled={isDisabled}
      rippleColor={'white'}
      // removeClippedSubviews
      onPress={onPress}
      style={[buttonStyles, style]}>
      <Stack
        horizontal
        spacing={20}
        verticalAlign="center"
        style={iconPosition !== 'left' && styleOther.reverse}>
        {iconProps?.name && !loading && (
          <Icon size={FontSizes.medium} name={iconProps?.name} color={color} />
        )}
        <>{loading && <ActivityIndicator color={color} />}</>
        {loading || (iconProps?.name && <View style={styleOther.spacing} />)}
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={buttonTextStyles}>
          {title}
        </TextView>
      </Stack>
    </Ripple>
  );
};

const styleOther = StyleSheet.create({
  spacing: {
    width: 10,
  },
  reverse: {
    flexDirection: 'row-reverse',
  },
});
