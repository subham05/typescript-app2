import {colors} from 'common/theme/colors';
import React from 'react';
import {View, ViewStyle} from 'react-native';

interface DividerProps {
  size?: number;
  color?: string;
  width?: number | string;
}

export const Divider: React.FC<DividerProps> = ({
  size = 1,
  color = colors.grey_002,
  width = '100%',
}) => {
  const horizontalLine: ViewStyle = {
    height: size,
    backgroundColor: color,
    width: width,
  };
  return <View style={horizontalLine} />;
};
