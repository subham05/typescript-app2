import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useLazyEventDetailsQuery} from 'request/Calendar';
import {EventDetailData} from 'request/Calendar/constant';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'EventDetails'>;
export const EventDetailsScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {userData} = useAppSelector(state => state.formanagement);

  const allEvents = [
    {label: 'Does not repeat', value: 'DO_NOT_REPEAT'},
    {label: 'Every day', value: 'DAY'},
    {label: 'Every week', value: 'WEEK'},
    {label: 'Every month', value: 'MONTH'},
    {label: 'Every year', value: 'YEAR'},
    {label: 'Custom', value: 'CUSTOM'},
  ];

  const allReminders = [
    // {label: '5 minutes before', value: '5 minutes before'},
    {label: '15 minutes before', value: '15_MINUTES_BEFORE'},
    {label: '30 minutes before', value: '30_MINUTES_BEFORE'},
    {label: '1 hour before', value: '1_HOUR_BEFORE'},
    {label: '1 day before', value: '1_DAY_BEFORE'},
    // {label: 'Custom', value: 'CUSTOM'},
  ];

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [eventDetail, setEventDetail] = useState<EventDetailData | undefined>(
    undefined,
  );
  const {route} = {...props};
  const {eventId} = {...route.params};
  const [
    getEventDetail,
    {
      data: eventDetailData,
      isSuccess: isEventDetailSuccess,
      isLoading: isEventDetailLoading,
    },
  ] = useLazyEventDetailsQuery();

  console.log('Test');

  // useEffect(() => {
  //   if (eventId) {
  //     getEventDetail(eventId);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [eventId]);

  useFocusEffect(
    useCallback(() => {
      if (eventId) {
        getEventDetail(eventId);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]),
  );
  useEffect(() => {
    if (isEventDetailSuccess && eventDetailData) {
      const {data} = eventDetailData;
      setEventDetail(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEventDetailSuccess]);
  const menuData: MenuModel[] = [
    {
      name: t('edit'),
      onClick: () => {
        props.navigation.navigate('CreateEvent', {
          edit: true,
          eventId: eventId,
          eventData: eventDetail,
        });
      },
    },
    {
      name: t('delete'),
      onClick: () => {
        setDeleteModal(true);
      },
    },
  ];

  const renderLeftContainer = () => {
    return (
      <>
        {userData?._id === eventDetail?.userId && (
          <PopupMenu data={menuData} height={126} width={176} />
        )}
      </>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('homePage:eventDetails')}
        navigationType="STACK"
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        isCloseNavigation
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={Dimensions.get('screen').height / 25}>
          <StackItem>
            <>
              <TextView variant={FontSizes.regular} style={styles.label}>
                {t('createEvent:subject')}
              </TextView>
              <View style={styles.subjectView}>
                <ScrollView
                  horizontal={true}
                  nestedScrollEnabled
                  showsHorizontalScrollIndicator={false}>
                  <TextView style={styles.subjectText}>
                    {eventDetail?.subject || ''}
                  </TextView>
                </ScrollView>
              </View>
            </>
            <TextView variant={FontSizes.regular} style={styles.label}>
              {t('createEvent:description')}
            </TextView>
            <View
              style={[
                styles.descriptionView,
                // eslint-disable-next-line react-native/no-inline-styles
                {height: eventDetail?.description.length ? undefined : 50},
              ]}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}>
                <TextView style={styles.subjectText}>
                  {eventDetail?.description || ''}
                </TextView>
              </ScrollView>
            </View>
          </StackItem>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.label}>
            {t('createEvent:date')}
          </TextView>
          <Stack horizontal center style={styles.buttonView}>
            {/* <View style={styles.fieldView}>
              <DatePicker date="MM DD, YYYY" task />
            </View> */}
            <Stack style={styles.fieldView} horizontal verticalAlign="center">
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.inputDate}>
                {moment(eventDetail?.startDate).format(
                  DateTimeFormats.MonthDateYear,
                ) || ''}
              </TextView>
              <Icon
                name={'calendar'}
                size={18}
                color={colors.grey_003}
                style={styles.calendar}
              />
            </Stack>
            <Stack style={styles.fieldView} horizontal verticalAlign="center">
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.inputDate}>
                {moment(eventDetail?.endDateUTCObject).format(
                  DateTimeFormats.MonthDateYear,
                ) || 'MM DD, YYYY'}
              </TextView>
              <Icon
                name={'calendar'}
                size={18}
                color={colors.grey_003}
                style={styles.calendar}
              />
            </Stack>
          </Stack>
          {/* <DropdownPicker
            label={t('createEvent:timezone')}
            value={eventDetail?.timezone || ''}
            options={allTimezoneData}
            onChange={item => {
              setTimezoneValue(item.value);
            }}
            placeholder={t('createEvent:dropdownPlaceholder')}
            disabled
          /> */}
          <TextField
            label={t('createEvent:timezone')}
            onChangeText={() => {}}
            value={eventDetail?.timezone || ''}
            editable={false}
          />
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.label}>
            {t('createEvent:time')}
          </TextView>
          <Stack horizontal center style={styles.buttonView}>
            <Stack style={styles.fieldView} horizontal verticalAlign="center">
              {/* <DatePicker
                date="10:00 AM"
                mode="time"
                icon="time"
                iconSize={22}
              /> */}
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.inputDate}>
                {moment(eventDetail?.startDateUTCObject).format(
                  DateTimeFormats.TimeAMPM,
                ) || ''}
              </TextView>
              <Icon
                name={'time'}
                size={22}
                color={colors.grey_003}
                style={styles.calendar}
              />
            </Stack>
            <Stack style={styles.fieldView} horizontal verticalAlign="center">
              {/* <DatePicker
                date="10:00 AM"
                mode="time"
                icon="time"
                iconSize={22}
              /> */}
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.inputDate}>
                {moment(eventDetail?.endDateUTCObject).format(
                  DateTimeFormats.TimeAMPM,
                ) || ''}
              </TextView>
              <Icon
                name={'time'}
                size={22}
                color={colors.grey_003}
                style={styles.calendar}
              />
            </Stack>
          </Stack>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.label}>
            {t('createEvent:repeatEvent')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.medium}
            style={styles.input}>
            {/* {eventDetail?.repeatEvent || ''} */}
            {allEvents.map(item => {
              if (item.value === eventDetail?.repeatEvent) {
                return item.label;
              }
            })}
          </TextView>
          <StackItem childrenGap={16}>
            <>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.label}>
                {t('createEvent:reminder')}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.input}>
                {/* {eventDetail?.reminderType || ''} */}
                {allReminders.map(item => {
                  if (item.value === eventDetail?.reminderType) {
                    return item.label;
                  }
                })}
              </TextView>
            </>
            <TextField
              label={t('createEvent:venue')}
              onChangeText={() => {}}
              value={eventDetail?.venue || ''}
              editable={false}
              multiline
              numberOfLines={2}
            />
          </StackItem>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.label}>
            {t('createEvent:invited')}
          </TextView>
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('InviteMember', {
                disabled: true,
              })
            }>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.input}>
              {`${eventDetail?.inviteeDetails.length} ${t(
                'createEvent:Participants',
              )}` || ''}
            </TextView>
          </TouchableOpacity>
        </Stack>
      </Animated.ScrollView>
      {deleteModal && (
        <Modal isVisible={deleteModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('createEvent:alert')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setDeleteModal(false);
                  }}>
                  {t('delete')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {isEventDetailLoading && <Loader />}
    </Container>
  );
};
