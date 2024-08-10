import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
interface CalendarItemProps {
  data: CalendarProps;
  onPress: () => void;
  index: string;
}

export interface CalendarProps {
  title: string;
  description: string;
  company?: string;
  time: string;
  type: string;
}

export const CalendarItem: React.FC<CalendarItemProps> = ({data, onPress}) => {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <StackItem
        childrenGap={10}
        style={
          data.type === 'Task' ? styles().containerBlue : styles().containerRed
        }>
        <Stack>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles().title}
            truncate>
            {data.title}
          </TextView>
          <TextView weight="regular" variant={FontSizes.xSmall} truncate>
            {data.description}
          </TextView>
          {data.type === 'Task' ? (
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles().company}
              truncate>
              {data.company}
            </TextView>
          ) : (
            <View style={styles().emptyCompany} />
          )}
        </Stack>
        <TextView
          weight="regular"
          variant={FontSizes.xSmall}
          style={data.type === 'Task' ? styles().blueTime : styles().redTime}>
          {data.time}
        </TextView>
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    containerRed: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
      borderLeftWidth: 5,
      borderLeftColor: colors.red_001,
    },
    containerBlue: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
      borderLeftWidth: 5,
      borderLeftColor: colors.blue_001,
    },
    title: {
      color: colors.primary,
    },
    company: {
      color: colors.grey_003,
    },
    emptyCompany: {
      height: 10,
    },
    redTime: {
      color: colors.red_001,
      paddingBottom: 15,
    },
    blueTime: {
      color: colors.blue_001,
      paddingBottom: 15,
    },
  });
  return mergeStyles;
};
