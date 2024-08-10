import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {ChartTaskReportScreen} from 'screens/TaskReport/components/Chart';
import {Styles} from './index.styles';

// const widthAndHeight = Dimensions.get('screen').width / 2;
// const series = [100, 40, 50, 20, 10, 20];
// const sliceColor = [
//   colors.grey_008,
//   colors.green_001,
//   colors.blue_002,
//   colors.primary,
//   colors.orange,
//   colors.primary_002,
// ];

export const EmployeeDetailReportScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [filterValue, setFilterValue] = useState<string>(
    t('performanceReport:all'),
  );

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
            <Stack spacing={16} horizontal horizontalAlign="space-between">
              <TextView weight="bold" variant={FontSizes.medium} truncate>
                Leslie Alexander
              </TextView>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.text}>
                {t('reports:totalAssigned')}
              </TextView>
            </Stack>
            <Stack spacing={16} horizontal horizontalAlign="space-between">
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.text}>
                Employee
              </TextView>
              <TextView
                weight="bold"
                variant={FontSizes.medium}
                style={styles.number}>
                10
              </TextView>
            </Stack>
            <Stack spacing={16}>
              <TextView weight="medium" variant={FontSizes.small} truncate>
                The Walt Disney Company
              </TextView>
            </Stack>
          </Stack>
          <ChartTaskReportScreen />
          <Stack
            spacing={16}
            spaceBelow={16}
            horizontal
            horizontalAlign="space-between">
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.heading}>
              {t('performanceReport:overallProgress')}
            </TextView>
            <Menu style={styles.menu}>
              <MenuTrigger>
                <StackItem horizontal childrenGap={5}>
                  <TextView weight="medium" variant={FontSizes.small}>
                    {filterValue}
                  </TextView>
                  <Icon name="arrow_drop_down" size={24} color={colors.black} />
                </StackItem>
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.menuOptions}>
                <MenuOption
                  onSelect={() => {
                    setFilterValue(t('performanceReport:all'));
                  }}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('performanceReport:all')}
                  </TextView>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setFilterValue(t('performanceReport:byTask'));
                  }}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('performanceReport:byTask')}
                  </TextView>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setFilterValue(t('performanceReport:byProject'));
                  }}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('performanceReport:byProject')}
                  </TextView>
                </MenuOption>
                <MenuOption
                  onSelect={() => {
                    setFilterValue(t('performanceReport:byGoal'));
                  }}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.shareText}>
                    {t('performanceReport:byGoal')}
                  </TextView>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </Stack>
          <Stack spacing={16} spaceBelow={16}>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('performanceReport:emergency')}
            </TextView>
            <ScrollView
              horizontal
              style={styles.stack}
              showsHorizontalScrollIndicator={false}>
              <Stack style={styles.horizontalView}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:assigned')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.assigned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:completed')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.completed}>
                  1
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:inProgress')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.inprogess}>
                  2
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:resolved')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.resolved}>
                  0
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:reOpened')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.reopned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:overdue')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.overdue}>
                  3
                </TextView>
              </Stack>
            </ScrollView>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('performanceReport:high')}
            </TextView>
            <ScrollView
              horizontal
              style={styles.stack}
              showsHorizontalScrollIndicator={false}>
              <Stack style={styles.horizontalView}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:assigned')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.assigned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:completed')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.completed}>
                  1
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:inProgress')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.inprogess}>
                  2
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:resolved')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.resolved}>
                  0
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:reOpened')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.reopned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:overdue')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.overdue}>
                  3
                </TextView>
              </Stack>
            </ScrollView>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('performanceReport:medium')}
            </TextView>
            <ScrollView
              horizontal
              style={styles.stack}
              showsHorizontalScrollIndicator={false}>
              <Stack style={styles.horizontalView}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:assigned')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.assigned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:completed')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.completed}>
                  1
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:inProgress')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.inprogess}>
                  2
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:resolved')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.resolved}>
                  0
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:reOpened')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.reopned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:overdue')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.overdue}>
                  3
                </TextView>
              </Stack>
            </ScrollView>
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('performanceReport:low')}
            </TextView>
            <ScrollView
              horizontal
              style={styles.stack}
              showsHorizontalScrollIndicator={false}>
              <Stack style={styles.horizontalView}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:assigned')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.assigned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:completed')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.completed}>
                  1
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:inProgress')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.inprogess}>
                  2
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:resolved')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.resolved}>
                  0
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:reOpened')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.reopned}>
                  3
                </TextView>
              </Stack>
              <Stack style={styles.marginHorizontal}>
                <TextView weight="medium" variant={FontSizes.small}>
                  {t('performanceReport:overdue')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.large}
                  style={styles.overdue}>
                  3
                </TextView>
              </Stack>
            </ScrollView>
          </Stack>
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
