import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Stack} from 'stack-container';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';
import {Styles} from '../../index.styles';

export const ChartHomeScreen = () => {
  const data = [
    {x: 1, y: 100},
    {x: 2, y: 50},
    {x: 3, y: 10},
    {x: 4, y: 5},
    {x: 5, y: 30},
    {x: 6, y: 5},
  ];

  const styles = Styles();

  const {t} = useTranslation();
  return (
    <>
      <Stack spaceBelow={16} style={styles.chartView}>
        <Stack style={styles.chart}>
          <VictoryChart theme={VictoryTheme.material} domainPadding={{x: 1}}>
            <VictoryBar
              style={{
                data: {
                  fill: ({datum}) =>
                    datum.x === 1
                      ? colors.grey_008
                      : datum.x === 2
                      ? colors.blue_002
                      : datum.x === 3
                      ? colors.primary_002
                      : datum.x === 4
                      ? colors.orange
                      : datum.x === 5
                      ? colors.green_002
                      : colors.primary,
                },
              }}
              data={data}
              labels={({datum}) => datum.y + '%'}
            />
            <VictoryAxis
              style={{
                axis: {stroke: 'transparent'},
                ticks: {stroke: 'transparent'},
                tickLabels: {fill: 'transparent'},
                grid: {stroke: 'transparent'},
              }}
            />
          </VictoryChart>
          <Stack childrenGap={15} spacing={40} style={styles.statusView}>
            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal>
                <View style={styles.assignedDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:assigned')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View style={styles.inprogressDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:inProgress')}
                </TextView>
              </Stack>
              <Stack horizontal>
                <View style={styles.resolvedDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:resolved')}
                </TextView>
              </Stack>
            </Stack>

            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal>
                <View style={styles.completedDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:complete')}
                </TextView>
              </Stack>
              <Stack horizontal style={styles.overdue}>
                <View style={styles.overdueDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:overdue')}
                </TextView>
              </Stack>
              <Stack horizontal style={styles.reOpened}>
                <View style={styles.reopenedDot} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  {t('homePage:reOpened')}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
