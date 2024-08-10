import {Icon} from 'components/Icon';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {TouchableRippleIconButtonProps} from '../interface';

// interface IconButtonProps {
//   name: string;
//   onPress: () => void;
//   size?: number;
//   color?: string;
//   style?: ViewStyle;
// }
export const IconButton: React.FC<TouchableRippleIconButtonProps> = ({
  name,
  size = 18,
  onPress,
  color,
  style,
  disabled,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <Icon name={name} size={size} color={color} style={style} />
    </TouchableOpacity>
  );
};
