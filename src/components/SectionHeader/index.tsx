import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface SectionHeaderProps {
  title?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({title}) => {
  return (
    <View style={styles().eventListContainer}>
      <TextView variant={FontSizes.xMedium} weight="medium">
        {title!}
      </TextView>
    </View>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventListContainer: {
      paddingVertical: 10,
    },
  });
  return mergeStyles;
};
