import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {CalendarHeader} from 'screens/Calendar/components/CalendarHeader';
import {CalendarListView} from './components/CalendarList';
import {CurrentTimeComponent} from './components/CurrentTime';
import {Styles} from './index.styles';
import {calendarList} from './mockData';
import {FloatingButton} from 'components/FloatingButton';
import {CalendarBottomPanel} from './components/BottomPanel';
import {CompositeScreenProps} from '@react-navigation/native';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Calender'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;

export const CalendarScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
    props.navigation.setOptions({
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
      },
    });
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
  // useEffect(() => {
  //   setInterval(() => {
  //     currentTime = new Date().toLocaleTimeString('en-US', {
  //       hour: 'numeric',
  //       minute: 'numeric',
  //       hour12: true,
  //     });
  //   }, 1000);
  // });

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

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SelectCompany');
          }}>
          <Stack horizontal>
            <TextView
              weight="semibold"
              variant={FontSizes.small}
              numberOfLines={1}
              style={styles.companyNameHead}>
              All companies
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <Icon name="more" size={24} color={colors.black} />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={styles.filterWidth}>
            <MenuOption
              onSelect={() => props.navigation.navigate('CreateEvent')}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                style={styles.shareText}>
                {t('calendarPage:createEvent')}
              </TextView>
            </MenuOption>
            <Stack spacing={16}>
              <Divider size={2} />
            </Stack>
            <MenuOption
              onSelect={() => props.navigation.navigate('SelectMember')}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                style={styles.shareText}>
                {t('calendarPage:viewCalendar')}
              </TextView>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('calendarPage:head')}
        translateY={translateY}
        // RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
      />
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
      </Animated.ScrollView>
      <Stack style={styles.floatingButton}>
        <FloatingButton
          name="add_floating"
          onPress={() => {
            props.navigation.setOptions({
              tabBarStyle: {
                height: 0,
              },
            });
            openPanel();
          }}
        />
      </Stack>

      {isPanelActive && (
        <CalendarBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
        />
      )}
    </Container>
  );
};
