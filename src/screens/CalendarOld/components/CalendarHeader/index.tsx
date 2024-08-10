import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {IconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet} from 'react-native';

interface CalendarHeaderProps {
  calRef: any;
  date: any;
  monthAdd: (calRef: any) => void;
  monthSubtract: (calRef: any) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  calRef,
  date,
  monthAdd,
  monthSubtract,
}) => {
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const monthArray = [
    'Jan',
    'Feb',
    'March',
    'April',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];
  let formattedDate = date;
  let wday = weekday[formattedDate.getDay()];
  let month = monthArray[formattedDate.getMonth()];
  let day = formattedDate.getDate();
  return (
    <StackItem childrenGap={10} style={styles().calendarHead}>
      <Stack horizontal horizontalAlign="space-between">
        <Stack horizontal>
          <TextView weight="medium" variant={FontSizes.large}>
            {month + ' ' + day},{'  '}
          </TextView>
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            style={styles().day}>
            {wday}
          </TextView>
        </Stack>
        <Stack horizontal>
          <Stack center style={styles().icon}>
            <IconButton
              name="arrow_left"
              size={18}
              color={colors.black}
              onPress={() => monthSubtract(calRef)}
            />
            {/* <TouchableOpacity onPress={() => monthSubtract(calRef)}>
              <Icon name="arrow_left" size={18} color={colors.black} />
            </TouchableOpacity> */}
          </Stack>
          <Stack center style={styles().icon}>
            <IconButton
              name="arrow_right"
              size={18}
              color={colors.black}
              onPress={() => monthAdd(calRef)}
            />
            {/* <TouchableOpacity onPress={() => monthAdd(calRef)}>
              <Icon name="arrow_right" size={18} color={colors.black} />
            </TouchableOpacity> */}
          </Stack>
        </Stack>
      </Stack>
      <Stack horizontal horizontalAlign="space-between">
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Mon
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Tue
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Wed
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Thu
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Fri
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Sat
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles().days}>
          Sun
        </TextView>
      </Stack>
    </StackItem>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    calendarHead: {
      marginVertical: 10,
      width: '100%',
    },
    days: {
      color: colors.primary,
    },
    day: {
      color: colors.grey_003,
      marginTop: 5,
    },
    icon: {
      height: 25,
      width: 25,
      borderRadius: 25,
      borderWidth: 2,
      marginRight: 20,
    },
  });
  return mergeStyles;
};
