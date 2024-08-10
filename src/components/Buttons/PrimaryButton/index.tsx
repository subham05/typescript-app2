import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {TextView} from 'components/TextView';
import React from 'react';
import {
  ActivityIndicator,
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ButtonCommonProps} from '../interface';

type PrimaryButtonProps = ButtonCommonProps;

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  style,
  onPress,
  iconProps,
  width,
  title,
  loading,
  disabled,
  fontSize = FontSizes.regular,
  height = 47,
  alignButton = false,
}) => {
  const isDisabled = disabled || loading;
  const color = iconProps?.color ? iconProps?.color : colors.white;

  const buttonStyles: StyleProp<ViewStyle> = {
    backgroundColor: isDisabled ? colors.primary_005 : colors.primary,
    height,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    borderRadius: 3,
    marginBottom: Platform.OS === 'ios' && !alignButton ? -80 : undefined,
    // flexGrow: 1,
  };
  const buttonTextStyles: StyleProp<TextStyle> = {
    color,
  };

  return (
    <Ripple
      disabled={isDisabled}
      rippleColor={'white'}
      removeClippedSubviews={Platform.OS === 'android' ? true : false}
      onPress={onPress}
      style={[buttonStyles, style]}>
      <Stack horizontal spacing={20}>
        {iconProps?.name && !loading && (
          <Icon size={FontSizes.medium} name={iconProps?.name} color={color} />
        )}
        <>{loading && <ActivityIndicator color={color} />}</>
        {loading || (iconProps?.name && <View style={styleOther.spacing} />)}
        <TextView weight="medium" variant={fontSize} style={buttonTextStyles}>
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
});
