import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {SectionHeader} from 'components/SectionHeader';
import {Stack, StackItem} from 'components/Stack';
import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useGetUserPerformanceDetailsMutation} from 'request/PerformanceReport';
import {ChartDetailReportScreen} from './components/Chart';
import {firstLetterCapital, progressType, ZoneType} from './constants';
import {Styles} from './index.styles';

export const DetailReportScreen = props => {
  const {userId, companyId} = props?.route?.params;
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [getDetails, {data: performanceData, isLoading}] =
    useGetUserPerformanceDetailsMutation();

  const {
    name,
    zone,
    PerformanceDetails,
    role,
    totalAssignedNumber,
    companyName,
  } = performanceData || {};

  useEffect(() => {
    if (userId) {
      let body = {
        userId,
        searchText: '',
        pageNo: 1,
        companyId: companyId,
      };
      getDetails(body);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header hideLabel navigationType="STACK" translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spaceBelow={100}>
          <Stack spacing={16} spaceBelow={16} style={styles.stack}>
            {zone === ZoneType.RED && (
              <StackItem
                childrenGap={8}
                spacing={16}
                horizontal
                verticalAlign="center">
                <LottieView
                  autoPlay
                  loop={true}
                  style={styles.lottieViewContainer}
                  source={require('../../assets/lottie/Redzone.json')}
                />
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.redZoneText}
                  truncate>
                  {`${name?.split(' ')[0]} ` + t('reports:redZone')}
                </TextView>
              </StackItem>
            )}
            <Stack spacing={16} horizontal horizontalAlign="space-between">
              <TextView weight="medium" variant={FontSizes.medium} truncate>
                {name}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.text}>
                {t('reports:totalAssigned')}
              </TextView>
            </Stack>
            <Stack spacing={16} horizontal horizontalAlign="space-between">
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.text}>
                {role && firstLetterCapital(role)}
              </TextView>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.number}>
                {totalAssignedNumber}
              </TextView>
            </Stack>
            <Stack spacing={16}>
              <TextView weight="regular" variant={FontSizes.xSmall} truncate>
                {companyName}
              </TextView>
            </Stack>
          </Stack>
          {userType === userTypes.Owner && (
            <Stack spacing={16} spaceBelow={16}>
              <SectionHeader title={t('performanceReport:progress')} />
            </Stack>
          )}
          <ChartDetailReportScreen PerformanceDetails={PerformanceDetails!} />
          <Stack spacing={16} spaceBelow={16}>
            <SectionHeader title={t('performanceReport:overallProgress')} />
          </Stack>
          <Stack spacing={16} spaceBelow={16}>
            {performanceData &&
              progressType.map(item => {
                return (
                  <>
                    <TextView weight="medium" variant={FontSizes.medium}>
                      {t(`performanceReport:${item?.type}`)}
                    </TextView>
                    <StackItem childrenGap={10} style={styles.stack}>
                      <Stack horizontal spacing={16} verticalAlign="center">
                        <TextView weight="regular" variant={FontSizes.regular}>
                          {t('performanceReport:totalAssigned')}:{' '}
                        </TextView>
                        <TextView weight="medium" variant={FontSizes.medium}>
                          {performanceData![item?.detailType]?.totalAssigned}
                        </TextView>
                      </Stack>
                      <Stack
                        horizontal
                        spacing={16}
                        verticalAlign="center"
                        horizontalAlign="space-between">
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}>
                            {t('performanceReport:completed')}:{' '}
                          </TextView>
                          <TextView
                            weight="medium"
                            variant={FontSizes.medium}
                            style={styles.completed}>
                            {performanceData[item?.detailType]?.completed}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.regular}
                            style={{color: colors.grey_008}}>
                            {' |'}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:onTime')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.blue_001}}>
                            {performanceData[item?.detailType]?.onTime}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:before')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.green_002}}>
                            {performanceData[item?.detailType]?.beforeTime}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:after')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.red_001}}>
                            {performanceData[item?.detailType]?.afterTime}
                          </TextView>
                        </Stack>
                      </Stack>
                      <Stack
                        horizontal
                        spacing={16}
                        verticalAlign="center"
                        horizontalAlign="space-between">
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:inProgress')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.inProgress}>
                            {performanceData[item?.detailType]?.inProgress}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:resolved')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.resolved}>
                            {performanceData[item?.detailType]?.resolved}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:reOpened')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.reOpened}>
                            {performanceData[item?.detailType]?.reopened}
                          </TextView>
                        </Stack>
                        <Stack horizontal verticalAlign="center">
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={{color: colors.primary_003}}>
                            {t('performanceReport:overdue')}:{' '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.overdue}>
                            {performanceData[item?.detailType]?.overDue}
                          </TextView>
                        </Stack>
                      </Stack>
                    </StackItem>
                  </>
                );
              })}
          </Stack>
        </Stack>
      </Animated.ScrollView>
      {isLoading && <Loader />}
    </Container>
  );
};
