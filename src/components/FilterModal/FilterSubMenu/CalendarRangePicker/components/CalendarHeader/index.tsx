import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment, {Moment} from 'moment';
import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

interface CalendarHeaderProps {
  calRef: any;
  date: Moment;
  monthAdd: (calRef: any) => void;
  monthSubtract: (calRef: any) => void;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  calRef,
  date,
  monthAdd,
  monthSubtract,
}) => {
  // const weekday = [
  //   'Sunday',
  //   'Monday',
  //   'Tuesday',
  //   'Wednesday',
  //   'Thursday',
  //   'Friday',
  //   'Saturday',
  // ];
  // const monthArray = [
  //   'Jan',
  //   'Feb',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'Aug',
  //   'Sept',
  //   'Oct',
  //   'Nov',
  //   'Dec',
  // ];
  useEffect(() => {
    setFormattedDate(date);
  }, [date]);
  const [formattedDate, setFormattedDate] = useState(date);
  // let wday = weekday[formattedDate.getDay()];
  // const [month, setMonth] = useState(
  //   // eslint-disable-next-line radix
  //   monthArray[parseInt(moment(formattedDate).format('M')) - 1],
  // );
  let day = moment(formattedDate).format('DD');
  let year = moment(formattedDate).format('YYYY');

  const addMonth = () => {
    setFormattedDate(moment(formattedDate).add(1, 'M'));
  };
  const subtractMonth = () => {
    setFormattedDate(moment(formattedDate).subtract(1, 'M'));
  };

  return (
    <StackItem childrenGap={10} style={styles().calendarHead}>
      <Stack horizontal horizontalAlign="space-between" style={styles().head}>
        <Stack horizontal verticalAlign="center">
          <TextView weight="semibold" variant={FontSizes.large}>
            {moment(formattedDate).format('MMM') + ' ' + day},{'  '}
          </TextView>
          <TextView weight="semibold" variant={FontSizes.medium}>
            {year}
          </TextView>
        </Stack>
        <StackItem childrenGap={20} horizontal>
          <TouchableOpacity
            onPress={() => {
              monthSubtract(calRef);
              subtractMonth();
            }}
            style={[styles().icon, styles().alignCenter]}>
            <Icon
              name="arrow_left"
              size={18}
              color={colors.black}
              // onPress={() => {
              //   monthSubtract(calRef);
              //   subtractMonth();
              // }}
            />
            {/* <TouchableOpacity onPress={() => monthSubtract(calRef)}>
              <Icon name="arrow_left" size={18} color={colors.black} />
            </TouchableOpacity> */}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              monthAdd(calRef);
              addMonth();
            }}
            style={[styles().icon, styles().alignCenter]}>
            <Icon
              name="arrow_right"
              size={18}
              color={colors.black}
              // onPress={() => {
              //   monthAdd(calRef);
              //   addMonth();
              // }}
            />
            {/* <TouchableOpacity onPress={() => monthAdd(calRef)}>
              <Icon name="arrow_right" size={18} color={colors.black} />
            </TouchableOpacity> */}
          </TouchableOpacity>
        </StackItem>
      </Stack>
      <Stack horizontal horizontalAlign="space-between">
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Mon
        </TextView>
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Tue
        </TextView>
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Wed
        </TextView>
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Thu
        </TextView>
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Fri
        </TextView>
        <TextView
          weight="semibold"
          variant={FontSizes.regular}
          style={styles().days}>
          Sat
        </TextView>
        <TextView
          weight="semibold"
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
      marginVertical: 20,
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
      // marginRight: 20,
    },
    alignCenter: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    head: {marginBottom: 20},
  });
  return mergeStyles;
};
