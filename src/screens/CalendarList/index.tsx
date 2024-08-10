import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import {CalendarList} from 'react-native-calendars';

const RANGE = 24;
const initialDate = '2022-06-10';

const CalendarListScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateArray] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const [isStartDatePicked, setIsStartDatePicked] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEndDatePicked, setIsEndDatePicked] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [endDate, setEndDate] = useState<string>('');

  const onDaySelect = (day: any) => {
    if (!isStartDatePicked) {
      let markedDate: any = {};
      markedDate[day] = {
        startingDay: true,
        customStyles: {
          container: {
            backgroundColor: colors.primary,
            height: 33,
            width: 53,
            borderRadius: 0,
            borderTopLeftRadius: 7,
            borderBottomLeftRadius: 7,
          },
          text: {
            color: colors.white,
          },
        },
      };
      setMarkedDates({...markedDate, ...markedDates});
      setIsStartDatePicked(true);
      setStartDate(day);
    } else {
      let markedDate: any = markedDates;
      let startDay = moment(startDate);
      let endDay = moment(day);
      let range = endDay.diff(startDay, 'days');
      if (range > 0) {
        for (let i = 1; i <= range; i++) {
          let tempDate = startDay.add(1, 'day');
          let tempDateString = moment(tempDate).format('YYYY-MM-DD');
          if (i < range) {
            markedDate[tempDateString] = {
              customStyles: {
                container: {
                  backgroundColor: colors.primary_005,
                  height: 33,
                  width: 53,
                  borderRadius: 0,
                },
                text: {
                  color: colors.black,
                },
              },
              selected: true,
            };
          } else {
            markedDate[tempDateString] = {
              endingDay: true,
              customStyles: {
                container: {
                  backgroundColor: colors.primary,
                  height: 33,
                  width: 53,
                  borderRadius: 0,
                  borderTopRightRadius: 7,
                  borderBottomRightRadius: 7,
                },
                text: {
                  color: colors.white,
                  // fontWeight: 'bold',
                },
              },
            };
          }
        }
        setMarkedDates({...markedDate, ...markedDates});
        setEndDate(day);
        setIsStartDatePicked(false);
        setIsEndDatePicked(true);
        setStartDate('');
      } else {
        // alert('Select an upcomming date!');
      }
    }
  };

  return (
    <CalendarList
      //   testID={testIDs.calendarList.CONTAINER}
      current={initialDate}
      pastScrollRange={RANGE}
      futureScrollRange={RANGE}
      renderHeader={renderCustomHeader}
      // theme={theme}
      onDayPress={day => {
        setSelectedDate(new Date(day.dateString));
        onDaySelect(day.dateString);
        selectedDateArray.push(day.dateString);
      }}
      hideDayNames={true}
      markingType={'custom'}
      markedDates={markedDates}
      theme={{
        backgroundColor: colors.grey_001,
        calendarBackground: colors.grey_001,
        dayTextColor: colors.black,
        textSectionTitleColor: colors.primary,
        textDayHeaderFontSize: FontSizes.regular,
        textDayHeaderFontFamily: AppFonts.bold,
        textDayFontFamily: AppFonts.medium,
        textDayFontSize: FontSizes.regular,
        selectedDayBackgroundColor: colors.primary,
        selectedDayTextColor: colors.white,
        todayTextColor: colors.primary_007,
      }}
    />
  );
};

// const theme = {
//   stylesheet: {
//     calendar: {
//       header: {
//         dayHeader: {
//           fontWeight: '600',
//           color: '#48BFE3',
//         },
//       },
//     },
//   },
//   'stylesheet.day.basic': {
//     today: {
//       borderColor: '#48BFE3',
//       borderWidth: 0.8,
//     },
//     todayText: {
//       color: '#5390D9',
//       fontWeight: '800',
//     },
//   },
// };

function renderCustomHeader(date: any) {
  const header = date.toString('MMMM yyyy');
  const [month, year] = header.split(' ');
  const textStyle: TextStyle = {
    fontSize: 18,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    color: '#5E60CE',
    paddingRight: 5,
  };

  return (
    <View style={styles.header}>
      <Text style={[styles.month, textStyle]}>{`${month}`}</Text>
      <Text style={[styles.year, textStyle]}>{year}</Text>
    </View>
  );
}

export default CalendarListScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 10,
  },
  month: {
    marginLeft: 5,
  },
  year: {
    marginRight: 5,
  },
});
