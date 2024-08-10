import React from 'react';
import {StyleProp, View, ViewProps, ViewStyle} from 'react-native';

type StackProps = Omit<ViewProps, 'style'> & {
  children: React.ReactNode;
  spacing?: number;
  center?: boolean;
  horizontal?: boolean;
  spaceBelow?: number;
  verticalAlign?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  horizontalAlign?:
    | 'flex-start'
    | 'flex-end'
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'space-evenly'
    | undefined;
  style?: StyleProp<ViewStyle>;
};

export const Stack: React.FC<StackProps> = ({
  children,
  spacing = 0,
  center = false,
  horizontal = false,
  spaceBelow = 0,
  style,
  horizontalAlign,
  verticalAlign,
  ...props
}) => {
  const horizontalStyles: ViewStyle | undefined = horizontal
    ? {flexDirection: 'row'}
    : undefined;
  const spaceStyle: ViewStyle = {marginHorizontal: spacing};
  const centerStyle: ViewStyle | undefined = center
    ? {
        justifyContent: 'center',
        alignItems: 'center',
      }
    : undefined;

  const spaceBelowStyle: ViewStyle = horizontal
    ? {paddingRight: spaceBelow}
    : {paddingBottom: spaceBelow};

  const horizontalAlignStyles: ViewStyle | undefined = horizontalAlign
    ? {justifyContent: horizontalAlign}
    : undefined;
  const verticalAlignStyles: ViewStyle | undefined = verticalAlign
    ? {alignItems: verticalAlign}
    : undefined;
  return (
    <View
      style={[
        spaceStyle,
        centerStyle,
        horizontalStyles,
        spaceBelowStyle,
        verticalAlignStyles,
        horizontalAlignStyles,
        style,
      ]}
      {...props}>
      <>{children}</>
    </View>
  );
};

interface StackItemProps extends Omit<StackProps, 'children'> {
  children: React.ReactNode[];
  childrenGap?: number;
}

export const StackItem: React.FC<StackItemProps> = ({
  children,
  childrenGap,
  spacing = 0,
  center = false,
  horizontal = false,
  spaceBelow = 0,
  horizontalAlign,
  verticalAlign,
  style,
  ...props
}) => {
  const lastChildrenIndex = children.length - 1;

  const gapStyle = (index: number) => {
    const styles: ViewStyle = horizontal
      ? {
          paddingRight: index === lastChildrenIndex ? 0 : childrenGap,
        }
      : {
          paddingBottom: index === lastChildrenIndex ? 0 : childrenGap,
        };

    return styles;
  };

  const horizontalStyles: ViewStyle | undefined = horizontal
    ? {flexDirection: 'row'}
    : undefined;
  const spaceStyle: ViewStyle = {marginHorizontal: spacing};
  const centerStyle: ViewStyle | undefined = center
    ? {
        justifyContent: 'center',
        alignItems: 'center',
      }
    : undefined;
  const spaceBelowStyle: ViewStyle = horizontal
    ? {paddingRight: spaceBelow}
    : {paddingBottom: spaceBelow};

  const horizontalAlignStyles: ViewStyle | undefined = horizontalAlign
    ? {justifyContent: horizontalAlign}
    : undefined;
  const verticalAlignStyles: ViewStyle | undefined = verticalAlign
    ? {alignItems: verticalAlign}
    : undefined;

  return (
    <View
      style={[
        spaceStyle,
        centerStyle,
        horizontalStyles,
        spaceBelowStyle,
        verticalAlignStyles,
        horizontalAlignStyles,
        style,
      ]}
      {...props}>
      <>
        {children.map((item, index) => {
          return (
            <View key={index} style={[gapStyle(index)]}>
              {item}
            </View>
          );
        })}
      </>
    </View>
  );
};
