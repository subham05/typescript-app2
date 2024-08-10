import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {getLocation} from 'common/utils/getLocation';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkLocationPermission,
  getLocationPermission,
} from 'common/utils/permission/ReadLocation';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import DeleteModal from 'components/DeleteModal';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Ripple from 'react-native-material-ripple';
import {useSharedValue} from 'react-native-reanimated';
import {
  CheckInBodyObj,
  useCheckInMutation,
  useLazyCheckOutQuery,
  useLazyViewAttendanceQuery,
} from 'request/MarkAttendance';
import {AttendanceCircle} from './components/Circle';
import {Styles} from './index.styles';

export const MarkAttendanceScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const [currentTime, setCurrentTime] = useState<string>();
  const [timeSuffix, setTimeSuffix] = useState<string>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [checkInTime, setCheckInTime] = useState<string>();
  const [checkOutTime, setCheckOutTime] = useState<string>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [totalDuration, setTotalDuration] = useState<string>('- - -');
  const [currentStatus, setCurrentStatus] = useState<boolean>(false);
  const [latLong, setLatLong] = useState<CheckInBodyObj>();

  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [isLocationPermission, setIsLocationPermission] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [viewAttendance, {isLoading: viewAttendLoading}] =
    useLazyViewAttendanceQuery();
  const [checkIn, {isSuccess, data: checkInData, isLoading: checkInLoading}] =
    useCheckInMutation();
  const [checkOut, {isLoading: checkOutLoading}] = useLazyCheckOutQuery();

  useEffect(() => {
    viewAttendance().then(({data}) => {
      if (!data?.success) {
        setCurrentStatus(false);
      } else if (data.data) {
        if (data.data.checkOut) {
          setCheckOutTime(moment(data.data.checkOut).format('HH:mm'));
          setCheckInTime(moment(data.data.checkIn).format('HH:mm'));
          setTotalDuration(data.data.workingHours);
          setCurrentStatus(false);
        } else {
          setCurrentStatus(true);
          setCheckInTime(moment(data.data.checkIn).format('HH:mm'));
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCurrentTime(moment().format('hh:mm:ss'));
    setTimeSuffix(moment().format('A'));
    setCurrentDate(moment().format('dddd, MMMM DD'));
    let secTimer = setInterval(() => {
      setCurrentTime(moment().format('hh:mm:ss'));
      setTimeSuffix(moment().format('A'));
      setCurrentDate(moment().format('dddd, MMMM DD'));
    }, 1000);
    return () => clearInterval(secTimer);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    takeLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setCheckInTime(moment(checkInData?.data.checkIn).format('HH:mm'));
      setCurrentStatus(true);
    }
  }, [checkInData, isSuccess]);

  const takeLocationPermission = () => {
    checkLocationPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getLocationPermission().then(resp => {
            if (resp.isPermissionGranted) {
              setIsLocationPermission(true);
              getLocationDetails();
            } else {
              setIsLocationPermission(false);
              setIsLoading(false);
              AlertPermission(t('permissions:location'));
            }
          });
        } else if (res.result === 'blocked') {
          setIsLocationPermission(false);
          setIsLoading(false);
          AlertPermission(t('permissions:location'));
        }
      } else {
        setIsLocationPermission(true);
        getLocationDetails();
      }
    });
  };

  const getLocationDetails = () => {
    getLocation()
      .then((res: any) => {
        if (res) {
          setLatLong({
            latitude: res.location.lat,
            longitude: res.location.lng,
            checkInLocation: res.formatted_address,
          });
          setCurrentLocation(res.formatted_address);
          setIsLoading(false);
        }
      })
      .catch(() => {
        setIsLoading(false);
      });
  };

  const checkInUser = () => {
    if (isLocationPermission) {
      if (latLong) {
        checkIn(latLong);
      } else {
        showToast('Could not fetch location');
      }
    } else {
      takeLocationPermission();
    }
  };

  const checkOutUser = () => {
    if (isLocationPermission) {
      getLocation().then((res: any) => {
        checkOut({checkOutLocation: res.formatted_address}).then(({data}) => {
          if (data) {
            setCheckOutTime(moment(data.data.checkOut).format('HH:mm'));
            setTotalDuration(data.data.workingHours);
            setCurrentStatus(false);
          }
        });
      });
    } else {
      takeLocationPermission();
    }
  };

  const renderMainContainer = () => {
    return (
      <StackItem childrenGap={5} horizontal verticalAlign="center">
        <Icon name="location" size={22} color={colors.black} />
        <TextView
          weight="regular"
          variant={FontSizes.medium}
          numberOfLines={1}
          style={styles.location}>
          {currentLocation}
        </TextView>
      </StackItem>
    );
  };

  const styles = Styles();

  if (viewAttendLoading || checkInLoading || checkOutLoading || isLoading) {
    return <Loader />;
  }

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <DeleteModal
        setReopenModal={setOpenModal}
        Title={
          currentStatus
            ? t('attendance:confirmCheckOut')
            : t('attendance:confirmCheckIn')
        }
        reopenModal={openModal}
        onDeleteClick={() => {
          if (currentStatus) {
            checkOutUser();
          } else {
            checkInUser();
          }
          // setCurrentStatus(!currentStatus);
        }}
      />
      <Stack spacing={20} spaceBelow={16}>
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {t('attendance:markAttendance')}
        </TextView>
      </Stack>
      <Stack spacing={16} spaceBelow={16} style={styles.positionView}>
        <StackItem childrenGap={50} center style={styles.view}>
          <Stack center>
            <StackItem childrenGap={10} horizontal verticalAlign="center">
              <TextView weight="medium" variant={FontSizes.mediumHeader}>
                {currentTime}
              </TextView>
              <TextView weight="regular" variant={FontSizes.xlarge}>
                {timeSuffix}
              </TextView>
            </StackItem>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.dateColor}>
              {currentDate}
            </TextView>
          </Stack>
          <Ripple
            onPress={() => {
              if (!checkInTime || !checkOutTime) {
                setOpenModal(!openModal);
              }
            }}
            rippleColor={colors.white}>
            <AttendanceCircle
              checkIn={checkInTime}
              checkOut={checkOutTime}
              currentStatus={currentStatus}
            />
          </Ripple>
        </StackItem>
        <StackItem
          spacing={16}
          horizontal
          horizontalAlign="space-between"
          style={styles.bottomView}>
          <StackItem childrenGap={5} center style={styles.bottomTimeView}>
            <Icon name="check_in" size={22} color={colors.primary_002} />
            <TextView weight="medium" variant={FontSizes.medium}>
              {checkInTime ? checkInTime : '- - -'}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={{color: colors.primary_003}}>
              {t('attendance:checkIn')}
            </TextView>
          </StackItem>
          <StackItem childrenGap={5} center style={styles.bottomTimeView}>
            <Icon name="check_out" size={22} color={colors.primary_002} />
            <TextView weight="medium" variant={FontSizes.medium}>
              {checkOutTime ? checkOutTime : '- - -'}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={{color: colors.primary_003}}>
              {t('attendance:checkOut')}
            </TextView>
          </StackItem>
          <StackItem childrenGap={5} center style={styles.bottomTimeView}>
            <Icon name="check_circle" size={22} color={colors.primary_002} />
            <TextView weight="medium" variant={FontSizes.medium}>
              {totalDuration}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={{color: colors.primary_003}}>
              {t('attendance:workingHours')}
            </TextView>
          </StackItem>
        </StackItem>
      </Stack>
      {/* </Animated.ScrollView> */}
    </Container>
  );
};
