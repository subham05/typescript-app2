import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Icon, IconView} from 'components/Icon';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import {Calendar} from 'react-native-calendars';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  useGetDayCalendarMutation,
  useMarkedDatesCalendarMutation,
  MarkedDatesCalendar,
  ShowMoreArray,
  DisplayArray,
} from 'request/Calendar';
import {CalendarHeader} from 'screens/Calendar/components/CalendarHeader';
import {useAppSelector} from 'store/hooks';
import {EventCard} from './components/EventCard';
import RenderTimeline from './components/RenderTimeline';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ShowMore, {ShowMoreModal} from './components/ShowMore';
import ShowMorePopup from './components/ShowMorePopup';
import {Styles} from './index.styles';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {EventProps, events, timelineArray} from './mockData';
import {respHeight, respWidth} from './utils/responsive';
import {ResourceMembersItem} from 'screens/SelectResourceMember/components/ResourceMemberItem';

export type CalendarNavigationProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Calender'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;

export const CalendarScreen = (props: CalendarNavigationProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {companyId} = useAppSelector(state => state?.formanagement);
  const {params} = props.route;
  const [
    trigger,
    {
      data: myCalendarData,
      isError: isCalendarError,
      isLoading: isCalendarLoading,
      isSuccess: isCalendarSuccess,
    },
  ] = useGetDayCalendarMutation();

  const [
    getMarkedDates,
    {
      data: markedDatesData,
      isError: isMarkedDatesError,
      isLoading: isMarkedDatesLoading,
      isSuccess: isMarkedDatesSuccess,
    },
  ] = useMarkedDatesCalendarMutation();

  useEffect(() => {
    if (isCalendarError || isMarkedDatesError) {
      showToast('Something went wrong');
    }
  }, [isCalendarError, isMarkedDatesError]);

  const YMDFormat = 'YYYY-MM-DD';

  const [calendarOpen, setCalendarOpen] = useState<boolean>(true);
  const [initialDate, setInitialDate] = useState(
    moment().clone().startOf('month').format(YMDFormat),
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [eventsData, setEventsData] = useState<DisplayArray[] | undefined>([]);
  const [showMoreEventsData, setShowMoreEventsData] = useState<
    ShowMoreArray[] | undefined
  >([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [dotsData, setDotsData] = useState<MarkedDatesCalendar[] | undefined>(
    [],
  );

  const [showEventsPopup, setShowEventsPopup] = useState<boolean>(false);
  const [moreEvents, setMoreEvents] = useState<EventProps[]>([]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [markedDates, setMarkedDates] = useState();

  const calendarRef = useRef(null);

  const calendarViewHeight = useSharedValue(380);

  const CalendarHeightStyle = useAnimatedStyle(() => {
    return {height: calendarViewHeight.value};
  });

  const getMarkedDatesObj = useMemo(() => {
    const companyIdList: string[] = [];
    companyId.map(company => companyIdList.push(`${company._id}`));
    return {
      companyId: companyIdList,
      viewType: calendarOpen ? 'MONTH' : 'WEEK',
      selectedDate: moment(initialDate, YMDFormat).toISOString(),
      userId: params?.user ? params.user.userId : '',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, calendarOpen, params?.user]);

  const getEventsBodyObj = useMemo(() => {
    const companyIdList: string[] = [];
    companyId.map(company => companyIdList.push(`${company._id}`));
    return {
      companyId: companyIdList,
      selectedDate: moment(initialDate, YMDFormat).toISOString(),
      userId: params?.user ? params.user.userId : '',
    };
  }, [companyId, initialDate, params?.user]);

  useFocusEffect(
    useCallback(() => {
      getMarkedDates(getMarkedDatesObj);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getMarkedDatesObj]),
  );

  useFocusEffect(
    useCallback(() => {
      trigger(getEventsBodyObj);
      setEventsData([]);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getEventsBodyObj]),
  );

  // useEffect(() => {
  //   trigger(getEventsBodyObj);
  //   setEventsData([]);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [getEventsBodyObj]);

  const dotsDataFunction = (day?: any) => {
    let dotsObj = {};
    dotsData?.map(item => {
      const arr = item?.dots.map(dotItem => {
        return {selectedColor: dotItem?.color, color: dotItem?.color};
      });
      const date = {
        [item?.date]: {
          dots: [arr[0]],
          selectedColor: colors.primary,
          selectedTextColor: colors.white,
          selected: day === item?.date ? true : false,
        },
      };
      Object.assign(dotsObj, date);
    });
    return dotsObj;
  };

  useEffect(() => {
    if (isMarkedDatesSuccess) {
      setDotsData(markedDatesData?.data);
    }
  }, [isMarkedDatesSuccess, markedDatesData]);

  useEffect(() => {
    onDaySelect(moment().format(YMDFormat));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dotsData]);

  useEffect(() => {
    if (isCalendarSuccess) {
      setEventsData(myCalendarData?.data.displayArray);
      setShowMoreEventsData(myCalendarData?.data.showMoreArray);
      setTotalCount(myCalendarData?.data.eventsCount);
    }
  }, [isCalendarSuccess, myCalendarData]);

  useEffect(() => {
    onDaySelect(moment().format(YMDFormat));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addMonthWeek = (calRef: any) => {
    if (calendarOpen) {
      const addMonth = moment(initialDate).add(1, 'month').format(YMDFormat);
      setInitialDate(addMonth.toString());
      onDaySelect(addMonth.toString());
      setSelectedDate(new Date(addMonth));
    } else {
      const addWeek = moment(selectedDate).add(1, 'week').format(YMDFormat);
      calRef.current.getNextWeek();
      setInitialDate(addWeek.toString());
      setSelectedDate(new Date(addWeek));
      onDaySelect(addWeek.toString());
    }
  };

  const subtractMonthWeek = (calRef: any) => {
    if (calendarOpen) {
      const subMonth = moment(initialDate)
        .subtract(1, 'month')
        .format(YMDFormat);
      setInitialDate(subMonth.toString());
      setSelectedDate(new Date(subMonth));
      onDaySelect(subMonth.toString());
    } else {
      const subWeek = moment(selectedDate)
        .subtract(1, 'week')
        .format(YMDFormat);
      calRef.current.getPreviousWeek();
      setInitialDate(subWeek.toString());
      setSelectedDate(new Date(subWeek));
      onDaySelect(subWeek.toString());
    }
  };

  const onDaySelect = (day: any) => {
    let markedDate: any = {};
    markedDate[day] = {
      selectedColor: colors.primary,
      color: colors.white,
      selectedTextColor: colors.white,
      selected: true,
      marked: true,
    };
    let selectedDates = dotsDataFunction(day);
    Object.assign(markedDate, selectedDates);
    setMarkedDates(markedDate);
    setInitialDate(moment(day).format(YMDFormat).toString());
  };

  const menuData: MenuModel[] = [
    {
      name: t('calendarPage:createEvent'),
      onClick: () => {
        props.navigation.navigate('CreateEvent');
      },
    },
    {
      name: t('calendarPage:viewCalendar'),
      onClick: () => {
        props.navigation.navigate('SelectMember');
      },
    },
    {
      name: t('calendarPage:reminder'),
      onClick: () => {
        props.navigation.navigate('Reminder', {fromCalendar: true});
      },
    },
  ];

  const toggleCalendar = () => {
    if (calendarOpen) {
      calendarViewHeight.value = withSpring(130, {mass: 0.8});
    } else {
      calendarViewHeight.value = withSpring(380, {mass: 0.8});
    }
    setCalendarOpen(!calendarOpen);
  };

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <TouchableOpacity
          onPress={() =>
            props.navigation.navigate('SelectCompany', {
              onGoBack: () => {},
            })
          }>
          <Stack horizontal verticalAlign="center">
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              numberOfLines={1}
              style={Styles.companyName}>
              {companyId?.length > 1
                ? t('addManager:allSelectedCompany')
                : companyId![0]?.name}
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        <PopupMenu data={menuData} height={respHeight(175)} />
      </Stack>
    );
  };

  const onShowMorePress = (value: EventProps[]) => {
    setShowEventsPopup(!showEventsPopup);
    setMoreEvents(value);
  };
  const renderMainContainer = () => {
    return (
      <Stack>
        <ResourceMembersItem item={params?.user!} />
      </Stack>
    );
  };

  return (
    <Container noSpacing>
      <Stack style={{marginBottom: 30}}>
        <Header
          label={t('calendarPage:head')}
          translateY={translateY}
          RenderLeftContainer={params?.user ? undefined : renderLeftContainer}
          RenderMainContainer={params?.user ? renderMainContainer : undefined}
          navigationType={params?.user ? 'STACK' : 'DRAWER'}
          padding={params?.user ? true : false}
          // disableDefaultStyle
        />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack
          spacing={8}
          spaceBelow={30}
          // style={{marginTop: params?.user ? 40 : 0}}
        >
          <Animated.View style={CalendarHeightStyle}>
            <Stack spacing={12}>
              <CalendarHeader
                calRef={calendarRef}
                date={selectedDate}
                monthAdd={addMonthWeek}
                monthSubtract={subtractMonthWeek}
              />
            </Stack>
            {calendarOpen ? (
              <Calendar
                firstDay={1}
                onDayPress={day => {
                  setSelectedDate(new Date(day.dateString));
                  onDaySelect(day.dateString);
                }}
                initialDate={initialDate}
                markingType={'multi-dot'}
                markedDates={markedDates}
                renderHeader={() => <></>}
                hideExtraDays={true}
                hideArrows={true}
                hideDayNames={true}
                theme={{
                  backgroundColor: colors.grey_001,
                  calendarBackground: colors.grey_001,
                  dayTextColor: colors.black,
                  textSectionTitleColor: colors.primary,
                  textDayHeaderFontSize: FontSizes.regular,
                  textDayFontSize: FontSizes.regular,
                  selectedDayBackgroundColor: colors.grey_001,
                  todayTextColor: colors.black,
                  textDayFontWeight: '400',
                  // selectedDayTextColor: colors.grey_008,
                  // textDayFontFamily: AppFonts.medium,
                }}
              />
            ) : (
              <CalendarStrip
                style={Styles.calendarStripHeight}
                showMonth={false}
                selectedDate={selectedDate}
                ref={calendarRef}
                disabledDateNumberStyle={{
                  fontSize: FontSizes.small,
                }}
                markedDates={dotsData}
                onDateSelected={day => {
                  let formatDate = moment(day).format(YMDFormat).toString();
                  setSelectedDate(new Date(formatDate));
                  onDaySelect(formatDate);
                }}
                highlightDateContainerStyle={Styles.highlightedDateContainer}
                calendarAnimation={{
                  duration: 200,
                  type: 'parallel',
                }}
                showDayName={false}
                highlightDateNumberStyle={{
                  color: colors.white,
                  fontSize: FontSizes.small,
                }}
                dateNumberStyle={Styles.dateNumberStyle}
                dayContainerStyle={{
                  paddingTop: respHeight(8),
                }}
                rightSelector={[]}
                leftSelector={[]}
              />
            )}
          </Animated.View>
          <TouchableOpacity
            style={Styles.knobMainView}
            onPress={toggleCalendar}>
            {calendarOpen ? (
              <View style={Styles.knob} />
            ) : (
              <IconView name="arrow_expand_less" size={15} />
            )}
          </TouchableOpacity>
        </Stack>
        <StackItem
          spacing={respWidth(20)}
          childrenGap={10}
          style={Styles.eventsContainer}>
          <Stack horizontal horizontalAlign="space-between">
            <TextView weight="medium" variant={FontSizes.regular}>
              {initialDate === moment().format(YMDFormat)
                ? t('calendarPage:today')
                : moment(initialDate, YMDFormat).format('DD-MM-YYYY')}
            </TextView>
            <TextView weight="regular" variant={FontSizes.small}>
              {totalCount + ' ' + t('calendarPage:events')}
            </TextView>
          </Stack>
          <Divider />
          <Stack horizontal>
            <RenderTimeline data={timelineArray} />
            <EventCard data={eventsData} startFrom={0} props={props} />
            <ShowMore
              data={showMoreEventsData}
              onShowMorePress={onShowMorePress}
            />
          </Stack>
        </StackItem>
        {showEventsPopup && (
          <ShowMorePopup
            eventData={moreEvents}
            isVisible={showEventsPopup}
            setEventsPopup={setShowEventsPopup}
            props={props}
          />
        )}
      </Animated.ScrollView>
      {(isCalendarLoading || isMarkedDatesLoading) && (
        <Loader message="Loading calendar" />
      )}
    </Container>
  );
};
