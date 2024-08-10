import React from 'react';
import {Icon} from 'components/Icon';
import {TextView} from 'components/TextView';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';

interface FilterIconProps {
  count?: number;
  onPress?: () => void;
}
export const FilterIcon: React.FC<FilterIconProps> = ({count, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      {count! > 0 && (
        <TextView
          weight="semibold"
          variant={FontSizes.xSmall}
          style={styles.count}>
          {count}
        </TextView>
      )}
      <Icon name="filter" size={24} color={colors.black} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  count: {
    color: colors.white,
    padding: 1,
    backgroundColor: colors.primary,
    textAlign: 'center',
    borderRadius: 10,
    height: 20,
    width: 20,
    top: 9,
    left: 9,
    overflow: 'hidden',
  },
});
