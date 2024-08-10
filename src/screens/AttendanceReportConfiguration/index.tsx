import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import {StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Stack} from 'stack-container';
import {CalendarHeader} from './components/CalendarHeader';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const AttendanceReportConfigurationScreen = ({}: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [currentYear, setCurrentYear] = useState<number>(
    // eslint-disable-next-line radix
    parseInt(moment().format('YYYY')),
  );

  const [daysArray, setDaysArray] = useState([
    {id: 1, label: 'Sun', value: 'Sunday', selected: true},
    {id: 2, label: 'Mon', value: 'Monday', selected: false},
    {id: 3, label: 'Tue', value: 'Tuesday', selected: false},
    {id: 4, label: 'Wed', value: 'Wednesday', selected: false},
    {id: 5, label: 'Thu', value: 'Thursday', selected: false},
    {id: 6, label: 'Fri', value: 'Friday', selected: false},
    {id: 7, label: 'Sat', value: 'Saturday', selected: true},
  ]);

  // const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'red'};
  // const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
  const dotsArray = [
    {key: 'vacation', color: 'red', selectedDotColor: 'red'},
    {key: 'massage', color: 'blue', selectedDotColor: 'blue'},
  ];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [fullCalendar, setFullCalendar] = useState<boolean>(false);
  // const [optionModal, setOptionModal] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState({
    // '2022-03-31': {dots: [vacation, massage]},
    // '2022-04-10': {dots: [vacation, massage]},
    // '2022-04-22': {dots: [vacation, massage]},
  });
  const calendarRef = useRef(null);
  const [occasionModal, setOccasionModal] = useState<boolean>(false);
  // const [isHoliday, setIsHoliday] = useState<boolean>(false);
  const [occasion, setOccasion] = useState<string>();
  const [initialDate, setInitialDate] = useState(
    moment().clone().startOf('month').format('YYYY-MM-DD'),
  );

  const AddMonth = () => {
    const addMonth = moment(initialDate).add(1, 'month').format('YYYY-MM-DD');
    setInitialDate(addMonth.toString());
    // onDaySelect(addMonth.toString());
    setSelectedDate(new Date(addMonth));
    // calRef.current.header.current.addMonth();
    // let month = JSON.stringify(calRef.current.state.currentMonth);
    // let month1 = moment(month.split('"')[1].split('T')[0]);
    // var futureMonth = moment(month1).add(1, 'M').add(1, 'd');
    // setSelectedDate(
    //   new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    // );
    // onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
  };
  const SubtractMonth = () => {
    const subMonth = moment(initialDate)
      .subtract(1, 'month')
      .format('YYYY-MM-DD');
    setInitialDate(subMonth.toString());
    setSelectedDate(new Date(subMonth));
    // onDaySelect(subMonth.toString());
    // calRef.current.header.current.subtractMonth();
    // let month = JSON.stringify(calRef.current.state.currentMonth);
    // let month1 = moment(month.split('"')[1].split('T')[0]);
    // var futureMonth = moment(month1).subtract(1, 'M').add(1, 'd');
    // setSelectedDate(
    //   new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    // );
    // onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
    // calRef.current.contentRef.onPressArrowLeft();
  };

  let sundays: string[] = [];

  const onDaySelect = (day: any, holiday: boolean) => {
    // let date = day.dateString;
    if (markedDates.hasOwnProperty(day)) {
      setOccasion(markedDates[day]?.message);
    }
    let markedDate: any = {};
    markedDate[day] = {
      customStyles: {
        container: {
          // backgroundColor:
          //   occasionModal && !isHoliday
          //     ? colors.primary
          //     : occasionModal && isHoliday
          //     ? colors.yellow
          //     : colors.primary,
          // backgroundColor: colors.primary,
          backgroundColor: holiday ? colors.yellow : colors.primary,
          height: 33,
          width: 40,
          borderRadius: 6,
          // borderTopLeftRadius: 7,
          // borderBottomLeftRadius: 7,
        },
        text: {
          color: colors.white,
          // fontWeight: 'bold',
        },
        // dotColor: '#50cebb',
      },
      dots: dotsArray,
      selected: true,
      message: occasion,
      // selectedColor: colors.primary,
      // selectedTextColor: colors.white,
    };
    // var selectedDates = sundays.reduce(
    //   (c, v) =>
    //     Object.assign(c, {
    //       [v]: {
    //         selected: true,
    //         customStyles: {
    //           container: {
    //             backgroundColor: colors.yellow,
    //             height: 33,
    //             width: 33,
    //             borderRadius: 6,
    //             // borderTopLeftRadius: 7,
    //             // borderBottomLeftRadius: 7,
    //           },
    //           text: {
    //             color: colors.white,
    //             // fontWeight: 'bold',
    //           },
    //           // dotColor: '#50cebb',
    //         },
    //       },
    //     }),
    //   {},
    // );
    // let selectedDates = {
    //   '2022-03-31': {dots: [vacation, massage]},
    //   '2022-04-10': {dots: [vacation, massage]},
    //   '2022-04-22': {dots: [vacation, massage]},
    // };
    // Object.assign(markedDate, selectedDates);
    // if (holiday) {
    const newMarkedDate = {...markedDates, ...markedDate};
    setMarkedDates(newMarkedDate);
    // } else {
    //   const newMarkedDate = {...markedDate};
    //   setMarkedDates(newMarkedDate);
    // }
    // setIsHoliday(false);
    // const newMarkedDate = {...markedDate};
  };

  const weekendDays = () => {
    daysArray.map(item => {
      if (item.selected) {
        let monday = moment().startOf('month').day(item.value);
        if (monday.date() > 7) {
          monday.add(7, 'd');
        }
        let month = monday.month();
        while (month === monday.month()) {
          sundays.push(moment(monday).format('YYYY-MM-DD'));
          monday.add(7, 'd');
        }
      }
    });
    let markedDate: any = {};
    var selectedDates = sundays.reduce(
      (c, v) =>
        Object.assign(c, {
          [v]: {
            selected: true,
            customStyles: {
              container: {
                backgroundColor: colors.grey_002,
                height: 53,
                width: 40,
                borderRadius: 0,
                marginBottom: -15,
                // borderTopLeftRadius: 7,
                // borderBottomLeftRadius: 7,
              },
              text: {
                color: colors.black,
                // fontWeight: 'bold',
              },
              // dotColor: '#50cebb',
            },
          },
        }),
      {},
    );
    // Object.assign(markedDate, selectedDates);
    const newMarkedDate = {...markedDate, ...selectedDates};
    setMarkedDates(newMarkedDate);
  };
  useEffect(() => {
    weekendDays();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daysArray]);

  const prevYear = () => {
    setCurrentYear(prevState => prevState - 1);
    const subMonth = moment(initialDate)
      .subtract(1, 'year')
      .format('YYYY-MM-DD');
    setInitialDate(subMonth.toString());
    setSelectedDate(new Date(subMonth));
    // onDaySelect(subMonth.toString());
  };
  const nextYear = () => {
    setCurrentYear(prevState => prevState + 1);
    const addMonth = moment(initialDate).add(1, 'year').format('YYYY-MM-DD');
    setInitialDate(addMonth.toString());
    // onDaySelect(addMonth.toString());
    setSelectedDate(new Date(addMonth));
  };

  // console.log('markedDates', markedDates);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('attendance:configuration')}
        translateY={translateY}
      />
      <Stack
        childrenGap={36}
        spacing={16}
        horizontal
        style={styles.head}
        center>
        <Stack center style={styles.icon}>
          <IconButton
            name="arrow_left"
            size={16}
            color={colors.black}
            onPress={prevYear}
          />
        </Stack>
        <TextView weight="medium" variant={FontSizes.medium}>
          {currentYear}
        </TextView>
        <Stack center style={styles.icon}>
          <IconButton
            name="arrow_right"
            size={16}
            color={colors.black}
            onPress={nextYear}
          />
        </Stack>
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack childrenGap={16} spacing={16} spaceBelow={16}>
          <Stack childrenGap={5}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={{color: colors.primary_003}}>
              Set weekends
            </TextView>
            <Stack horizontal horizontalAlign="space-between">
              {daysArray.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setDaysArray(prevValue =>
                        [...prevValue].map(el =>
                          el.id === item.id
                            ? {...el, selected: !item.selected}
                            : el,
                        ),
                      );
                    }}>
                    <Stack
                      style={[
                        styles.days,
                        item.selected
                          ? {backgroundColor: colors.primary}
                          : {backgroundColor: colors.white},
                      ]}
                      key={index.toString()}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.medium}
                        style={[
                          item.selected
                            ? {color: colors.white}
                            : {color: colors.black},
                        ]}>
                        {item.label}
                      </TextView>
                    </Stack>
                  </TouchableOpacity>
                );
              })}
            </Stack>
          </Stack>
          <View style={styles.dividerTop}>
            <Divider />
          </View>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={{color: colors.primary_003}}>
            Set holidays
          </TextView>
          <Stack style={styles.calendar}>
            <Calendar
              ref={calendarRef}
              // firstDay={1}
              onDayPress={day => {
                setSelectedDate(new Date(day.dateString));
                onDaySelect(day.dateString, false);
                setOccasionModal(true);
              }}
              markingType={'custom'}
              initialDate={initialDate}
              markedDates={markedDates}
              renderHeader={() => (
                <CalendarHeader
                  calRef={calendarRef}
                  date={selectedDate}
                  monthAdd={AddMonth}
                  monthSubtract={SubtractMonth}
                  weekendDays={daysArray}
                />
              )}
              // style={styles.calendar}
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
                selectedDayBackgroundColor: colors.grey_001,
                selectedDayTextColor: colors.black,
                todayTextColor: colors.black,
              }}
            />
          </Stack>
        </Stack>
      </Animated.ScrollView>
      {occasionModal && (
        <Modal isVisible={occasionModal}>
          <View style={styles.centeredView}>
            <StackItem childrenGap={10} style={styles.modalView}>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.shareVia}>
                {t('attendance:addOccasion')}
              </TextView>
              <TextField
                placeholder={t('attendance:addOccasion')}
                onChangeText={text => setOccasion(text)}
                value={occasion}
                multiline
                numberOfLines={3}
                style={{
                  backgroundColor: colors.grey_009,
                  width: Dimensions.get('screen').width - 70,
                }}
              />
              <Stack childrenGap={10} horizontal style={styles.modal}>
                <DefaultButton
                  title={t('cancel')}
                  onPress={() => {
                    let dateSelected =
                      moment(selectedDate).format('YYYY-MM-DD');
                    delete markedDates[dateSelected];
                    setMarkedDates(markedDates);
                    setOccasionModal(false);
                    setOccasion('');
                  }}
                  height={41}
                  width={100}
                />
                <PrimaryButton
                  title={t('save')}
                  onPress={() => {
                    // setIsHoliday(true);
                    onDaySelect(
                      moment(selectedDate).format('YYYY-MM-DD'),
                      true,
                    );
                    setOccasionModal(false);
                    // setIsHoliday(false);
                  }}
                  height={42}
                  width={100}
                />
                {/* <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setOccasionModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    // setIsHoliday(true);
                    onDaySelect(moment(selectedDate).format('YYYY-MM-DD'));
                    setOccasionModal(false);
                    // setIsHoliday(false);
                  }}>
                  {t('yes')}
                </TextView> */}
              </Stack>
            </StackItem>
          </View>
        </Modal>
      )}
    </Container>
  );
};
