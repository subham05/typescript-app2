import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {CalendarHeader} from 'screens/CalendarOld1/components/CalendarHeader';
import {CalendarLineView} from '../CalendarOld1/components/CalendarLine';
import {CalendarListView} from '../CalendarOld1/components/CalendarList';
import {CurrentTimeComponent} from '../CalendarOld1/components/CurrentTime';
import {calendarList} from '../CalendarOld1/mockData';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'CalendarView'>;

export const CalendarViewScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {route} = {...props};
  const {data} = {
    ...route.params,
  };

  let timeArray = [
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '1:00 PM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'red'};
  const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
  const dotsArray = [
    {key: 'vacation', color: 'red', selectedDotColor: 'red'},
    {key: 'massage', color: 'blue', selectedDotColor: 'blue'},
  ];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [fullCalendar, setFullCalendar] = useState<boolean>(false);
  // const [optionModal, setOptionModal] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState({
    '2022-03-31': {dots: [vacation, massage]},
    '2022-04-10': {dots: [vacation, massage]},
    '2022-04-22': {dots: [vacation, massage]},
  });
  const calendarRef = useRef(null);

  const AddMonth = (calRef: any) => {
    calRef.current.header.current.addMonth();
    let month = JSON.stringify(calRef.current.state.currentMonth);
    let month1 = moment(month.split('"')[1].split('T')[0]);
    var futureMonth = moment(month1).add(1, 'M').add(1, 'd');
    setSelectedDate(
      new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    );
    onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
  };
  const SubtractMonth = (calRef: any) => {
    calRef.current.header.current.subtractMonth();
    let month = JSON.stringify(calRef.current.state.currentMonth);
    let month1 = moment(month.split('"')[1].split('T')[0]);
    var futureMonth = moment(month1).subtract(1, 'M').add(1, 'd');
    setSelectedDate(
      new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    );
    onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
    // calRef.current.contentRef.onPressArrowLeft();
  };
  useEffect(() => {
    onDaySelect(moment().format('YYYY-MM-DD'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDaySelect = (day: any) => {
    // let date = day.dateString;
    let markedDate: any = {};
    markedDate[day] = {
      customStyles: {
        container: {
          backgroundColor: colors.primary,
          height: 33,
          width: 33,
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
      // selectedColor: colors.primary,
      // selectedTextColor: colors.white,
    };
    let selectedDates = {
      '2022-03-31': {dots: [vacation, massage]},
      '2022-04-10': {dots: [vacation, massage]},
      '2022-04-22': {dots: [vacation, massage]},
    };
    Object.assign(markedDate, selectedDates);
    setMarkedDates(markedDate);
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header navigationType="STACK" hideLabel translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={8} spaceBelow={100}>
          {/* <ScrollView
        showsVerticalScrollIndicator={false}
        // onScroll={event => {
        //   const scrolling = event.nativeEvent.contentOffset.y;

        //   if (scrolling > 80) {
        //     setFullCalendar(true);
        //   } else {
        //     setFullCalendar(false);
        //   }
        // }}
        // onScroll will be fired every 10ms
        scrollEventThrottle={10}> */}
          {/* <Stack spacing={16} spaceBelow={16}>
          {fullCalendar && (
            <TextView weight="bold" variant={FontSizes.xlarge}>
              Calendar
            </TextView>
          )}
        </Stack> */}

          <Stack horizontal spacing={22}>
            <Persona name={data.name} />
            <Stack style={styles.viewContact}>
              <TextView weight="medium" variant={FontSizes.medium} truncate>
                {data.name}
              </TextView>
              <TextView weight="regular" variant={FontSizes.small}>
                {data.position}
              </TextView>
            </Stack>
          </Stack>
          <Stack spacing={16} spaceBelow={16}>
            <Divider size={2} />
          </Stack>
          {/* {fullCalendar ? ( */}
          <Calendar
            ref={calendarRef}
            firstDay={1}
            onDayPress={day => {
              setSelectedDate(new Date(day.dateString));
              onDaySelect(day.dateString);
            }}
            markingType={'custom'}
            markedDates={markedDates}
            // markedDates={{markedDates, '2022-03-31': {dots: [vacation, massage]}}}
            renderHeader={() => (
              <CalendarHeader
                calRef={calendarRef}
                date={selectedDate}
                monthAdd={AddMonth}
                monthSubtract={SubtractMonth}
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
              selectedDayBackgroundColor: colors.primary,
              selectedDayTextColor: colors.white,
              todayTextColor: colors.primary_007,
            }}
          />
          {/* // ) : ( */}
          {/* //   <CalendarProvider date={new Date().toISOString()}> */}
          {/* //     <ExpandableCalendar */}
          {/* //       ref={calendarRef}
        //       firstDay={1}
        //       disablePan={false} //we need this
        //       disableWeekScroll={true}
        //       onDayPress={day => {
        //         setSelectedDate(new Date(day.dateString));
        //       }}
        //       markingType={'multi-dot'}
        //       markedDates={{
        //         '2022-02-18': {
        //           dots: [vacation, massage],
        //           selected: true,
        //           selectedColor: colors.primary,
        //         },
        //         '2022-02-26': {dots: [vacation, massage], disabled: true},
        //       }}
        //       renderHeader={() => (
        //         <CalendarHeader
        //           calRef={calendarRef}
        //           date={selectedDate}
        //           monthAdd={AddMonth}
        //           monthSubtract={SubtractMonth}
        //         />
        //       )}
        //       // style={styles.calendar}
        //       hideExtraDays={true}
        //       hideArrows={true}
        //       theme={{
        //         backgroundColor: colors.grey_001,
        //         calendarBackground: colors.grey_001,
        //         dayTextColor: colors.black,
        //         textSectionTitleColor: colors.primary,
        //         textDayHeaderFontSize: FontSizes.regular,
        //         textDayHeaderFontFamily: AppFonts.bold,
        //         textDayFontFamily: AppFonts.medium,
        //         textDayFontSize: FontSizes.regular,
        //         selectedDayBackgroundColor: colors.primary,
        //         selectedDayTextColor: colors.white,
        //       }}
        //     />
        //   </CalendarProvider>
        // )} */}
          <StackItem
            spacing={16}
            childrenGap={10}
            style={styles.eventsContainer}>
            <Stack horizontal horizontalAlign="space-between">
              <TextView weight="medium" variant={FontSizes.regular}>
                {t('calendarPage:today')}
              </TextView>
              <TextView weight="regular" variant={FontSizes.small}>
                7 {t('calendarPage:events')}
              </TextView>
            </Stack>
            <Divider />
            <Stack horizontal>
              <Stack style={styles.timeView}>
                <CurrentTimeComponent timeArray={timeArray} />
              </Stack>
              <View style={styles.verticalLine} />
              <Stack style={styles.flexView}>
                <CalendarListView
                  data={calendarList}
                  onPress={() => props.navigation.navigate('TaskDetail')}
                />
              </Stack>
            </Stack>
          </StackItem>
          {/* </ScrollView> */}
        </Stack>
        <Stack style={styles.statusLine}>
          <CalendarLineView data={calendarList} />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
