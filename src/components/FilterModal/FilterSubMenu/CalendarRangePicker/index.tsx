import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment, {Moment} from 'moment';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import Modal from 'react-native-modal';
import {CalendarHeader} from './components/CalendarHeader';
import {Styles} from './index.styles';

export type MarkedDatesModel = {
  [key: string]: MarkingProps;
};
interface CalendarRangePickerModel {
  startingDay?: string;
  startingDayTZ?: string;
  endingDay?: string;
  endingDayTZ?: string;
  markedDatesPicked?: MarkedDatesModel;
  onSelection: (
    startDate: string,
    startTZ: string,
    endDate: string,
    endTZ: string,
    markedDates: MarkedDatesModel,
  ) => void;
}

export const CalendarRangePicker: React.FC<CalendarRangePickerModel> = ({
  startingDay,
  startingDayTZ,
  endingDay,
  endingDayTZ,
  onSelection,
  markedDatesPicked,
}) => {
  const {t} = useTranslation();

  const calendarRef = useRef(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);

  const AddMonth = () => {
    setSelectedDate(moment(selectedDate).add(1, 'M'));
  };
  const SubtractMonth = () => {
    setSelectedDate(moment(selectedDate).subtract(1, 'M'));
  };

  const [selectedDate, setSelectedDate] = useState<Moment>();
  const [selectedDateArray] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState(markedDatesPicked);
  const [isStartDatePicked, setIsStartDatePicked] = useState<boolean>(false);
  const [date, setDate] = useState({
    startDate: startingDay,
    startDateTZ: startingDayTZ,
    endDate: endingDay,
    endDateTZ: endingDayTZ,
  });

  useEffect(() => {
    if (startingDay) {
      setSelectedDate(moment(startingDay));
    }
  }, [startingDay]);

  const onDaySelect = (day: string) => {
    if (!isStartDatePicked || date?.startDate! > day) {
      let markedDate: MarkedDatesModel = {};
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
      setDate({
        startDate: day,
        startDateTZ: moment(day),
        endDate: '',
        endDateTZ: '',
      });
      setMarkedDates({...markedDate});
      setIsStartDatePicked(true);
    } else {
      let markedDate: any = markedDates;
      let startDay = moment(date.startDate);
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
        setMarkedDates({...markedDate});
        setDate(prev => ({
          ...prev,
          endDate: day,
          endDateTZ: moment(day),
        }));
        setIsStartDatePicked(false);
      }
    }
  };

  const styles = Styles();
  return (
    <>
      <Stack>
        <TextView
          weight={'regular'}
          variant={FontSizes.small}
          style={styles.selected}>
          {t('taskDetails:date')}
        </TextView>
        <TouchableOpacity onPress={() => setCalendarModal(true)}>
          <StackItem childrenGap={10} horizontal verticalAlign="center">
            <Icon name={'calendar'} size={20} color={colors.primary} />
            <TextView weight="regular" variant={FontSizes.small}>
              {startingDay && endingDay
                ? moment(startingDay).format(DateTimeFormats.MonthDate) +
                  ' to ' +
                  moment(endingDay).format(DateTimeFormats.MonthDateYear)
                : 'Select start date and end date'}
            </TextView>
          </StackItem>
        </TouchableOpacity>
      </Stack>

      {calendarModal && (
        <Modal
          isVisible={calendarModal}
          onBackdropPress={() => {
            setCalendarModal(false);
            onSelection(
              date.startDate!,
              date.startDateTZ!,
              date.endDate!,
              date.endDateTZ!,
              markedDates!,
            );
          }}>
          <View>
            <Calendar
              ref={calendarRef}
              firstDay={1}
              onDayPress={day => {
                setSelectedDate(moment(day.dateString));
                onDaySelect(day.dateString);
                selectedDateArray.push(day.dateString);
              }}
              initialDate={moment(selectedDate).format('YYYY-MM-DD')}
              renderHeader={() => (
                <CalendarHeader
                  calRef={calendarRef}
                  date={selectedDate!}
                  monthAdd={AddMonth}
                  monthSubtract={SubtractMonth}
                />
              )}
              style={styles.calendar}
              markingType={'custom'}
              markedDates={markedDates}
              hideExtraDays={true}
              hideArrows={true}
              hideDayNames={true}
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
          </View>
        </Modal>
      )}
    </>
  );
};
