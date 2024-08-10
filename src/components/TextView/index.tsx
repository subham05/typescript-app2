import {AppFonts, FontSizes} from 'common/theme/font';
import React, {ReactNode} from 'react';
import {StyleProp, StyleSheet, Text, TextProps, TextStyle} from 'react-native';
import Animated from 'react-native-reanimated';

const TextWeight = {
  regular: 'regular',
  medium: 'medium',
  semibold: 'semibold',
  bold: 'bold',
  light: 'light',
};

export type TextViewProps = TextProps &
  Pick<TextStyle, 'textAlign'> & {
    variant?: 22 | 18 | 16 | 14 | 12 | 52 | 28 | 42 | 10 | 20;
    weight?: 'regular' | 'medium' | 'semibold' | 'bold' | 'light';
    children: string | string | ReactNode;
    style?: StyleProp<TextStyle>;
    animated?: boolean;
    truncate?: boolean;
  };
export const TextView: React.FC<TextViewProps> = ({
  children,
  variant = FontSizes.regular,
  weight = TextWeight.regular,
  style,
  textAlign,
  animated = false,
  truncate,
  ...props
}) => {
  const fontFamilyStyle = () => {
    switch (weight) {
      case TextWeight.bold:
        return AppFonts.bold;
      case TextWeight.semibold:
        return AppFonts.semibold;
      case TextWeight.medium:
        return AppFonts.medium;
      case TextWeight.light:
        return AppFonts.light;
      default:
        return AppFonts.regular;
    }
  };

  const truncateStyle: TextStyle | undefined = truncate
    ? {
        // width:  0,
        flexGrow: 1,
      }
    : undefined;

  if (animated) {
    return (
      <Animated.Text
        style={[
          styles.textStyles,
          {fontSize: variant!},
          {
            letterSpacing: variant > 20 ? -1 : undefined,
            textAlign,
          },
          {fontFamily: fontFamilyStyle()},
          style,
        ]}
        {...props}>
        {children}
      </Animated.Text>
    );
  }
  return (
    <Text
      allowFontScaling={false}
      style={[
        styles.textStyles,
        {fontSize: variant!},
        {
          letterSpacing: variant > 20 ? -1 : undefined,
          textAlign,
        },
        {fontFamily: fontFamilyStyle()},
        truncateStyle,
        style,
      ]}
      ellipsizeMode={truncate ? 'tail' : undefined}
      numberOfLines={truncate ? 1 : undefined}
      {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  textStyles: {
    color: 'black',
  },
});
