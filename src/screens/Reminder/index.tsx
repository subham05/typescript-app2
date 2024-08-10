import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import Header from 'components/Header';
import {RippleIconButton} from 'components/IconButtons';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
// import {Persona} from 'components/Persona';
import {SearchTextField, TextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
// import SwitchToggle from 'react-native-switch-toggle';
import {Stack} from 'stack-container';
import {ReminderComponent} from './components/Reminder';
// import {ReminderRepeatEvent} from './components/RepeatEvent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {showToast} from 'common/utils/ToastMessage';
import Loader from 'components/Loader';
import moment from 'moment';
import {AssignToUsers} from 'request/AddTask';
import {
  NodeRemindTo,
  useGetRemindToListMutation,
  useSetReminderMutation,
} from 'request/Calendar';
import {useAppSelector} from 'store/hooks';
import {ReminderStrings} from './constants';

// const userImage =
//   'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

type Props = NativeStackScreenProps<SignedInStackParamList, 'Reminder'>;

export const ReminderScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {route} = {...props};
  const {voiceNotes, taskData, fromCalendar, voiceNoteData} = {
    ...route.params,
  };

  const {companyId} = useAppSelector(state => state?.formanagement);
  const [remindToList, setRemindToList] = useState<NodeRemindTo[]>([]);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [reminderFor, setReminderFor] = useState<string>('');
  const [errorReminderFor, setErrorReminderFor] = useState(false);
  const [remindTo, setRemindTo] = useState<AssignToUsers>();
  const [remindToModal, setRemindToModal] = useState<boolean>(false);
  const [reminderType, setReminderType] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    `${moment(new Date()).format(DateTimeFormats.MonthDateYear)}`,
  );
  // const [selectedDate, setSelectedDate] = useState<string>(
  //   `${moment(new Date(taskData?.dueDateObject!)).format(
  //     DateTimeFormats.MonthDateYear,
  //   )}`,
  // );
  const [date, setDate] = useState<string>(moment().format());
  const [time, setTime] = useState<string>(moment().format());
  const [selectedTime, setSelectedTime] = useState<string>(
    moment().format(DateTimeFormats.Time),
  );
  const [customRemiderFor, setCustomreminderFor] = useState<string>('');
  const [customReminderValue, setCustomReminderValue] = useState<number>(0);
  const [errMsgState, setErrMsgState] = useState('');
  const [userId, setUserId] = useState<string>('');
  const [notifyType, setNotifyType] = useState<string>(
    ReminderStrings.asNotification,
  );
  const [
    setReminder,
    {
      data: reminderData,
      isSuccess: isReminderSuccess,
      isLoading: isReminderLoading,
    },
  ] = useSetReminderMutation();

  const [
    getRemindToList,
    {data: remindToData, isSuccess: isReminderToSuccess},
  ] = useGetRemindToListMutation();

  useEffect(() => {
    if (fromCalendar) {
      const requestObj = {
        companyId: companyId?.map(({_id}) => _id),
        searchText: searchText,
        pageNo: pageNo,
      };
      getRemindToList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCalendar, searchText, pageNo]);

  useEffect(() => {
    if (isReminderToSuccess && remindToData?.data?.nodes?.length) {
      setRemindToList(prev => prev.concat(remindToData?.data?.nodes));
    }
  }, [isReminderToSuccess, remindToData]);

  useEffect(() => {
    setPageNo(1);
    setRemindToList([]);
  }, [searchText]);

  useEffect(() => {
    taskData && setRemindTo(taskData?.assignee);
    AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(res =>
      setUserId(JSON.parse(res!)?._id),
    );
  }, [taskData]);

  const onPressRemindTo = val => {
    setRemindTo(val);
    setRemindToModal(false);
  };
  useEffect(() => {
    if (reminderData && isReminderSuccess) {
      showToast(reminderData.message);
      props.navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReminderSuccess]);
  const RenderRemindToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {/* {selfAssigned ? (
          <Stack horizontal verticalAlign="center">
            <Persona name={'Leslie Alexander'} image={userImage} size={38} />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                Self
              </TextView>
            </Stack>
          </Stack>
        ) : ( */}
        <MemberItem
          item={remindTo}
          onPress={() => {
            !taskData && setRemindToModal(true);
          }}
          isDividerFalse
          disabled
        />
        {/* )} */}
      </Stack>
    );
  };
  const convertDueDateUTC = () => {
    let startDatePostFix = date?.split('T')[0];
    let startTimeFix = time?.split('T')[1];
    let finalDate = startDatePostFix + 'T' + startTimeFix;
    return finalDate;
  };

  const checkValidTime = (reminderTypeTime: number, startTime: string) => {
    const val = convertDueDateUTC();
    if (
      moment().format(DateTimeFormats.YearMonthDay) ===
      moment(val).format(DateTimeFormats.YearMonthDay)
    ) {
      const minHr = reminderTypeTime > 1 ? 'minutes' : 'hours';
      const selectedTimeValid = moment(startTime)
        .subtract(reminderTypeTime, minHr)
        .format(DateTimeFormats.Time);
      if (selectedTimeValid < moment().format(DateTimeFormats.Time)) {
        showToast(t('taskDetails:reminderPastError'));
        return false;
      }
    }
    return true;
  };

  const reminderTypeExtract = () => {
    return +reminderType.split('_')[0];
  };

  const onSave = () => {
    let val = reminderTypeExtract();
    let booleanCheck = checkValidTime(val, convertDueDateUTC());
    if (reminderFor?.trim().length === 0) {
      setErrorReminderFor(true);
      return;
    }
    if (booleanCheck) {
      const obj = {
        userId: userId,
        companyId: companyId.map(ids => ids._id),
        startDate: moment(date).format(DateTimeFormats.YearMonthDay),
        startTime: selectedTime,
        startDateUTCObject: convertDueDateUTC(),
        reminderType: reminderType,
        reminderObject: {
          reminderFor: reminderFor.trim(),
          remindTo: voiceNotes ? [userId] : [remindTo?._id],
          type: voiceNotes
            ? ReminderStrings.voiceNote
            : fromCalendar
            ? ReminderStrings.event
            : ReminderStrings.task,
          notificationType:
            notifyType === ReminderStrings.asMail
              ? ReminderStrings.email
              : ReminderStrings.push,
          reminderType: reminderType,
          customReminderType:
            reminderType === ReminderStrings.custom
              ? customRemiderFor
              : ReminderStrings.null,
          reminderValue:
            reminderType === ReminderStrings.custom ? customReminderValue : 0,
          documentId: voiceNotes ? voiceNoteData : taskData?._id,
          documentCollection: voiceNotes
            ? ReminderStrings.voiceNotes
            : fromCalendar
            ? ReminderStrings.events
            : ReminderStrings.tasks,
        },
        type: ReminderStrings.reminder,
      };
      setReminder(obj);
    }
  };

  return (
    <Container noSpacing>
      <Stack spaceBelow={10}>
        <Header
          navigationType="STACK"
          label={t('taskDetails:reminder')}
          translateY={translateY}
        />
      </Stack>
      <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
        <Stack childrenGap={16} spacing={16}>
          <TextField
            label={t('taskDetails:reminderFor')}
            placeholder={t('taskDetails:reminderFor')}
            onChangeText={text => {
              setReminderFor(text);
              setErrorReminderFor(text?.trim()?.length === 0);
            }}
            value={reminderFor}
            maxLength={50}
            removeIcon
            containerStyles={{
              borderColor: errorReminderFor ? colors?.red : colors?.white,
            }}
          />
          {errorReminderFor && (
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.error}>
              {t('taskDetails:remindToError')}
            </TextView>
          )}
          <TouchableField
            label={t('taskDetails:remindTo')}
            icon={'arrow_expand_more'}
            RenderView={RenderRemindToView}
            disabled={!fromCalendar}
            disabledNoBackground={!fromCalendar}
            onPress={() => {
              if (!taskData) {
                setRemindToModal(true);
              }
            }}
            placeholder={
              voiceNotes
                ? t('taskDetails:self')
                : remindTo?._id?.length
                ? undefined
                : t('addTask:assigneePlaceholder')
            }
          />
          <Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              style={styles.forAllDay}>
              {/* {voiceNotes ? (
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.toggle}>
                  {t('createEvent:forOneTime')}
                </TextView>
              ) : // <TextView
              //   weight="regular"
              //   variant={FontSizes.regular}
              //   style={styles.toggle}>
              //   {t('createEvent:allDay')}
              // </TextView>
              null} */}
              {/* {!voiceNotes && (
                  <SwitchToggle
                    switchOn={allDay}
                    onPress={() => setAllDay(prevState => !prevState)}
                    circleColorOff={colors.white}
                    circleColorOn={colors.primary}
                    backgroundColorOn={colors.primary_005}
                    backgroundColorOff={colors.grey_008}
                    containerStyle={styles.switchContainer}
                    circleStyle={styles.switchCircle}
                  />
                )} */}
            </Stack>

            {/* {!allDay ? ( */}
            <Stack horizontal center style={styles.buttonView}>
              <View style={styles.fieldView}>
                <DatePicker
                  label={t('taskDetails:date')}
                  placeholder={DateTimeFormats.ShortMonthDateYear}
                  format={DateTimeFormats.MonthDateYear}
                  minimumDate={new Date()}
                  // maximumDate={new Date(taskData?.dueDateObject!)}
                  value={selectedDate}
                  mode={'date'}
                  isPlaceholderBlack
                  onDateSelected={value => {
                    setSelectedDate(
                      moment(value).format(DateTimeFormats.MonthDateYear),
                    );
                    setDate(moment(value).format());
                  }}
                  isValidAge
                  ageCheck={false}
                  isFormat
                />
              </View>
              <View style={styles.fieldView}>
                <DatePicker
                  label={t('taskDetails:time')}
                  mode={'time'}
                  icon="time"
                  iconSize={22}
                  // minimumDate={new Date()}
                  isPlaceholderBlack
                  value={selectedTime}
                  onDateSelected={value => {
                    setSelectedTime(moment(value).format(DateTimeFormats.Time));
                    setTime(moment(value).format());
                  }}
                  isValidAge
                  ageCheck={false}
                />
              </View>
            </Stack>
            {/* ) : (
                <Stack>
                  <DatePicker
                    placeholder={DateTimeFormats.ShortMonthDateYear}
                    format={DateTimeFormats.MonthDateYear}
                    minimumDate={new Date()}
                  />
                </Stack>
              )} */}
          </Stack>
          {/* {!voiceNotes && ( */}
          <Stack
          // style={styles.topMargin}
          >
            {/* <ReminderRepeatEvent {...props} />s */}
            <ReminderComponent
              onReminderSelect={value => {
                setErrMsgState('');
                setReminderType(value);
              }}
              onSaveCustom={(beforeValue, count, optionValue, errMsg) => {
                setErrMsgState(errMsg!);
                setCustomReminderValue(count!);
                setCustomreminderFor(beforeValue!);
                setNotifyType(optionValue!);
              }}
            />
          </Stack>
          {/* )} */}
        </Stack>
      </KeyboardAwareScrollView>
      <Stack spacing={16} spaceBelow={16}>
        {!voiceNotes ? (
          <PrimaryButton
            title={t('save')}
            disabled={
              !reminderType ||
              (reminderType === ReminderStrings.custom &&
                !customReminderValue) ||
              errMsgState?.length > 0 ||
              !reminderFor.length ||
              errorReminderFor ||
              (fromCalendar && !remindTo?.name)
            }
            onPress={() => {
              // if (moment(selectedDate) <= moment()) {
              //   showToast('Date should not be less than current date.');
              // } else
              if (
                reminderType === ReminderStrings.custom &&
                !customReminderValue &&
                errMsgState?.length
              ) {
                showToast(t('taskDetails:provideValidValuesAlert'));
                return;
              }
              if (!reminderFor.length) {
                showToast(t('taskDetails:reminderForRequired'));
                return;
              }
              if (
                moment(selectedDate, DateTimeFormats.MonthDateYear).format(
                  DateTimeFormats.MonthDateYear,
                ) === moment().format(DateTimeFormats.MonthDateYear) &&
                selectedTime! < moment().format(DateTimeFormats.Time)
              ) {
                showToast(t('taskDetails:timeError'));
              } else {
                onSave();
              }
            }}
          />
        ) : (
          <PrimaryButton
            title={t('createEvent:setReminder')}
            onPress={() => {
              if (
                reminderType === 'CUSTOM' &&
                !customReminderValue &&
                errMsgState?.length
              ) {
                showToast(t('taskDetails:provideValidValuesAlert'));
                return;
              }
              if (!reminderFor.length) {
                showToast(t('taskDetails:reminderForRequired'));
                return;
              }
              if (
                moment(selectedDate, DateTimeFormats.MonthDateYear).format(
                  DateTimeFormats.MonthDateYear,
                ) === moment().format(DateTimeFormats.MonthDateYear) &&
                selectedTime! < moment().format(DateTimeFormats.Time)
              ) {
                showToast(t('taskDetails:timeError'));
              } else {
                onSave();
              }
            }}
          />
        )}
      </Stack>
      {remindToModal && (
        <Modal
          avoidKeyboard
          isVisible={remindToModal}
          style={styles.bottomModal}
          onBackdropPress={() => setRemindToModal(false)}>
          <View style={styles.bottomModalView}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              spacing={16}>
              <Stack>
                <TextView weight="bold" variant={FontSizes.large}>
                  {t('taskDetails:remindTo')}
                </TextView>
              </Stack>
              <RippleIconButton
                name="close"
                size={22}
                onPress={() => setRemindToModal(false)}
              />
            </Stack>
            <Stack spacing={16} style={styles.attachmentView}>
              <SearchTextField
                showBorder
                setSearchValue={val => {
                  // if (val?.length) {
                  setSearchText(val.trim());
                  // setPageNo(1);
                  // setRemindToList([]);
                  // }
                }}
              />
            </Stack>
            {/* <ScrollView> */}
            <Stack spacing={16} style={styles.padding}>
              <MemberList
                data={remindToList}
                onPress={val => onPressRemindTo(val as membersProps)}
                onPressSelf={val => {
                  // setSelfAssigned(true);
                  onPressRemindTo(val as membersProps);
                  setRemindToModal(false);
                }}
                reminder
                onNextPage={() => {
                  if (
                    fromCalendar &&
                    remindToData?.data?.pageInfo?.hasNextPage
                  ) {
                    setPageNo(prev => prev + 1);
                  }
                }}
              />
            </Stack>
            {/* </ScrollView> */}
          </View>
        </Modal>
      )}
      {isReminderLoading && <Loader />}
    </Container>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.primary_003,
    marginBottom: 5,
  },
  toggle: {color: colors.primary_003},
  switchContainer: {
    width: 31,
    height: 20,
    borderRadius: 15,
  },
  switchContainerOff: {
    width: 31,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.black,
  },
  switchCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  buttonView: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  fieldView: {
    width: Dimensions.get('screen').width / 2.3,
    borderRadius: 3,
  },
  forAllDay: {
    marginBottom: 5,
  },
  bottomModalView: {
    backgroundColor: 'white',
    paddingTop: 15,
    maxHeight: '60%',
    height: Platform.OS === 'ios' ? '45%' : undefined,
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  attachmentView: {
    marginBottom: 16,
    marginTop: 16,
    // width: '90%',
  },
  topMargin: {marginTop: -20},
  view: {
    marginLeft: 10,
    marginTop: 5,
  },
  error: {
    fontSize: FontSizes.small,
    color: colors.red_002,
    marginTop: -10,
  },
  padding: {paddingBottom: 40},
});
