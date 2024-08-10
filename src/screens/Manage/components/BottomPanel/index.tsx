import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import {SwipeablePanel} from 'rn-swipeable-panel';
import {CalendarHeader} from '../CalendarHeader';
import {Styles} from './index.styles';

interface TaskBottomPanel {
  panelState: boolean;
  onPressClose: () => void;
  props: any;
  filterCount: (value: number) => void;
}

export const TaskBottomPanel: React.FC<TaskBottomPanel> = ({
  panelState,
  onPressClose,
  filterCount,
}) => {
  const {t} = useTranslation();

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });

  const calendarRef = useRef(null);
  const [calendarModal, setCalendarModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

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

  const panelProps = {
    fullWidth: true,
    openLarge: true,
    onlyLarge: true,
    showCloseButton: false,
    onClose: () => closePanel(),
    onPressCloseButton: () => closePanel(),
    closeOnTouchOutside: true,
    // ...or any prop you want
  };

  const [isPanelActive, setIsPanelActive] = useState(panelState);

  const closePanel = () => {
    setIsPanelActive(false);
    onPressClose();
  };

  const [option, setOption] = useState<string>('Title');
  const titleArray = [
    {id: 1, name: t('filter:all')},
    {id: 2, name: t('filter:task')},
    {id: 3, name: t('filter:project')},
    {id: 4, name: t('filter:goal')},
  ];
  const priorityArray = [
    {id: 2, name: t('filter:emergency')},
    {id: 3, name: t('filter:high')},
    {id: 4, name: t('filter:medium')},
    {id: 5, name: t('filter:low')},
  ];
  const statusArray = [
    {id: 1, name: t('filter:all')},
    {id: 2, name: t('filter:completed')},
    {id: 3, name: t('filter:inProgress')},
    {id: 4, name: t('filter:overdue')},
    {id: 5, name: t('filter:resolved')},
    {id: 6, name: t('filter:reOpened')},
  ];

  const [selectedTitles, setSelectedTitles] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedPriority, setSelectedPriority] = useState<Set<number>>(
    new Set<number>(),
  );
  const [selectedStatus, setSelectedStatus] = useState<Set<number>>(
    new Set<number>(),
  );

  if (
    (selectedTitles.size > 0 &&
      selectedPriority.size === 0 &&
      selectedStatus.size === 0) ||
    (selectedTitles.size === 0 &&
      selectedPriority.size > 0 &&
      selectedStatus.size === 0) ||
    (selectedTitles.size === 0 &&
      selectedPriority.size === 0 &&
      selectedStatus.size > 0)
  ) {
    filterCount(1);
  } else if (
    (selectedTitles.size > 0 &&
      selectedPriority.size > 0 &&
      selectedStatus.size === 0) ||
    (selectedTitles.size === 0 &&
      selectedPriority.size > 0 &&
      selectedStatus.size > 0) ||
    (selectedTitles.size > 0 &&
      selectedPriority.size === 0 &&
      selectedStatus.size > 0)
  ) {
    filterCount(2);
  } else if (
    selectedTitles.size > 0 &&
    selectedPriority.size > 0 &&
    selectedStatus.size > 0
  ) {
    filterCount(3);
  } else {
    filterCount(0);
  }

  const updateArrayTitle = (id: number) => {
    if (selectedTitles.has(1) && id !== 1) {
      selectedTitles.delete(1);
      setSelectedTitles(new Set(selectedTitles));
    }
    if (selectedTitles.has(id)) {
      selectedTitles.delete(id);
      setSelectedTitles(new Set(selectedTitles));
    } else if (id === 1) {
      selectedTitles.clear();
      setSelectedTitles(new Set(selectedTitles));
      setSelectedTitles(new Set(selectedTitles.add(id)));
    } else {
      setSelectedTitles(new Set(selectedTitles.add(id)));
    }
  };

  const updateArrayPriority = (id: number) => {
    if (selectedPriority.has(id)) {
      selectedPriority.delete(id);
      setSelectedPriority(new Set(selectedPriority));
    } else {
      setSelectedPriority(new Set(selectedPriority.add(id)));
    }
  };

  const updateStatusArray = (id: number) => {
    if (selectedStatus.has(1) && id !== 1) {
      selectedStatus.delete(1);
      setSelectedStatus(new Set(selectedStatus));
    }
    if (selectedStatus.has(id)) {
      selectedStatus.delete(id);
      setSelectedStatus(new Set(selectedStatus));
    } else if (id === 1) {
      selectedStatus.clear();
      setSelectedStatus(new Set(selectedStatus));
      setSelectedStatus(new Set(selectedStatus.add(id)));
    } else {
      setSelectedStatus(new Set(selectedStatus.add(id)));
    }
  };

  const clearAllFunction = () => {
    selectedTitles.clear();
    selectedPriority.clear();
    selectedStatus.clear();
    setSelectedTitles(new Set(selectedTitles));
    setSelectedPriority(new Set(selectedPriority));
    setSelectedStatus(new Set(selectedStatus));
    // setTitleArray([
    //   {name: t('filter:all'), isSelected: false},
    //   {name: t('filter:task'), isSelected: false},
    //   {name: t('filter:project'), isSelected: false},
    //   {name: t('filter:goal'), isSelected: false},
    // ]);
    // setPriorityArray([
    //   {name: t('filter:all'), isSelected: false},
    //   {name: t('filter:emergency'), isSelected: false},
    //   {name: t('filter:high'), isSelected: false},
    //   {name: t('filter:medium'), isSelected: false},
    //   {name: t('filter:low'), isSelected: false},
    // ]);
    // setStatusArray([
    //   {name: t('filter:all'), isSelected: false},
    //   {name: t('filter:completed'), isSelected: false},
    //   {name: t('filter:inProgress'), isSelected: false},
    //   {name: t('filter:overdue'), isSelected: false},
    //   {name: t('filter:resolved'), isSelected: false},
    //   {name: t('filter:reOpened'), isSelected: false},
    // ]);
  };

  const styles = Styles();
  return (
    <SwipeablePanel {...panelProps} isActive={isPanelActive}>
      <View style={styles.container}>
        <View style={{height: Dimensions.get('screen').height * 0.63}}>
          <Stack
            spacing={16}
            spaceBelow={16}
            horizontal
            horizontalAlign="space-between">
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('filter:head')}
            </TextView>
            {(selectedPriority.size !== 0 ||
              selectedTitles.size !== 0 ||
              selectedStatus.size !== 0) && (
              <Ripple onPress={() => clearAllFunction()}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.clearAll}>
                  {t('filter:clearAll')}
                </TextView>
              </Ripple>
            )}
          </Stack>
          <Stack style={styles.horizontalLine}>
            <Divider size={2} />
          </Stack>
          <Stack spacing={16} horizontal style={styles.spaceAbove}>
            <Stack>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Title' ? 'medium' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Title')}
                  style={
                    option === 'Title'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:title')}
                </TextView>
                {selectedTitles.size > 0 && option !== 'Title' ? (
                  <View
                    style={
                      option === 'Title'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Title'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Priority' ? 'medium' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Priority')}
                  style={
                    option === 'Priority'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:priority')}
                </TextView>
                {selectedPriority.size > 0 && option !== 'Priority' ? (
                  <View
                    style={
                      option === 'Priority'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Priority'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Status' ? 'medium' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Status')}
                  style={
                    option === 'Status'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:status')}
                </TextView>
                {selectedStatus.size > 0 && option !== 'Status' ? (
                  <View
                    style={
                      option === 'Status'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Status'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )}
              </StackItem>
              <StackItem horizontal>
                <TextView
                  weight={option === 'Calendar' ? 'medium' : 'regular'}
                  variant={FontSizes.regular}
                  onPress={() => setOption('Calendar')}
                  style={
                    option === 'Calendar'
                      ? styles.selectedOption
                      : styles.notSelectedOption
                  }>
                  {t('filter:calendar')}
                </TextView>
                <View
                  style={
                    option === 'Calendar'
                      ? styles.filterDotBlankSelected
                      : styles.filterDotBlankNotSelected
                  }
                />
                {/* {selectedCalendar.size > 0 ? (
                  <View
                    style={
                      option === 'Calendar'
                        ? styles.filterDotSelected
                        : styles.filterDotNotSelected
                    }>
                    <View style={styles.filterDot} />
                  </View>
                ) : (
                  <View
                    style={
                      option === 'Calendar'
                        ? styles.filterDotBlankSelected
                        : styles.filterDotBlankNotSelected
                    }
                  />
                )} */}
              </StackItem>
            </Stack>
            <Stack style={styles.subOptions}>
              {option === 'Priority' ? (
                <>
                  {priorityArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArrayPriority(id)}>
                        <Stack horizontal>
                          {selectedPriority.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={
                              selectedPriority.has(id) ? 'medium' : 'regular'
                            }
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : option === 'Title' ? (
                <>
                  {titleArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateArrayTitle(id)}>
                        <Stack horizontal>
                          {selectedTitles.has(1) || selectedTitles.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={
                              selectedTitles.has(id) ? 'medium' : 'regular'
                            }
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : option === 'Status' ? (
                <>
                  {statusArray.map(({id, name}, index) => {
                    return (
                      <TouchableOpacity
                        key={index.toString()}
                        onPress={() => updateStatusArray(id)}>
                        <Stack horizontal>
                          {selectedStatus.has(1) || selectedStatus.has(id) ? (
                            <Icon
                              name="check_circle_selected"
                              size={20}
                              color={colors.primary}
                              style={styles.blankDot}
                            />
                          ) : (
                            <View style={styles.blankDot} />
                          )}
                          <TextView
                            weight={
                              selectedStatus.has(id) ? 'medium' : 'regular'
                            }
                            variant={FontSizes.regular}
                            style={styles.selected}>
                            {name}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <>
                  {/* {userType === userTypes.Manager ? (
                    // <Stack style={styles.toDatePicker}>
                    //   <Calendar
                    //     firstDay={1}
                    //     onDayPress={() => {}}
                    //     // markingType={'multi-dot'}
                    //     markingType={'period'}
                    //     // markedDates={markedDates}
                    //     // markedDates={{markedDates, '2022-03-31': {dots: [vacation, massage]}}}
                    //     markedDates={{
                    //       '2022-05-21': {
                    //         startingDay: true,
                    //         color: colors.primary,
                    //         textColor: 'white',
                    //       },
                    //       '2022-05-22': {
                    //         color: colors.primary,
                    //         textColor: 'white',
                    //       },
                    //       '2022-05-23': {
                    //         color: colors.primary,
                    //         textColor: 'white',
                    //         // marked: true,
                    //         dotColor: 'white',
                    //       },
                    //       '2022-05-24': {
                    //         color: colors.primary,
                    //         textColor: 'white',
                    //       },
                    //       '2022-05-25': {
                    //         endingDay: true,
                    //         color: colors.primary,
                    //         textColor: 'white',
                    //       },
                    //     }}
                    //     // renderHeader={() => (
                    //     //   <CalendarHeader
                    //     //     calRef={calendarRef}
                    //     //     date={selectedDate}
                    //     //     monthAdd={AddMonth}
                    //     //     monthSubtract={SubtractMonth}
                    //     //   />
                    //     // )}
                    //     // style={styles.calendar}
                    //     hideExtraDays={true}
                    //     // hideArrows={true}
                    //     // hideDayNames={true}
                    //     theme={{
                    //       backgroundColor: colors.grey_001,
                    //       calendarBackground: colors.grey_001,
                    //       dayTextColor: colors.black,
                    //       textSectionTitleColor: colors.primary,
                    //       textDayHeaderFontSize: FontSizes.regular,
                    //       textDayHeaderFontFamily: AppFonts.bold,
                    //       textDayFontFamily: AppFonts.medium,
                    //       textDayFontSize: FontSizes.regular,
                    //       selectedDayBackgroundColor: colors.primary,
                    //       selectedDayTextColor: colors.white,
                    //     }}
                    //   />
                    // </Stack> */}
                  <Stack>
                    <TextView
                      weight={'regular'}
                      variant={FontSizes.small}
                      style={styles.selected}>
                      {t('taskDetails:date')}
                    </TextView>
                    <TouchableOpacity onPress={() => setCalendarModal(true)}>
                      <StackItem
                        childrenGap={10}
                        horizontal
                        verticalAlign="center">
                        <Icon
                          name={'calendar'}
                          size={20}
                          color={colors.primary}
                        />
                        <TextView weight="regular" variant={FontSizes.small}>
                          Nov 17 to Nov 21, 2021
                        </TextView>
                      </StackItem>
                    </TouchableOpacity>
                  </Stack>
                  {/* // ) : (
                  //   <Stack horizontal>
                  //     <Stack>
                  //       <TextView
                  //         weight={'regular'}
                  //         variant={FontSizes.small}
                  //         style={styles.selected}>
                  //         {t('filter:fromDate')}
                  //       </TextView>
                  //       <FilterDatePicker date="Dec 03, 2021" />
                  //     </Stack>
                  //     <View style={styles.verticalDivider} />
                  //     <Stack style={styles.toDatePicker}>
                  //       <TextView
                  //         weight={'regular'}
                  //         variant={FontSizes.small}
                  //         style={styles.selected}>
                  //         {t('filter:toDate')}
                  //       </TextView>
                  //       <FilterDatePicker date="Dec 03, 2021" />
                  //     </Stack>
                  //   </Stack>
                  // )} */}
                </>
              )}
            </Stack>
          </Stack>
        </View>
        <Stack
          spacing={16}
          spaceBelow={16}
          horizontal
          center
          style={styles.buttonView}>
          <Ripple onPress={() => closePanel()} style={styles.loginButton}>
            <TextView
              weight="medium"
              variant={FontSizes.regular}
              style={styles.login}>
              {t('filter:apply')}
            </TextView>
          </Ripple>
          <Ripple onPress={() => closePanel()} style={styles.addMoreButton}>
            <TextView
              weight="medium"
              variant={FontSizes.regular}
              style={styles.addMore}>
              {t('filter:close')}
            </TextView>
          </Ripple>
        </Stack>
      </View>

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
              markedDates={{
                '2022-05-21': {
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
                      // fontWeight: 'bold',
                    },
                  },
                  startingDay: true,
                  // color: colors.primary,
                  // textColor: 'white',
                },
                '2022-05-22': {
                  customStyles: {
                    container: {
                      backgroundColor: colors.primary_005,
                      height: 33,
                      width: 53,
                      borderRadius: 0,
                    },
                    text: {
                      color: colors.black,
                      // fontWeight: 'bold',
                    },
                  },
                  // color: colors.primary_005,
                  // textColor: colors.black,
                },
                '2022-05-23': {
                  customStyles: {
                    container: {
                      backgroundColor: colors.primary_005,
                      height: 33,
                      width: 53,
                      borderRadius: 0,
                    },
                    text: {
                      color: colors.black,
                      // fontWeight: 'bold',
                    },
                  },
                  // color: colors.primary_005,
                  // textColor: colors.black,
                  // marked: true,
                  // dotColor: colors.black,
                },
                '2022-05-24': {
                  customStyles: {
                    container: {
                      backgroundColor: colors.primary_005,
                      height: 33,
                      width: 53,
                      borderRadius: 0,
                    },
                    text: {
                      color: colors.black,
                      // fontWeight: 'bold',
                    },
                  },
                  // color: colors.primary_005,
                  // textColor: colors.black,
                },
                '2022-05-25': {
                  customStyles: {
                    container: {
                      backgroundColor: colors.primary_005,
                      height: 33,
                      width: 53,
                      borderRadius: 0,
                    },
                    text: {
                      color: colors.black,
                      // fontWeight: 'bold',
                    },
                  },
                  // color: colors.primary_005,
                  // textColor: colors.black,
                },
                '2022-05-26': {
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
                  endingDay: true,
                  // color: colors.primary,
                  // textColor: 'white',
                },
              }}
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
          </View>
        </Modal>
      )}
    </SwipeablePanel>
  );
};
