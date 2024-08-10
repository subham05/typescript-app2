import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack} from 'stack-container';
import {TextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {DropdownPicker} from 'components/DropdownPicker';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {DatePicker} from 'components/DatePicker';
import {PrimaryButton} from 'components/Buttons';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import moment from 'moment';
import {setEventRecurrence} from 'store/Reducer';
import {isIPhoneX} from 'navigation/Stacks/MainTabNavigation';
import {showToast} from 'common/utils/ToastMessage';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';

type Props = NativeStackScreenProps<SignedInStackParamList, 'CustomRecurrence'>;

export const CustomRecurrenceScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const dispatch = useAppDispatch();
  const translateY = useSharedValue(0);

  const {eventRecurrence} = useAppSelector(state => state?.formanagement);

  const {data} = {
    ...route.params,
  };

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const allRepeatData = [
    {label: 'Week', value: 'WEEK'},
    {label: 'Month', value: 'MONTH'},
    {label: 'Year', value: 'YEAR'},
  ];
  const [repeatEvery, setRepeatEvery] = useState<string>('');
  const [repeatOption, setRepeatOption] = useState<string>('WEEK');

  const [endsOption, setEndsOption] = useState<string>('Never');

  const [occurrence, setOccurrence] = useState<string>();

  const [pickedDate, setPickedDate] = useState<string>();
  const [pickedDateObject, setPickedDateObject] = useState<string>();
  const [fromDate, setFromDate] = useState<string>();
  const [fromDateObject, setFromDateObject] = useState<string>();

  const [repeatEveryError, setRepeatEveryError] = useState<boolean>(false);
  const [repeatsOnDateError, setRepeatsOnDateError] = useState<boolean>(false);
  const [endsOnDateError, setEndsOnDateError] = useState<boolean>(false);
  const [afterRecurrenceError, setAfterRecurrenceError] =
    useState<boolean>(false);

  const daysArray = [
    {id: 1, label: 'S', value: 'Sun'},
    {id: 2, label: 'M', value: 'Mon'},
    {id: 3, label: 'T', value: 'Tue'},
    {id: 4, label: 'W', value: 'Wed'},
    {id: 5, label: 'T', value: 'Thr'},
    {id: 6, label: 'F', value: 'Fri'},
    {id: 7, label: 'S', value: 'Sat'},
  ];

  const [selectedDay, setSelectedDay] = useState<string>('Thr');

  useEffect(() => {
    if (eventRecurrence) {
      setRepeatEvery(eventRecurrence.repeatEveryNumber.toString());
      setRepeatOption(eventRecurrence.repeatEvery);
      setSelectedDay(eventRecurrence.selectedDay);
      setEndsOption(eventRecurrence.repeatEndSelected);
      setPickedDateObject(eventRecurrence.on);
      setOccurrence(eventRecurrence.occurance);
      setPickedDate(eventRecurrence.pickedDate);
      setFromDate(eventRecurrence.fromDate);
      setFromDateObject(eventRecurrence.repeatFromUTCObject);
    }
  }, [eventRecurrence]);

  const onSubmit = () => {
    let dataObj = {
      repeatEveryNumber: repeatOption
        ? repeatEvery.length > 0
          ? // eslint-disable-next-line radix
            parseInt(repeatEvery!)
          : ''
        : '',
      repeatEvery: repeatOption,
      repeatWeek: {
        sunday: selectedDay === 'Sun' && repeatOption === 'WEEK' ? true : false,
        monday: selectedDay === 'Mon' && repeatOption === 'WEEK' ? true : false,
        tuesday:
          selectedDay === 'Tue' && repeatOption === 'WEEK' ? true : false,
        wednesday:
          selectedDay === 'Wed' && repeatOption === 'WEEK' ? true : false,
        thursday:
          selectedDay === 'Thr' && repeatOption === 'WEEK' ? true : false,
        friday: selectedDay === 'Fri' && repeatOption === 'WEEK' ? true : false,
        saturday:
          selectedDay === 'Sat' && repeatOption === 'WEEK' ? true : false,
      },
      selectedDay: repeatOption === 'WEEK' ? selectedDay : '' || '',
      repeatFrom: repeatOption !== 'WEEK' ? fromDate : '' || '',
      repeatFromUTCObject: fromDateObject || '',
      repeatEnd: {
        never: endsOption === 'Never' ? true : false,
        on: endsOption === 'On' ? pickedDateObject || '' : '',
        occurance: endsOption === 'After' ? occurrence || '' : '',
      },
      repeatEndSelected: endsOption || '',
      pickedDate: pickedDate || '',
    };
    dispatch(setEventRecurrence(dataObj!));
    navigation.goBack();
  };

  const RenderDays = ({item, index}: any) => {
    return (
      <TouchableOpacity onPress={() => setSelectedDay(item.value)}>
        <Stack
          style={[
            styles.days,
            selectedDay === item.value
              ? {backgroundColor: colors.primary}
              : {backgroundColor: colors.white},
          ]}
          key={index.toString()}>
          <TextView
            weight="regular"
            variant={FontSizes.medium}
            style={[
              selectedDay === item.value
                ? {color: colors.white}
                : {color: colors.black},
            ]}>
            {item.label}
          </TextView>
        </Stack>
      </TouchableOpacity>
    );
  };

  return (
    <Container noSpacing>
      <Stack spaceBelow={10}>
        <Header
          navigationType="STACK"
          label={t('createEvent:customRecurrence')}
          translateY={translateY}
        />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        keyboardDismissMode="on-drag"
        scrollEventThrottle={16}>
        <KeyboardAwareScrollView
          extraScrollHeight={-200}
          bounces={false}
          overScrollMode={'never'}>
          <Stack childrenGap={26} spacing={16}>
            <Stack>
              <TextView variant={FontSizes.regular} style={styles.label}>
                {t('createEvent:repeatsEvery')}
              </TextView>
              <Stack horizontal childrenGap={20}>
                <Stack style={styles.repeatTextField}>
                  <TextField
                    placeholder={'1'}
                    onChangeText={text => {
                      setRepeatEvery(text.replace(/[^1-9]/g, ''));
                      if (text.replace(/[^1-9]/g, '').length > 0) {
                        setRepeatEveryError(false);
                      }
                    }}
                    value={repeatEvery}
                    keyboardType="number-pad"
                    maxLength={1}
                    caretHidden
                    isError={repeatEveryError}
                  />
                </Stack>
                <Stack style={styles.repeatDropdown}>
                  <DropdownPicker
                    value={repeatOption}
                    options={allRepeatData}
                    onChange={item => {
                      setRepeatOption(item.value);
                    }}
                    placeholder={t('accountPage:dropdownPlaceholder')}
                  />
                </Stack>
              </Stack>
            </Stack>
            <Stack>
              <TextView variant={FontSizes.regular} style={styles.label}>
                {t('createEvent:repeatsOn')}
              </TextView>
              {repeatOption === 'WEEK' ? (
                <FlatList
                  data={daysArray}
                  renderItem={({item, index}) => (
                    <RenderDays item={item} index={index} />
                  )}
                  keyExtractor={(_, index) => index.toString()}
                  horizontal
                />
              ) : (
                <Stack style={styles.fromOption}>
                  <DatePicker
                    placeholder={DateTimeFormats.ShortMonthDateYear}
                    format={DateTimeFormats.MonthDateYear}
                    value={
                      fromDateObject
                        ? moment(fromDateObject).format(
                            DateTimeFormats.MonthDateYear,
                          )
                        : undefined
                    }
                    minimumDate={
                      data?.startDate !== ''
                        ? new Date(data?.startDate)
                        : new Date()
                    }
                    maximumDate={
                      pickedDateObject?.length! > 0
                        ? new Date(pickedDateObject!)
                        : data?.endDate !== ''
                        ? new Date(data?.endDate)
                        : undefined
                    }
                    isDateTimeSelected={data?.startDate !== '' ? true : false}
                    onDateSelected={value => {
                      if (data?.startDate !== '') {
                        setFromDateObject(value.toISOString());
                        setFromDate(
                          moment(value).format(DateTimeFormats.MonthDateYear),
                        );
                      } else {
                        showToast('Please select date from create event');
                      }
                      setRepeatsOnDateError(false);
                    }}
                    isError={repeatsOnDateError}
                  />
                  {repeatsOnDateError && (
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      style={styles.error}>
                      Required field
                    </TextView>
                  )}
                </Stack>
              )}
            </Stack>
            <Stack>
              <TextView variant={FontSizes.regular} style={styles.label}>
                {t('createEvent:ends')}
              </TextView>
              <Stack childrenGap={20}>
                <Stack childrenGap={10}>
                  <TouchableOpacity
                    onPress={() => {
                      setEndsOption('Never');
                      setAfterRecurrenceError(false);
                      setEndsOnDateError(false);
                    }}>
                    <Stack style={styles.item}>
                      <Stack horizontal childrenGap={10} verticalAlign="center">
                        {endsOption === 'Never' ? (
                          <Icon
                            name="radio_button_checked"
                            size={22}
                            color={colors.black}
                          />
                        ) : (
                          <Icon
                            name="radio_button_unchecked"
                            size={22}
                            color={colors.black}
                          />
                        )}
                        <TextView weight="regular" variant={FontSizes.regular}>
                          {t('createEvent:never')}
                        </TextView>
                      </Stack>
                    </Stack>
                  </TouchableOpacity>
                  <Divider size={1} />
                </Stack>
                <Stack childrenGap={10}>
                  <TouchableOpacity onPress={() => setEndsOption('On')}>
                    <Stack style={styles.item}>
                      <Stack horizontal childrenGap={10} verticalAlign="center">
                        {endsOption === 'On' ? (
                          <Icon
                            name="radio_button_checked"
                            size={22}
                            color={colors.black}
                          />
                        ) : (
                          <Icon
                            name="radio_button_unchecked"
                            size={22}
                            color={colors.black}
                          />
                        )}
                        <TextView weight="regular" variant={FontSizes.regular}>
                          {t('createEvent:on')}
                        </TextView>
                        <Stack style={styles.datePicker}>
                          <DatePicker
                            placeholder={DateTimeFormats.ShortMonthDateYear}
                            format={DateTimeFormats.MonthDateYear}
                            value={pickedDate}
                            minimumDate={
                              fromDateObject?.length! > 0
                                ? new Date(fromDateObject!)
                                : data?.startDate !== ''
                                ? new Date(data?.startDate)
                                : new Date()
                            }
                            maximumDate={
                              data?.endDate !== ''
                                ? new Date(data?.endDate)
                                : undefined
                            }
                            isDateTimeSelected={
                              data?.startDate !== '' ? true : false
                            }
                            onDateSelected={value => {
                              if (data?.startDate !== '') {
                                setPickedDateObject(value.toISOString());
                                setPickedDate(
                                  moment(value).format(
                                    DateTimeFormats.MonthDateYear,
                                  ),
                                );
                              } else {
                                showToast(
                                  'Please select date from create event',
                                );
                              }
                              setEndsOnDateError(false);
                            }}
                            isError={endsOnDateError}
                          />
                          {endsOnDateError && (
                            <TextView
                              weight="regular"
                              variant={FontSizes.small}
                              style={styles.error}>
                              Required field
                            </TextView>
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </TouchableOpacity>
                  <Divider size={1} />
                </Stack>
                <Stack childrenGap={10}>
                  <TouchableOpacity onPress={() => setEndsOption('After')}>
                    <Stack style={styles.item}>
                      <Stack horizontal childrenGap={10} verticalAlign="center">
                        {endsOption === 'After' ? (
                          <Icon
                            name="radio_button_checked"
                            size={22}
                            color={colors.black}
                          />
                        ) : (
                          <Icon
                            name="radio_button_unchecked"
                            size={22}
                            color={colors.black}
                          />
                        )}
                        <TextView weight="regular" variant={FontSizes.regular}>
                          {t('createEvent:after')}
                        </TextView>
                        <Stack style={styles.repeatTextField}>
                          <TextField
                            placeholder={'1'}
                            onChangeText={text => {
                              setOccurrence(text.replace(/[^1-9]/g, ''));
                              if (text.replace(/[^1-9]/g, '').length > 0) {
                                setAfterRecurrenceError(false);
                              }
                            }}
                            value={occurrence}
                            keyboardType="number-pad"
                            style={styles.textField}
                            maxLength={1}
                            caretHidden
                            isError={afterRecurrenceError}
                          />
                        </Stack>
                        <TextView weight="regular" variant={FontSizes.regular}>
                          {t('createEvent:occurrence')}
                        </TextView>
                      </Stack>
                    </Stack>
                  </TouchableOpacity>
                  <Divider size={1} />
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </KeyboardAwareScrollView>
      </Animated.ScrollView>
      <Stack spacing={16} spaceBelow={16} style={styles.bottomSpace}>
        <PrimaryButton
          title={t('save')}
          onPress={() => {
            if (
              (endsOption === 'On' &&
                (pickedDate === undefined ||
                  pickedDate?.trim()?.length === 0)) ||
              (endsOption === 'After' &&
                (occurrence?.trim()?.length === 0 ||
                  occurrence === undefined)) ||
              repeatEvery?.trim()?.length === 0 ||
              repeatEvery === undefined ||
              (repeatOption !== 'WEEK' &&
                (fromDateObject === undefined ||
                  fromDateObject?.trim()?.length === 0))
            ) {
              if (
                repeatEvery?.trim()?.length === 0 ||
                repeatEvery === undefined
              ) {
                setRepeatEveryError(true);
              }
              if (
                repeatOption !== 'WEEK' &&
                (fromDateObject === undefined ||
                  fromDateObject?.trim()?.length === 0)
              ) {
                setRepeatsOnDateError(true);
              }
              if (
                endsOption === 'On' &&
                (pickedDate === undefined || pickedDate?.trim()?.length === 0)
              ) {
                setEndsOnDateError(true);
                setAfterRecurrenceError(false);
              }
              if (
                endsOption === 'After' &&
                (occurrence?.trim()?.length === 0 || occurrence === undefined)
              ) {
                setAfterRecurrenceError(true);
                setEndsOnDateError(false);
              }
              if (endsOption === 'Never') {
                setAfterRecurrenceError(false);
                setEndsOnDateError(false);
              }
            } else {
              setRepeatEveryError(false);
              setRepeatsOnDateError(false);
              setEndsOnDateError(false);
              setAfterRecurrenceError(false);
              onSubmit();
            }
          }}
        />
      </Stack>
    </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.primary_003,
    marginBottom: 5,
  },
  repeatTextField: {width: 45},
  repeatDropdown: {width: 120},
  item: {
    paddingTop: 1,
  },
  datePicker: {width: 170},
  days: {
    height: 28,
    width: 28,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textField: {
    color: colors.black,
    fontSize: FontSizes.medium,
    fontFamily: AppFonts.regular,
    borderRadius: 3,
    height: 40,
    top: 3,
  },
  fromOption: {width: 190},
  error: {
    fontSize: FontSizes.small,
    color: colors.red_002,
  },
  bottomSpace: {
    paddingBottom: isIPhoneX() ? 50 : Platform.OS === 'android' ? 20 : 0,
  },
});
