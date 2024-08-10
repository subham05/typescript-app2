import React from 'react';
import {colors} from 'common/theme/colors';
import {createIconSetFromIcoMoon} from 'react-native-vector-icons';
import {IconProps} from 'react-native-vector-icons/Icon';
const fontelloConfig = require('../../assets/fonts/selection.json');
export const Icon = createIconSetFromIcoMoon(fontelloConfig);

export const IconView: React.FC<IconProps> = ({
  name = 'aboutus',
  size = 24,
  color = colors.black,
}) => {
  return (
    <>
      <Icon name={name} size={size} color={color} />
    </>
  );
};
