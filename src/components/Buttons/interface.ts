import {StyleProp, ViewStyle} from 'react-native';

export interface buttonIconProps {
  name?: string | undefined;
  color?: string | undefined;
}
export interface ButtonCommonProps {
  title: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
  iconProps?: buttonIconProps;
  width?: number | string | undefined;
  loading?: boolean;
  disabled?: boolean;
  height?: number | string | undefined;
  fontSize?: 22 | 18 | 16 | 14 | 12 | 52 | 28 | 42 | 10 | 20;
  iconPosition?: 'left' | 'right';
  alignButton?: boolean;
}
