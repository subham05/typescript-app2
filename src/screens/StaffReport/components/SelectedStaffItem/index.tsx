import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface SelectedStaffItemProps {
  item: any;
  selectedStaff: any;
  onPress: (selectedItem: any, index: number) => void;
  props: any;
  index: number;
}

export const SelectedStaffItem: React.FC<SelectedStaffItemProps> = ({
  item,
  selectedStaff,
  onPress,
  index,
}) => {
  const onSelect = () => {
    onPress(item, index);
  };
  const isSelected = item === selectedStaff;
  return (
    <TouchableOpacity
      style={isSelected ? styles().staffSelected : styles().staffNotSelected}
      onPress={() => {
        onSelect();
      }}>
      <TextView
        weight="semibold"
        variant={FontSizes.regular}
        style={styles().staffText}>
        {item}
      </TextView>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    staffSelected: {
      marginRight: 20,
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
      width: 90,
      paddingBottom: 10,
    },
    staffNotSelected: {
      marginRight: 20,
      width: 90,
      paddingBottom: 10,
    },
    staffText: {
      textAlign: 'center',
    },
  });
  return mergeStyles;
};
