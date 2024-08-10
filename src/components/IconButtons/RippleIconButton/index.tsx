import {Icon} from 'components/Icon';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {TouchableRippleIconButtonProps} from '../interface';

// interface RippleIconButtonProps {
//   name: string;
//   onPress: () => void;
//   size?: number;
//   color?: string;
//   style?: ViewStyle;
// }
export const RippleIconButton: React.FC<TouchableRippleIconButtonProps> = ({
  name,
  size = 18,
  onPress,
  color,
  style,
  isGroup,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={isGroup ? styles.placeholderView : styles.touchableView}>
      <Icon name={name} size={size} color={color} style={style} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  touchableView: {
    marginRight: 10,
    marginTop: 10,
    marginBottom: 15,
  },
  placeholderView: {
    alignItems: 'center',
  },
});
