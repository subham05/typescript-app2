import {ViewStyle} from 'react-native';

export interface TouchableRippleIconButtonProps {
  name: string;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
  isGroup?: boolean;
}
