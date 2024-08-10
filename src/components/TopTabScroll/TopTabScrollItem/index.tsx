import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface TopTabItemProps {
  item: any;
  TopTab: any;
  onPress: (selectedItem: any, index: number) => void;
  props: any;
  index: number;
}

export const TopTabItem: React.FC<TopTabItemProps> = ({
  item,
  TopTab,
  onPress,
  index,
}) => {
  const onSelect = () => {
    onPress(item, index);
  };
  const isSelected = item === TopTab;
  return (
    <TouchableOpacity
      style={isSelected ? styles().topTabSelected : styles().topTabNotSelected}
      onPress={() => {
        onSelect();
      }}>
      <TextView
        weight="medium"
        variant={FontSizes.regular}
        style={styles().topTabText}>
        {item}
      </TextView>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    topTabSelected: {
      marginRight: 20,
      borderBottomWidth: 4,
      borderBottomColor: colors.primary,
      width: 90,
      paddingBottom: 10,
    },
    topTabNotSelected: {
      marginRight: 20,
      width: 90,
      paddingBottom: 10,
    },
    topTabText: {
      textAlign: 'center',
    },
  });
  return mergeStyles;
};
