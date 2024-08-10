import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Stack} from 'stack-container';
import {PointsEarnedStyles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'PointsEarned'>;
export const PointsEarnedScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const {data} = {
  //   ...route.params,
  // };

  const percentage = 77;

  const styles = PointsEarnedStyles;
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('pointsEarned:head')}
        translateY={translateY}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack childrenGap={26} spacing={16} spaceBelow={16}>
          <Stack childrenGap={10}>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('pointsEarned:totalEmails')} : 198
            </TextView>
            <Stack horizontal horizontalAlign="space-between">
              <Stack childrenGap={5}>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('pointsEarned:emailsReceived')}
                </TextView>
                <Stack style={styles.emails}>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    120
                  </TextView>
                </Stack>
              </Stack>
              <Stack childrenGap={5}>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('pointsEarned:emailsSent')}
                </TextView>
                <Stack style={styles.emails}>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    78
                  </TextView>
                </Stack>
              </Stack>
              <Stack childrenGap={5}>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('pointsEarned:ratio')}
                </TextView>
                <Stack style={styles.emails}>
                  <TextView weight="medium" variant={FontSizes.medium}>
                    20:10
                  </TextView>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack childrenGap={10}>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('pointsEarned:taskCompletion')}
            </TextView>
            <Stack childrenGap={10} style={styles.container}>
              <Stack horizontal>
                <TextView weight="medium" variant={FontSizes.medium}>
                  {t('reports:totalAssigned')} :{' '}
                </TextView>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.totalAssigned}>
                  10
                </TextView>
              </Stack>
              <Stack horizontal>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('reports:completed')} :{' '}
                </TextView>
                <TextView weight="regular" variant={FontSizes.regular}>
                  5
                </TextView>
              </Stack>
              <Stack childrenGap={16} horizontal>
                <Stack horizontal verticalAlign="center">
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.primary_003}}>
                    {t('performanceReport:onTime')}:{' '}
                  </TextView>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.blue_001}}>
                    1
                  </TextView>
                </Stack>
                <Stack horizontal verticalAlign="center">
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.primary_003}}>
                    {t('performanceReport:before')}:{' '}
                  </TextView>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.green_002}}>
                    1
                  </TextView>
                </Stack>
                <Stack horizontal verticalAlign="center">
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.primary_003}}>
                    {t('performanceReport:after')}:{' '}
                  </TextView>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={{color: colors.red_001}}>
                    1
                  </TextView>
                </Stack>
              </Stack>
              <View style={styles.bottom} />
            </Stack>
          </Stack>
          <Stack childrenGap={10}>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('pointsEarned:finalResult')}
            </TextView>
            <Stack center>
              <CircularProgress
                value={percentage}
                radius={80}
                activeStrokeColor={
                  percentage <= 100 && percentage > 80
                    ? colors.primary
                    : percentage <= 80 && percentage > 70
                    ? colors.primary_002
                    : percentage <= 70 && percentage > 60
                    ? colors.yellow
                    : percentage <= 60 && percentage > 50
                    ? colors.yellow
                    : colors.orange_001
                }
                inActiveStrokeColor={colors.grey_002}
                inActiveStrokeOpacity={0.2}
                progressValueColor={colors.black}
                // valueSuffix={'%'}
                inActiveStrokeWidth={20}
                activeStrokeWidth={20}
                showProgressValue={false}
                subtitle={percentage + '%'}
                subtitleColor={colors.black}
                subtitleFontSize={FontSizes.xlarge}
                subtitleStyle={{fontFamily: AppFonts.semibold}}
              />
            </Stack>
          </Stack>
          <Stack childrenGap={10}>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('pointsEarned:definition')}
            </TextView>
            <Stack childrenGap={15}>
              <TextView weight="regular" variant={FontSizes.regular}>
                80 -100 % : {t('pointsEarned:excellent')}
              </TextView>
              <TextView weight="regular" variant={FontSizes.regular}>
                70 -80 % : {t('pointsEarned:good')}
              </TextView>
              <TextView weight="regular" variant={FontSizes.regular}>
                60 -70 % : {t('pointsEarned:satisfactory')}
              </TextView>
              <TextView weight="regular" variant={FontSizes.regular}>
                50 -60 % : {t('pointsEarned:average')}
              </TextView>
              <TextView weight="regular" variant={FontSizes.regular}>
                upto 50 % : {t('pointsEarned:belowAverage')}
              </TextView>
            </Stack>
          </Stack>
        </Stack>
      </Animated.ScrollView>
      <Stack spacing={16} spaceBelow={16}>
        <PrimaryButton
          title={t('pointsEarned:button')}
          onPress={() => {
            navigation.navigate('DetailPerformanceReport');
          }}
        />
      </Stack>
    </Container>
  );
};
