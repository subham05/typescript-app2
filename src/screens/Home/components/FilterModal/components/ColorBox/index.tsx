import React from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Styles} from '../../index.styles';
import {usedColor} from '../ColorStatus';

interface ColorBoxProps {
  data: string;
  selectColor?: (selectedColor: string, index: number) => void;
  useColor?: usedColor;
  index?: number;
}

export interface ColorBoxModal {
  id: number;
  color: string;
  status: string;
}

export const ColorBox: React.FC<ColorBoxProps> = ({
  data,
  selectColor,
  index,
}) => {
  const colorStyle: StyleProp<ViewStyle> = {
    backgroundColor: data,
  };
  const styles = Styles();
  return (
    <TouchableOpacity onPress={() => selectColor?.(data, index!)}>
      <View style={[styles.colorBox, colorStyle]} />
    </TouchableOpacity>
  );
};
