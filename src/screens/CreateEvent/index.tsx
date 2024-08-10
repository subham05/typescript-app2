import {StackActions, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {
  FormikDropdownPicker,
  FormikTextField,
  FormikTouchableField,
} from 'components/formikFields';
import {FormikDatePicker} from 'components/formikFields/FormikDatePicker';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {Stack, StackItem} from 'components/Stack';
import {TouchableField} from 'components/TouchableField';
import {Formik, FormikProps} from 'formik';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform, TouchableWithoutFeedback, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import SwitchToggle from 'react-native-switch-toggle';
import {useGetCompanyCollectionQuery} from 'request/AddTask';
import {
  useCreateEventMutation,
  useEditEventMutation,
  useGetAllTimezoneCollectionQuery,
} from 'request/Calendar';
import {DropDownModel} from 'screens/AddTask';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {setEventRecurrence, setInviteeMembers} from 'store/Reducer';
import {Reminder} from './components/Reminder';
import {RepeatEvent} from './components/RepeatEvent';
import {InitialEventRecurrence, InitialValues} from './constants';
import {Styles} from './index.styles';
import {EventFormModel} from './types';
import {CreateEventSchema} from './utils';
type Props = NativeStackScreenProps<SignedInStackParamList, 'CreateEvent'>;

export const CreateEventScreen = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {edit = false, eventData} = {
    ...route.params,
  };
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {netStatus} = useContext(NetworkContext);
  const {userData, eventRecurrence, inviteeMembers, selectedInviteeObj} =
    useAppSelector(state => state?.formanagement);
  const dispatch = useAppDispatch();

  const [
    createEvent,
    {
      data: createEventData,
      isLoading: isLoadingCreateTask,
      isSuccess,
      error: CreateEventError,
    },
  ] = useCreateEventMutation();
  const [
    editEvent,
    {
      data: editEventData,
      isSuccess: isEditEventSuccess,
      isLoading: isEditEventLoading,
      error: editEventError,
    },
  ] = useEditEventMutation();
  const {data: timezoneData} = useGetAllTimezoneCollectionQuery();
  const {data: companyResponse, isLoading: companyResponseLoading} =
    useGetCompanyCollectionQuery();

  const [offsetValue, setOffsetValue] = useState<string>();
  const [timezoneValue, setTimezoneValue] = useState<string>();
  const [isTimezoneOpen, setIsTimezoneOpen] = useState<boolean>(false);
  // const [isEditable] = useState<boolean>(edit ? edit : false);
  const [privateToggle, setPrivateToggle] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );
  const [endTime, setEndTime] = useState<string>(
    moment().add(15, 'm').format(DateTimeFormats.Time),
  );
  const [fromDatePicked, setFromDatePicked] = useState<string | undefined>();
  const [toDatePicked, setToDatePicked] = useState<string | undefined>();
  const [startDateUTCObject, setStartDateUTCObject] = useState<string>();
  const [endDateUTCObject, setEndDateUTCObject] = useState<string>();
  const [startTimeUTCObject, setStartTimeUTCObject] = useState<string>();
  const [endTimeUTCObject, setEndTimeUTCObject] = useState<string>();
  const [allCompanyData, setAllCompanyData] = useState<DropDownModel[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [companyValue, setCompanyValue] = useState<string>('');
  const [companyLabel, setCompanyLabel] = useState<string>('');
  const [startDateSelected, setStartDateSelected] = useState(false);
  const [repeateventEdit, setRepeatEventEdit] = useState<string>('');
  const [reminderEdit, setReminderEdit] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditCustom, setIsEditCustom] = useState<boolean>(false);
  const formikRef = useRef<FormikProps<EventFormModel> | null>(null);

  useEffect(() => {
    if (companyResponse) {
      let companyData: DropDownModel[] = [];
      companyResponse.map((item: CompanyProps) =>
        companyData.push({
          label: item.name,
          value: item._id,
        }),
      );
      setAllCompanyData(companyData);
    }
  }, [companyResponse]);
  useEffect(() => {
    if (eventData && edit) {
      setLoading(true);
      const {
        companyDetails,
        subject,
        description,
        endDateUTCObject: endDateUTCObjectData,
        startDateUTCObject: startDateUTCObjectdata,
        inviteeDetails,
        timezone,
        utcOffset,
        endDate,
        startDate,
        venue,
        repeatEvent,
        reminderType,
        repeatEveryNumber,
        repeatEnd,
        repeatEvery,
        repeatFrom,
        repeatWeek,
      } = eventData;
      setIsEditCustom(true);
      formikRef.current?.setFieldValue('companyId', companyDetails?._id);
      setCompanyLabel(companyDetails?.name);
      formikRef.current?.setFieldValue('subject', subject);
      formikRef.current?.setFieldValue('description', description);
      formikRef.current?.setFieldValue(
        'startDate',
        moment(new Date(startDateUTCObjectdata)).format(
          DateTimeFormats.YearMonthDay,
        ),
      );
      formikRef.current?.setFieldValue(
        'startTime',
        moment(startDateUTCObjectdata).format(DateTimeFormats.Time),
      );
      formikRef.current?.setFieldValue('timezone', timezone);
      formikRef.current?.setFieldValue('repeatEvent', repeatEvent);
      formikRef.current?.setFieldValue('reminderType', reminderType);
      formikRef.current?.setFieldValue('venue', venue);
      formikRef.current?.setFieldValue('endDate', endDate);
      formikRef.current?.setFieldValue('startDate', startDate);
      formikRef.current?.setFieldValue(
        'startTime',
        moment(startDateUTCObjectdata).format(DateTimeFormats.Time),
      );
      formikRef.current?.setFieldValue(
        'endTime',
        moment(endDateUTCObjectData).format(DateTimeFormats.Time),
      );
      setReminderEdit(reminderType);
      setOffsetValue(utcOffset);
      InitialValues.reminderType = reminderType;
      InitialValues.repeatEvent = repeatEvent;
      setRepeatEventEdit(repeatEvent);
      setTimezoneValue(timezone);
      setPrivateToggle(false);
      setFromDatePicked(
        moment(startDateUTCObjectdata).format(DateTimeFormats.MonthDateYear),
      );
      setStartDateUTCObject(startDateUTCObjectdata);
      setStartDateSelected(true);
      setToDatePicked(
        moment(endDateUTCObjectData).format(DateTimeFormats.MonthDateYear),
      );
      setEndDateUTCObject(endDateUTCObjectData);
      setStartTime(moment(startDateUTCObjectdata).format(DateTimeFormats.Time));
      setEndTime(moment(endDateUTCObjectData).format(DateTimeFormats.Time));
      setEndTimeUTCObject(endDateUTCObjectData);
      dispatch(setInviteeMembers(inviteeDetails?.map(invitee => invitee._id)));
      const custEvent = {
        repeatEveryNumber: repeatEveryNumber !== null ? repeatEveryNumber : '',
        repeatEvery: repeatEvery !== null ? repeatEvery : 'WEEK',
        repeatWeek: {
          sunday: repeatWeek.sunday,
          monday: repeatWeek.monday,
          tuesday: repeatWeek.tuesday,
          wednesday: repeatWeek.wednesday,
          thursday: repeatWeek.thursday,
          friday: repeatWeek.friday,
          saturday: repeatWeek.saturday,
        },
        selectedDay: '',
        repeatFrom: repeatFrom !== null ? repeatFrom : '',
        repeatFromUTCObject: '',
        repeatEnd: {
          never: repeatEnd.never,
          on: repeatEnd.on !== null ? repeatEnd.on : '',
          occurance: repeatEnd.occurance !== null ? repeatEnd.occurance : '',
        },
        repeatEndSelected: repeatEnd.never ? 'Never' : '',
        pickedDate: '',
      };
      repeatEvent === 'CUSTOM' && dispatch(setEventRecurrence(custEvent));
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventData]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsEditCustom(false);
      };
    }, []),
  );
  const convertDueDateUTC = (startDate, dueDate) => {
    let startDatePostFix = startDate?.split('T')[0];
    let dueDatePostFix = dueDate?.split('T')[1];
    let finalDueDate = startDatePostFix + 'T' + dueDatePostFix;
    return finalDueDate;
  };

  const onSubmit = (values: EventFormModel) => {
    let bodyObj = {
      companyId: [values.companyId],
      userId: userData?._id!,
      subject: values.subject.replace(/\n/g, ''),
      description: values.description,
      timezone: values.timezone,
      utcOffset: offsetValue,
      startDate: values.startDate,
      endDate: values.endDate,
      startTime: values.startTime,
      endTime: values.endTime,
      startDateUTCObject: startTimeUTCObject
        ? convertDueDateUTC(startDateUTCObject, startTimeUTCObject)
        : startDateUTCObject,
      endDateUTCObject: endTimeUTCObject
        ? convertDueDateUTC(endDateUTCObject, endTimeUTCObject)
        : endDateUTCObject,
      venue: values.venue,
      reminderType: values.reminderType,
      repeatEvent: values.repeatEvent,
      isPrivate: privateToggle,
      invitedUsers:
        inviteeMembers !== undefined || inviteeMembers?.length > 0
          ? inviteeMembers
          : [],
      repeatEveryNumber:
        eventRecurrence?.repeatEveryNumber && values.repeatEvent === 'CUSTOM'
          ? eventRecurrence?.repeatEveryNumber
          : '',
      repeatEvery:
        eventRecurrence?.repeatEvery && values.repeatEvent === 'CUSTOM'
          ? eventRecurrence?.repeatEvery
          : '',
      repeatWeek:
        eventRecurrence?.repeatWeek &&
        eventRecurrence?.repeatEvery === 'WEEK' &&
        values.repeatEvent === 'CUSTOM'
          ? eventRecurrence?.repeatWeek
          : {
              sunday: false,
              monday: false,
              tuesday: false,
              wednesday: false,
              thursday: false,
              friday: false,
              saturday: false,
            },
      repeatFrom:
        eventRecurrence?.repeatEvery !== 'WEEK' &&
        values.repeatEvent === 'CUSTOM'
          ? eventRecurrence?.repeatFromUTCObject
          : '',
      repeatEnd:
        eventRecurrence?.repeatEnd && values.repeatEvent === 'CUSTOM'
          ? {
              never: eventRecurrence?.repeatEnd?.never,
              on: eventRecurrence?.repeatEnd?.on
                ? convertDueDateUTC(
                    eventRecurrence?.repeatEnd?.on,
                    endTimeUTCObject,
                  )
                : '',
              occurance: eventRecurrence?.repeatEnd?.occurance,
            }
          : {
              never: false,
              on: '',
              occurance: '',
            },
    };
    if (edit) {
      bodyObj = {...bodyObj, eventId: eventData?._id!};
    }
    console.log('break to date:', bodyObj);
    if (bodyObj.repeatEvent === 'CUSTOM' && bodyObj.repeatEveryNumber <= 0) {
      showToast('Please add custom values');
    } else if (netStatus) {
      edit ? editEvent(bodyObj) : createEvent(bodyObj);
    } else {
      showToast(t('noNetwork'));
    }
  };

  useEffect(() => {
    if (isSuccess || isEditEventSuccess) {
      edit
        ? showToast(editEventData?.message)
        : showToast(createEventData?.message);
      dispatch(setEventRecurrence(InitialEventRecurrence!));
      dispatch(setInviteeMembers([]));
      const popAction = StackActions.pop(2);
      props.navigation.dispatch(popAction);
      // props.navigation.navigate('Calender');
      // props.navigation.goBack();
    } else {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, props.navigation, isEditEventSuccess]);

  useEffect(() => {
    if (CreateEventError || editEventError) {
      console.log('break error:', editEventError?.data);

      const err: any = CreateEventError || editEventError;
      showToast(err?.data?.error[0]?.msg);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CreateEventError, editEventError]);

  const styles = Styles();

  const RenderPrivateToggle = () => {
    return (
      <Animated.View style={toggleBtnAnimation}>
        <StackItem
          horizontal
          style={styles.toggleWidth}
          horizontalAlign="space-between">
          <TextView
            animated
            weight="regular"
            variant={FontSizes.regular}
            style={[styles.toggle]}>
            {t('createEvent:markPrivate')}
          </TextView>
          <SwitchToggle
            switchOn={privateToggle}
            onPress={() => setPrivateToggle(prevState => !prevState)}
            circleColorOff={colors.white}
            circleColorOn={colors.primary}
            backgroundColorOn={colors.primary_005}
            backgroundColorOff={colors.grey_008}
            containerStyle={styles.switchContainer}
            circleStyle={styles.switchCircle}
          />
        </StackItem>
      </Animated.View>
    );
  };

  const toggleBtnAnimation = useAnimatedStyle(() => {
    const translateYVal = interpolate(
      translateY.value,
      [0, 60],
      [0, -35],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateY: translateYVal}],
    };
  });

  const RenderView = () => {
    return (
      <TextView
        weight="regular"
        variant={FontSizes.regular}
        style={styles.input}>
        {inviteeMembers?.length!} {t('createEvent:Participants')}
      </TextView>
    );
  };

  const RenderDropdownView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Stack horizontal verticalAlign="center">
          <Stack style={styles.view}>
            {timezoneValue ? (
              <TextView weight="regular" variant={FontSizes.medium} truncate>
                {timezoneValue}
              </TextView>
            ) : (
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={{color: colors.primary_003}}>
                {t('createEvent:dropdownPlaceholder')}
              </TextView>
            )}
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <Formik<EventFormModel>
      initialValues={InitialValues}
      validateOnMount
      enableReinitialize
      onSubmit={onSubmit}
      innerRef={formikRef}
      validationSchema={CreateEventSchema}>
      {({handleSubmit, setFieldValue, values, setValues}) => (
        <Container noSpacing>
          <Stack spaceBelow={10}>
            <Header
              navigationType="STACK"
              label={edit ? t('createEvent:edit') : t('createEvent:head')}
              translateY={translateY}
              labelVieStyle={styles.headerStyle}
              isCloseNavigation
              RenderPrivateToggle={RenderPrivateToggle}
              preventDefault
              onBackPress={() => {
                dispatch(setEventRecurrence(InitialEventRecurrence!));
                const popAction = StackActions.pop(1);
                props.navigation.dispatch(popAction);
              }}
            />
          </Stack>
          <Animated.ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            keyboardDismissMode="on-drag"
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView
              bounces={false}
              overScrollMode={'never'}
              nestedScrollEnabled>
              <TouchableWithoutFeedback
                onPress={() => setIsTimezoneOpen(false)}>
                <Stack spacing={16} spaceBelow={50}>
                  <FormikDropdownPicker
                    options={allCompanyData}
                    value={companyLabel}
                    name="companyId"
                    onSelect={val => {
                      // setCompanyValue(val.value);
                      setCompanyLabel(val.label);
                    }}
                    placeholder={t('addTask:companyDropdownPlaceholder')}
                  />
                  <View style={styles.bottom}>
                    <Stack horizontal horizontalAlign="space-between">
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('createEvent:subject')}
                      </TextView>
                    </Stack>
                  </View>
                  <View style={styles.bottom}>
                    <FormikTextField
                      name="subject"
                      placeholder={t('createEvent:subjectPlaceholder')}
                      maxLength={100}
                      onFocus={() => setIsTimezoneOpen(false)}
                    />
                  </View>
                  <View style={styles.bottom}>
                    <FormikTextField
                      name="description"
                      label={t('createEvent:description')}
                      placeholder={t('createEvent:description')}
                      multiline
                      numberOfLines={4}
                      maxLength={250}
                      onFocus={() => setIsTimezoneOpen(false)}
                      style={{height: globalScreenHeight / 8}}
                    />
                  </View>
                  <View style={styles.bottom}>
                    <Stack horizontal horizontalAlign="space-between">
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('createEvent:date')}
                      </TextView>
                    </Stack>
                  </View>
                  <View style={styles.bottom}>
                    <Stack horizontal center style={styles.dateView}>
                      <View style={styles.fieldView}>
                        <FormikDatePicker
                          isValidAge={true}
                          ageCheck={false}
                          edit={edit && fromDatePicked! ? true : false}
                          // value={edit ? fromDatePicked : ''}
                          name="startDate"
                          placeholder={
                            edit && fromDatePicked ? fromDatePicked : 'From'
                          }
                          value={fromDatePicked}
                          format={DateTimeFormats.MonthDateYear}
                          minimumDate={new Date()}
                          onHide={() => setIsTimezoneOpen(false)}
                          onPress={value => {
                            setValues(prevValues => ({
                              ...prevValues,
                              endDate: moment(value).format(
                                DateTimeFormats.YearMonthDay,
                              ),
                              startDate: moment(value).format(
                                DateTimeFormats.YearMonthDay,
                              ),
                              startTime: moment().format(DateTimeFormats.Time),
                              endTime: moment(value)
                                .add(15, 'm')
                                .format(DateTimeFormats.Time),
                            }));
                            setFromDatePicked(
                              moment(value).format(
                                DateTimeFormats.MonthDateYear,
                              ),
                            );
                            setStartDateUTCObject(
                              moment(value).format(
                                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                              ),
                            );
                            setStartDateSelected(true);
                            setToDatePicked(
                              moment(value).format(
                                DateTimeFormats.MonthDateYear,
                              ),
                            );
                            setEndDateUTCObject(
                              moment(value).format(
                                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                              ),
                            );
                            setStartTime(moment().format(DateTimeFormats.Time));
                            setEndTime(moment().format(DateTimeFormats.Time));
                            setEndTime(
                              moment(value)
                                .add(15, 'm')
                                .format(DateTimeFormats.Time),
                            );
                            setStartTimeUTCObject(
                              moment()
                                .utc()
                                .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'),
                            );
                            setEndTimeUTCObject(
                              moment(value).add(15, 'm').toISOString(),
                            );
                          }}
                        />
                      </View>
                      <View style={styles.fieldView}>
                        <FormikDatePicker
                          isValidAge={true}
                          ageCheck={false}
                          edit={edit && toDatePicked! ? true : false}
                          name="endDate"
                          isStartDateSelected={startDateSelected}
                          placeholder={
                            edit && toDatePicked ? toDatePicked : 'To'
                          }
                          value={toDatePicked}
                          format={DateTimeFormats.MonthDateYear}
                          minimumDate={
                            values.startDate !== ''
                              ? new Date(values.startDate)
                              : new Date()
                          }
                          // value={edit ? toDatePicked : ''}
                          onHide={() => setIsTimezoneOpen(false)}
                          onPress={value => {
                            setValues(prevState => ({
                              ...prevState,
                              endDate: moment(value).format(
                                DateTimeFormats.YearMonthDay,
                              ),
                              startTime: moment().format(DateTimeFormats.Time),
                              endTime: moment(value)
                                .add(15, 'm')
                                .format(DateTimeFormats.Time),
                            }));
                            setToDatePicked(
                              moment(value).format(
                                DateTimeFormats.MonthDateYear,
                              ),
                            );

                            setEndDateUTCObject(
                              moment(value).format(
                                'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
                              ),
                            );
                            setStartTime(moment().format(DateTimeFormats.Time));
                            setEndTimeUTCObject(
                              moment(value).add(15, 'm').toISOString(),
                            );
                          }}
                        />
                      </View>
                    </Stack>
                  </View>
                  <View
                    style={Platform.OS === 'ios' ? styles.timezone : undefined}>
                    <FormikTouchableField
                      name="timezone"
                      isDropdownOpen={isTimezoneOpen}
                      dropdownData={timezoneData?.data}
                      icon={'arrow_expand_more'}
                      RenderView={RenderDropdownView}
                      onPress={() => {
                        setIsTimezoneOpen(prevState => !prevState);
                      }}
                      onTimezoneSelect={value => {
                        setTimezoneValue(
                          value?.zoneName + ' ' + value?.gmtOffsetName,
                        );
                        setFieldValue('timezone', value?.zoneName);
                        setOffsetValue(value?.gmtOffsetName);
                        setIsTimezoneOpen(prevState => !prevState);
                      }}
                    />
                  </View>
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.invitedLabel}>
                    {t('createEvent:time')}
                  </TextView>
                  <Stack horizontal center style={styles.buttonView}>
                    <View style={styles.fieldView}>
                      <FormikDatePicker
                        name="startTime"
                        mode="time"
                        icon="time"
                        edit={edit && values.startTime ? true : false}
                        iconSize={22}
                        onHide={() => setIsTimezoneOpen(false)}
                        onPress={event => {
                          setStartTime(
                            moment(event).format(DateTimeFormats.Time),
                          );
                          setFieldValue(
                            'startTime',
                            moment(event).format(DateTimeFormats.Time),
                          );
                          setStartTimeUTCObject(moment(event).toISOString());
                          setEndTime(
                            moment(event)
                              .add(15, 'm')
                              .format(DateTimeFormats.Time),
                          );
                          setFieldValue(
                            'endTime',
                            moment(event)
                              .add(15, 'm')
                              .format(DateTimeFormats.Time),
                          );
                          setEndTimeUTCObject(
                            moment(event).add(15, 'm').toISOString(),
                          );
                        }}
                        value={startTime}
                        // isTimeNotRestricted
                        selectedDate={fromDatePicked}
                      />
                    </View>
                    <View style={styles.fieldView}>
                      <FormikDatePicker
                        name="endTime"
                        mode="time"
                        icon="time"
                        edit={edit && values.endTime ? true : false}
                        iconSize={22}
                        onHide={() => setIsTimezoneOpen(false)}
                        onPress={event => {
                          let end = moment(event).format(DateTimeFormats.Time);
                          let diff = moment(end, DateTimeFormats.Time).diff(
                            moment(startTime, DateTimeFormats.Time),
                            'minutes',
                          );
                          if (
                            // eslint-disable-next-line radix
                            (diff < 15 ||
                              moment(end, DateTimeFormats.Time) <
                                moment(startTime, DateTimeFormats.Time)) &&
                            moment(values.endDate).format(
                              DateTimeFormats.DayMonthYear,
                            ) ===
                              moment(values.startDate).format(
                                DateTimeFormats.DayMonthYear,
                              )
                          ) {
                            setEndTime(
                              moment(startTime, DateTimeFormats.Time)
                                .add(15, 'm')
                                .format(DateTimeFormats.Time),
                            );
                            setFieldValue(
                              'endTime',
                              moment(startTime, DateTimeFormats.Time)
                                .add(15, 'm')
                                .format(DateTimeFormats.Time),
                            );
                            setEndTimeUTCObject(
                              moment(startTime, DateTimeFormats.Time)
                                .add(15, 'm')
                                .toISOString(),
                            );
                            showToast(
                              'To time should be 15 min more than from time.',
                            );
                          } else {
                            //setStartTime(moment(event).format(DateTimeFormats.Time));
                            setEndTime(
                              moment(event).format(DateTimeFormats.Time),
                            );
                            setFieldValue(
                              'endTime',
                              moment(event).format(DateTimeFormats.Time),
                            );
                            setEndTimeUTCObject(moment(event).toISOString());
                          }
                        }}
                        value={endTime}
                        isTimeNotRestricted={
                          moment(values.endDate).format(
                            DateTimeFormats.DayMonthYear,
                          ) ===
                          moment(values.startDate).format(
                            DateTimeFormats.DayMonthYear,
                          )
                            ? moment().format(DateTimeFormats.DayMonthYear) !==
                              moment(values.startDate).format(
                                DateTimeFormats.DayMonthYear,
                              )
                              ? true
                              : false
                            : true
                        }
                      />
                    </View>
                  </Stack>
                  <View style={styles.bottom}>
                    <RepeatEvent
                      {...props}
                      values={values}
                      repeatEventEdit={repeateventEdit}
                      editCustomModalOpen={isEditCustom}
                    />
                  </View>
                  <View style={styles.bottom}>
                    <Reminder values={values} reminderEdit={reminderEdit} />
                  </View>
                  <View style={styles.bottom}>
                    <FormikTextField
                      name="venue"
                      label={t('createEvent:venue')}
                      placeholder={t('createEvent:venuePlaceholder')}
                      multiline
                      numberOfLines={2}
                      maxLength={250}
                      onFocus={() => setIsTimezoneOpen(false)}
                    />
                  </View>
                  <View>
                    <TouchableField
                      label={t('createEvent:invited')}
                      placeholder={
                        inviteeMembers?.length! > 0
                          ? undefined
                          : t('createEvent:inviteParticipants')
                      }
                      icon={'arrow_right'}
                      RenderView={RenderView}
                      onPress={() =>
                        props.navigation.navigate('InviteMember', {
                          edit: false,
                        })
                      }
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      style={styles.showParticipants}
                      onPress={() =>
                        props?.navigation?.navigate('ShowParticipants', {
                          selectedInviteeObj,
                        })
                      }>
                      <TextView weight="regular" variant={FontSizes.regular}>
                        {t('createEvent:showParticipants')}
                      </TextView>
                    </TouchableOpacity>
                  </View>
                </Stack>
              </TouchableWithoutFeedback>
              <Stack spacing={16} spaceBelow={16} style={styles.bottomSpace}>
                <PrimaryButton
                  title={t('save')}
                  onPress={() => {
                    if (
                      moment(values.startDate).format(
                        DateTimeFormats.DayMonthYear,
                      ) === moment().format(DateTimeFormats.DayMonthYear) &&
                      startTime! < moment().format(DateTimeFormats.Time)
                    ) {
                      showToast(
                        'Start time should not be less than current time.',
                      );
                    } else if (
                      values.startDate === values.endDate &&
                      values.startTime > values.endTime
                    ) {
                      showToast('End time should be greater then start time');
                    } else {
                      handleSubmit();
                    }
                  }}
                />
              </Stack>
            </KeyboardAwareScrollView>
          </Animated.ScrollView>
          {(isLoadingCreateTask || isEditEventLoading) && (
            <Loader message={edit ? 'Editing event...' : 'Creating event...'} />
          )}
          {(companyResponseLoading || loading) && <Loader />}
        </Container>
      )}
    </Formik>
  );
};
