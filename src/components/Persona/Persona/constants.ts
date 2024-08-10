import {ImageStyle, StyleProp, ViewStyle, TextStyle} from 'react-native';

export type UserAvatarPropsType = {
  name: string;
  src: string;
  bgColor: string;
  bgColors: string[];
  textColor: string;
  size: number;
  imageStyle: ImageStyle;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  borderRadius: number;
  component: Object;
};

export enum PersonaInitialsColor {
  lightBlue = 0,
  blue = 1,
  darkBlue = 2,
  teal = 3,
  lightGreen = 4,
  green = 5,
  darkGreen = 6,
  lightPink = 7,
  pink = 8,
  magenta = 9,
  purple = 10,
  orange = 12,
  darkRed = 14,
  violet = 16,
  lightRed = 17,
  gold = 18,
  burgundy = 19,
  warmGray = 20,
  coolGray = 21,
  cyan = 23,
  rust = 24,
}

export const COLOR_SWATCHES_LOOKUP = [
  PersonaInitialsColor.lightBlue,
  PersonaInitialsColor.blue,
  PersonaInitialsColor.darkBlue,
  PersonaInitialsColor.teal,
  PersonaInitialsColor.green,
  PersonaInitialsColor.darkGreen,
  PersonaInitialsColor.lightPink,
  PersonaInitialsColor.pink,
  PersonaInitialsColor.magenta,
  PersonaInitialsColor.purple,
  PersonaInitialsColor.orange,
  PersonaInitialsColor.lightRed,
  PersonaInitialsColor.darkRed,
  PersonaInitialsColor.violet,
  PersonaInitialsColor.gold,
  PersonaInitialsColor.burgundy,
  PersonaInitialsColor.warmGray,
  PersonaInitialsColor.cyan,
  PersonaInitialsColor.rust,
  PersonaInitialsColor.coolGray,
];
