import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View, ViewStyle} from 'react-native';
import {PriorityTag} from '../component';
import {TodaysEvent} from 'request/Dashboard';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import moment from 'moment';

interface EventItemProps {
  item: TodaysEvent | undefined;
  onPress?: (item: TodaysEvent | undefined) => void;
  horizontal?: boolean;
}

export type EventInterface = {
  name: string;
  description: string;
  date: string;
  time: string;
  type: string;
};

export const EventItem: React.FC<EventItemProps> = ({
  item,
  onPress,
  horizontal,
}) => {
  const {subject, color, description, startTime, endTime, startDate, isPassed} =
    {
      ...item,
    };

  const horizontalStyles: ViewStyle | undefined = horizontal
    ? {width: 230}
    : undefined;

  let finalDate =
    moment().format(DateTimeFormats.YearMonthDay) === startDate
      ? DateTimeFormats.Today
      : startDate;

  return (
    <>
      {((horizontal && !isPassed) || !horizontal) && (
        <TouchableOpacity
          onPress={() => onPress!(item)}
          style={[
            styles().container,
            horizontal ? horizontalStyles : undefined,
          ]}>
          <View style={styles().priorityWrapper}>
            <PriorityTag type={color} />
          </View>

          <StackItem spaceBelow={15} style={styles().ellipsize}>
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              numberOfLines={1}
              ellipsizeMode="tail">
              {subject}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.xSmall}
              numberOfLines={1}
              style={{color: colors.grey_003}}
              ellipsizeMode="tail">
              {description}
            </TextView>
          </StackItem>

          <StackItem horizontal childrenGap={30}>
            <StackItem childrenGap={5} horizontal>
              <Icon name="calendar" size={18} color={colors.primary_003} />
              <TextView weight="regular" variant={FontSizes.xSmall}>
                {finalDate}
              </TextView>
            </StackItem>
            <StackItem childrenGap={5} horizontal verticalAlign="center">
              <Icon name="time" size={20} color={colors.primary_003} />
              <TextView weight="regular" variant={FontSizes.xSmall}>
                {startTime + ' - ' + endTime}
              </TextView>
            </StackItem>
          </StackItem>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    infoSection: {
      flexDirection: 'row',
    },
    container: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
    },
    priorityWrapper: {
      position: 'absolute',
      right: 20,
    },
    ellipsize: {
      width: '90%',
    },
  });
  return mergeStyles;
};
