import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Ripple from 'react-native-material-ripple';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {AttendanceCircle} from './components/Circle';
import {Styles} from './index.styles';

export const TempMarkAttendanceScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [currentTime, setCurrentTime] = useState<string>();
  const [currentTime2, setCurrentTime2] = useState<string>();
  const [currentDate, setCurrentDate] = useState<string>();
  const [checkInTime, setCheckInTime] = useState<string>();
  const [checkOutTime, setCheckOutTime] = useState<string>();

  useEffect(() => {
    setCurrentTime(moment().format('hh:mm:ss'));
    setCurrentTime2(moment().format('A'));
    setCurrentDate(moment().format('dddd, MMMM DD'));
    setInterval(() => {
      setCurrentTime(moment().format('hh:mm:ss'));
      setCurrentTime2(moment().format('A'));
      setCurrentDate(moment().format('dddd, MMMM DD'));
    }, 1000);
  }, []);

  const renderMainContainer = () => {
    return (
      <StackItem childrenGap={5} horizontal verticalAlign="center">
        <Icon name="location" size={22} color={colors.black} />
        <TextView
          weight="regular"
          variant={FontSizes.medium}
          numberOfLines={1}
          style={styles.location}>
          Icon tower, Baner, Pune
        </TextView>
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        // label={t('accountPage:markAttendance')}
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <TextView weight="semibold" variant={FontSizes.xlarge}>
            {t('attendance:markAttendance')}
          </TextView>
          <StackItem childrenGap={45} center style={styles.view}>
            <Stack center>
              <StackItem childrenGap={10} horizontal verticalAlign="center">
                <TextView weight="medium" variant={FontSizes.mediumHeader}>
                  {currentTime}
                </TextView>
                <TextView weight="regular" variant={FontSizes.xlarge}>
                  {currentTime2}
                </TextView>
              </StackItem>
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={{color: colors.primary_003}}>
                {currentDate}
              </TextView>
            </Stack>
            <Ripple
              onPress={() => {
                if (checkInTime) {
                  setCheckOutTime(moment().format('h:mm'));
                } else {
                  setCheckInTime(moment().format('h:mm'));
                }
              }}
              rippleColor={colors.white}>
              <AttendanceCircle checkIn={checkInTime} checkOut={checkOutTime} />
            </Ripple>
          </StackItem>
          <StackItem
            spacing={16}
            childrenGap={0}
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
                - - -
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
      </Animated.ScrollView>
    </Container>
  );
};
