import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {FilterFooter} from 'components/FilterModal/FilterFooter';
import {FilterMenu, optionArrayType} from 'components/FilterModal/FilterMenu';
import {FilterCompany} from 'components/FilterModal/FilterSubMenu/Company';
import {FilterHeader} from 'components/FilterModal/Header';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal';
import {CalendarHeader} from '../CalendarHeader';
import {Styles} from './index.styles';

interface ActivityLogBottomPanelModal {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
}

export const ActivityLogBottomPanelModal: React.FC<
  ActivityLogBottomPanelModal
> = ({panelState, onPressClose, filterCount}) => {
  const {t} = useTranslation();

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });

  const calendarRef = useRef(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  // const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const AddMonth = (calRef: any) => {
    calRef.current.header.current.addMonth();
    // let month = JSON.stringify(calRef.current.state.currentMonth);
    // let month1 = moment(month.split('"')[1].split('T')[0]);
    // var futureMonth = moment(month1).add(1, 'M').add(1, 'd');
    // setSelectedDate(
    //   new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    // );
    // onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
  };
  const SubtractMonth = (calRef: any) => {
    calRef.current.header.current.subtractMonth();
    // let month = JSON.stringify(calRef.current.state.currentMonth);
    // let month1 = moment(month.split('"')[1].split('T')[0]);
    // var futureMonth = moment(month1).subtract(1, 'M').add(1, 'd');
    // setSelectedDate(
    //   new Date(JSON.stringify(futureMonth).split('"')[1].split('T')[0]),
    // );
    // onDaySelect(JSON.stringify(futureMonth).split('"')[1].split('T')[0]);
    // calRef.current.contentRef.onPressArrowLeft();
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>(t('filter:companies'));

  const [selectedCompanies, setSelectedCompanies] = useState<Set<number>>(
    new Set<number>(),
  );

  const optionArray: optionArrayType[] = [
    {label: t('filter:companies'), size: selectedCompanies},
    {label: t('filter:calendar')},
  ];

  if (selectedCompanies.size > 0) {
    filterCount(1);
  } else {
    filterCount(0);
  }

  const updateArrayCompanies = (id: number) => {
    if (selectedCompanies.has(1) && id !== 1) {
      selectedCompanies.delete(1);
      setSelectedCompanies(new Set(selectedCompanies));
    }
    if (selectedCompanies.has(id)) {
      selectedCompanies.delete(id);
      setSelectedCompanies(new Set(selectedCompanies));
    } else if (id === 1) {
      selectedCompanies.clear();
      setSelectedCompanies(new Set(selectedCompanies));
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    } else {
      setSelectedCompanies(new Set(selectedCompanies.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedCompanies.clear();
    setSelectedCompanies(new Set(selectedCompanies));
    setMarkedDates({});
  };
  // const vacation = {key: 'vacation', color: 'red', selectedDotColor: 'red'};
  // const massage = {key: 'massage', color: 'blue', selectedDotColor: 'blue'};
  const dotsArray = [
    {key: 'vacation', color: 'red', selectedDotColor: 'red'},
    {key: 'massage', color: 'blue', selectedDotColor: 'blue'},
  ];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDateArray] = useState<string[]>([]);
  const [markedDates, setMarkedDates] = useState({
    // '2022-03-31': {dots: [vacation, massage]},
    // '2022-04-10': {dots: [vacation, massage]},
    // '2022-04-22': {dots: [vacation, massage]},
  });

  const [rangeStarted, setRangeStarted] = useState<boolean>(false);
  let rangeArray: string[] = [];

  const onDaySelect = (day: any) => {
    // let date = day.dateString;
    let markedDate: any = {};
    markedDate[day] = {
      customStyles: {
        container: !rangeStarted
          ? {
              backgroundColor: colors.primary,
              height: 33,
              width: 53,
              borderRadius: 0,
              borderTopLeftRadius: 7,
              borderBottomLeftRadius: 7,
            }
          : {
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
      dots: dotsArray,
      selected: true,
      startingDay: !rangeStarted && true,
      endingDay: rangeStarted,
    };
    const newMarkedDate = {...markedDates, ...markedDate};
    setMarkedDates(newMarkedDate);
    setRangeStarted(true);
    if (rangeStarted) {
      rangeArray = getDatesInRange(
        new Date(selectedDateArray[0]),
        new Date(selectedDateArray[1]),
      );
      rangeArray.pop();
      rangeArray.map(item => {
        rangeDaySelect(item);
      });
    }
  };

  const rangeDaySelect = (day: any) => {
    let markedDate: any = {};
    markedDate[day] = {
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
    const newMarkedDate = {...markedDates, ...markedDate};
    setMarkedDates(newMarkedDate);
  };

  const getDatesInRange = (startDate: Date, endDate: number | Date) => {
    const date = new Date(startDate.getTime());
    date.setDate(date.getDate() + 1);
    const dates = [];

    while (date <= endDate) {
      dates.push(moment(new Date(date)).format('YYYY-MM-DD'));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const styles = Styles();
  return (
    <>
      <Modal
        isVisible={isPanelActive}
        onBackdropPress={() => {
          closePanel();
        }}
        style={styles.bottomModal}
        avoidKeyboard={true}>
        <View style={[styles.bottomModalView]}>
          <Stack style={styles.flex}>
            <KeyboardAvoidingView
              behavior="height"
              style={styles.flex}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
              <View style={{height: Dimensions.get('screen').height * 0.63}}>
                <FilterHeader
                  showClearButton={
                    selectedCompanies.size !== 0 ||
                    Object.keys(markedDates).length !== 0
                      ? true
                      : false
                  }
                  clearAllFunction={clearAllFunction}
                />
                <Stack horizontal style={styles.spaceAbove}>
                  <Stack>
                    <FilterMenu
                      option={option}
                      optionArray={optionArray}
                      setOption={setOption}
                    />
                  </Stack>
                  <Stack spacing={16} style={styles.subOptions}>
                    {option === t('filter:companies') ? (
                      <FilterCompany
                        selectedCompanies={selectedCompanies}
                        updateArrayCompanies={updateArrayCompanies}
                      />
                    ) : (
                      <Stack>
                        <TextView
                          weight={'regular'}
                          variant={FontSizes.small}
                          style={styles.selected}>
                          {t('taskDetails:date')}
                        </TextView>
                        <TouchableOpacity
                          onPress={() => setCalendarModal(true)}>
                          <StackItem
                            childrenGap={10}
                            horizontal
                            verticalAlign="center">
                            <Icon
                              name={'calendar'}
                              size={20}
                              color={colors.primary}
                            />
                            <TextView
                              weight="regular"
                              variant={FontSizes.small}>
                              Nov 17 to Nov 21, 2021
                            </TextView>
                          </StackItem>
                        </TouchableOpacity>
                      </Stack>
                    )}
                  </Stack>
                </Stack>
              </View>
            </KeyboardAvoidingView>
            <FilterFooter closePanel={closePanel} />
          </Stack>
        </View>
      </Modal>

      {calendarModal && (
        <Modal
          isVisible={calendarModal}
          onBackdropPress={() => setCalendarModal(false)}>
          <View>
            <Calendar
              ref={calendarRef}
              firstDay={1}
              onDayPress={day => {
                setSelectedDate(new Date(day.dateString));
                onDaySelect(day.dateString);
                selectedDateArray.push(day.dateString);
              }}
              renderHeader={() => (
                <CalendarHeader
                  calRef={calendarRef}
                  date={selectedDate}
                  monthAdd={AddMonth}
                  monthSubtract={SubtractMonth}
                />
              )}
              // style={styles.calendar}
              markingType={'custom'}
              markedDates={markedDates}
              // markedDates={{
              //   '2022-06-21': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //         borderTopLeftRadius: 7,
              //         borderBottomLeftRadius: 7,
              //       },
              //       text: {
              //         color: colors.white,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     startingDay: true,
              //     // color: colors.primary,
              //     // textColor: 'white',
              //   },
              //   '2022-06-22': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary_005,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //       },
              //       text: {
              //         color: colors.black,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     // color: colors.primary_005,
              //     // textColor: colors.black,
              //   },
              //   '2022-06-23': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary_005,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //       },
              //       text: {
              //         color: colors.black,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     // color: colors.primary_005,
              //     // textColor: colors.black,
              //     // marked: true,
              //     // dotColor: colors.black,
              //   },
              //   '2022-06-24': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary_005,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //       },
              //       text: {
              //         color: colors.black,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     // color: colors.primary_005,
              //     // textColor: colors.black,
              //   },
              //   '2022-06-25': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary_005,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //       },
              //       text: {
              //         color: colors.black,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     // color: colors.primary_005,
              //     // textColor: colors.black,
              //   },
              //   '2022-06-26': {
              //     customStyles: {
              //       container: {
              //         backgroundColor: colors.primary,
              //         height: 33,
              //         width: 53,
              //         borderRadius: 0,
              //         borderTopRightRadius: 7,
              //         borderBottomRightRadius: 7,
              //       },
              //       text: {
              //         color: colors.white,
              //         // fontWeight: 'bold',
              //       },
              //     },
              //     endingDay: true,
              //     // color: colors.primary,
              //     // textColor: 'white',
              //   },
              // }}
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
