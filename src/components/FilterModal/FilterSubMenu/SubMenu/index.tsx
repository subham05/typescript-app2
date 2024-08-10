import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Styles} from '../../index.styles';

interface FilterSubMenu {
  titleArray: any[];
  updateArrayTitle: (value: number) => void;
  selectedTitles: Set<number>;
  selectAll?: boolean;
  updateArrayName?: (value: string) => void;
}

export const FilterSubMenu: React.FC<FilterSubMenu> = ({
  titleArray,
  selectedTitles,
  updateArrayTitle,
  selectAll,
  updateArrayName,
}) => {
  const styles = Styles();
  return (
    <>
      {titleArray.map(({id, name}, index) => {
        return (
          <TouchableOpacity
            key={index.toString()}
            onPress={() => {
              updateArrayTitle(id);
              updateArrayName?.(name);
            }}>
            <Stack horizontal>
              {(selectAll && selectedTitles.has(1)) ||
              selectedTitles.has(id) ? (
                <Icon
                  name="check_circle_selected"
                  size={20}
                  color={colors.primary}
                  style={styles.blankDot}
                />
              ) : (
                <View style={styles.blankDot} />
              )}
              <TextView
                weight={
                  (selectedTitles.has(1) && selectAll) || selectedTitles.has(id)
                    ? 'medium'
                    : 'regular'
                }
                variant={FontSizes.regular}
                style={styles.selected}>
                {name}
              </TextView>
            </Stack>
          </TouchableOpacity>
        );
      })}
    </>
  );
};
