import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import moment, {Moment} from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, View, ViewStyle} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useAddLeaveMutation,
  useGetAttendanceDetailMutation,
} from 'request/AttendanceReport';
import {
  attendanceReportData,
  dateNavFlags,
  leaveAddBody,
} from 'request/AttendanceReport/types';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {AttendanceReportList} from './components/AttendanceList';
import {Styles} from './index.styles';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {showToast} from 'common/utils/ToastMessage';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AttendanceReport'>;
export const AttendanceReportScreen = ({route}: Props) => {
  const {data, requestData} = route.params;

  const [attendanceReport, setAttendanceReport] = useState<
    attendanceReportData[]
  >([]);
  const [navFlags, setNavFlags] = useState<dateNavFlags>();
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const {userData} = useAppSelector(state => state.formanagement);

  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [selectedDate, setSelectedDate] = useState<Moment>(
    moment(requestData.date),
  );

  const [getAttendanceDetail, {data: detailData, isSuccess, isLoading}] =
    useGetAttendanceDetailMutation();

  const [
    applyLeave,
    {data: leaveData, isSuccess: isSuccessLeave, isLoading: isLoadingLeave},
  ] = useAddLeaveMutation();

  const reqBody = useMemo(() => {
    return {
      companyId: requestData.companyId,
      userId: data._id,
      year: moment(selectedDate).format(DateTimeFormats.year),
      month: moment(selectedDate).format(DateTimeFormats.longMonth),
    };
  }, [requestData, data._id, selectedDate]);

  const todayDate = useMemo(() => {
    return {
      date: detailData?.data.currentDate,
    };
  }, [detailData]);

  useEffect(() => {
    const isSelf = data._id !== userData?._id;
    setIsDisabled(isSelf);
  }, [data, userData]);

  useEffect(() => {
    getAttendanceDetail(reqBody);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqBody]);

  useEffect(() => {
    if (detailData && isSuccess) {
      setAttendanceReport(detailData.data.reportData);
      setNavFlags(detailData.data.navigationFlags);
    }
  }, [detailData, isSuccess]);

  const prevMonth = () => {
    var pastMonth = moment(selectedDate).subtract(1, 'M');
    setSelectedDate(pastMonth);
    setAttendanceReport([]);
  };
  const nextMonth = () => {
    var futureMonth = moment(selectedDate).add(1, 'M');
    setSelectedDate(futureMonth);
    setAttendanceReport([]);
  };

  const styles = Styles();

  const prevButton: StyleProp<ViewStyle> = {
    borderWidth: !navFlags?.previous ? 0 : 2,
    borderRadius: 10,
    overflow: 'hidden',
  };

  const nextButton: StyleProp<ViewStyle> = {
    borderWidth: !navFlags?.next ? 0 : 2,
    borderRadius: 10,
    overflow: 'hidden',
  };

  const onLeaveApply = (date: string) => {
    const convertFormat = new Date(date);
    const bodyObj: leaveAddBody = {
      companyId: requestData.companyId[0],
      date: convertFormat.toISOString(),
      reason: '',
      type: '',
    };
    applyLeave(bodyObj);
  };

  useEffect(() => {
    if (leaveData && isSuccessLeave) {
      showToast(leaveData.message);
    }
  }, [isSuccessLeave, leaveData]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('attendance:report')}
        translateY={translateY}
      />
      {(isLoading || isLoadingLeave) && <Loader />}

      <Stack
        spacing={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.head}
        center>
        <Stack center style={[styles.icon, prevButton]}>
          {navFlags?.previous && (
            <IconButton
              name="arrow_left"
              size={16}
              color={colors.black}
              onPress={prevMonth}
            />
          )}
        </Stack>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={{color: colors.primary_002}}>
          {moment(selectedDate)
            .subtract(1, 'M')
            .format(DateTimeFormats.shortMonth)}
        </TextView>
        <TextView weight="medium" variant={FontSizes.xMedium}>
          {moment(selectedDate).format(DateTimeFormats.monthYear)}
        </TextView>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={{color: colors.primary_002}}>
          {moment(selectedDate).add(1, 'M').format(DateTimeFormats.shortMonth)}
        </TextView>
        <Stack center style={[styles.icon, nextButton]}>
          {navFlags?.next && (
            <IconButton
              name="arrow_right"
              size={16}
              color={colors.black}
              onPress={nextMonth}
            />
          )}
        </Stack>
      </Stack>
      <Stack
        spacing={16}
        spaceBelow={10}
        horizontal
        horizontalAlign="space-between"
        center
        style={styles.column}>
        <TextView weight="medium" variant={FontSizes.regular}>
          {t('attendance:date')}
        </TextView>
        <View style={styles.line} />
        <TextView weight="medium" variant={FontSizes.regular}>
          {t('attendance:checkIn')}
        </TextView>
        <View style={styles.line} />
        <TextView weight="medium" variant={FontSizes.regular}>
          {t('attendance:checkOut')}
        </TextView>
        <View style={styles.line} />
        <TextView weight="medium" variant={FontSizes.regular}>
          {t('attendance:workingHours')}
        </TextView>
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <AttendanceReportList
          data={attendanceReport}
          currentDate={todayDate}
          isDisabled={isDisabled}
          isLoading={isLoading}
          scrollHandler={scrollHandler}
          onLeaveApply={onLeaveApply}
          selectedDate={selectedDate}
        />
      </Stack>
    </Container>
  );
};
