import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {StackItem} from 'components/Stack';
import React from 'react';
import {View} from 'react-native';
import {Styles} from '../index.styles';

interface FilterMenu {
  option: string;
  optionArray: optionArrayType[];
  setOption: (value: string) => void;
}

export interface optionArrayType {
  label: string;
  size?: Set<string>;
  date?: string;
}

export const FilterMenu: React.FC<FilterMenu> = ({
  option,
  optionArray,
  setOption,
}) => {
  const styles = Styles();

  return (
    <>
      {optionArray?.map((item, index) => {
        return (
          <StackItem
            horizontal
            key={index.toString()}
            style={[
              styles.menuView,
              {
                backgroundColor:
                  item.label === option ? colors.grey_009 : colors.white,
              },
            ]}>
            <TextView
              weight={item.label === option ? 'medium' : 'regular'}
              variant={FontSizes.regular}
              onPress={() => setOption!(item.label)}
              style={styles.selectedOption}>
              {item.label}
            </TextView>
            {(item.size?.size! > 0 || item?.date?.length! > 0) && (
              <View>
                <View style={styles.filterDot} />
              </View>
            )}
          </StackItem>
        );
      })}
    </>
  );
};
