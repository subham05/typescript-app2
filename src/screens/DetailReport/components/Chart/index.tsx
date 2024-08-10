import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {PerformanceDetail} from 'request/PerformanceReport';
import {
  generateGraphDataModal,
  GraphDataModal,
} from 'screens/DetailReport/constants';
import {VictoryPie, VictoryTooltip} from 'victory-native';

interface ChartDetailReportModal {
  PerformanceDetails: PerformanceDetail;
}

export const ChartDetailReportScreen: React.FC<ChartDetailReportModal> = ({
  PerformanceDetails,
}) => {
  const {t} = useTranslation();
  const [graphDetails, setGraphDetails] = useState<GraphDataModal[]>();

  useEffect(() => {
    if (PerformanceDetails) {
      let obj = {...PerformanceDetails} as {
        [key: string]: string | number | undefined;
      };
      delete obj.companyId;
      Object.keys(obj).forEach(
        key => (obj[key] = parseFloat(obj[key] as string)),
      );
      let graphData = generateGraphDataModal(obj);
      setGraphDetails(graphData);
    }
  }, [PerformanceDetails]);

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      spacing={16}
      spaceBelow={25}
      style={styles.chartBackground}>
      <Stack style={styles.chart}>
        <VictoryPie
          animate
          colorScale={[
            colors.green_002,
            colors.blue_002,
            colors.primary,
            colors.orange,
            colors.primary_002,
            colors.blue_001,
            colors.red_003,
          ]}
          standalone={true}
          width={globalScreenWidth / 1.7}
          height={globalScreenWidth / 1.5}
          innerRadius={72}
          style={{labels: {fill: colors.white}}}
          data={graphDetails}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onPressIn: () => {
                  return [
                    {
                      target: 'labels',
                      eventKey: 'all',
                      mutation: () => ({active: false}),
                    },
                  ];
                },
                onPressOut: () => {
                  return [
                    {
                      target: 'labels',
                      mutation: () => ({active: true}),
                    },
                  ];
                },
              },
            },
          ]}
          labels={({datum}) => datum.y + '%'}
          labelRadius={80}
          labelComponent={
            <VictoryTooltip
              // eslint-disable-next-line react-native/no-inline-styles
              flyoutStyle={{
                stroke: colors?.primary,
                strokeOpacity: 0.4,
                fill: colors.black,
              }}
            />
          }
        />
      </Stack>
      <StackItem childrenGap={15}>
        <Stack horizontal>
          <View style={styles.assignedDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:assigned')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.completedBeforeDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:completedBefore')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.completedDot} />
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.black}}>
            {t('taskReport:complete')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.completedAfterDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:completedAfter')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.inprogressDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:inProgress')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.resolvedDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:resolved')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.reopenedDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:reOpened')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View style={styles.overdueDot} />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:overdue')}
          </TextView>
        </Stack>
      </StackItem>
    </Stack>
  );
};

const styles = StyleSheet.create({
  chartBackground: {
    backgroundColor: colors.white,
    marginBottom: 16,
    paddingLeft: 10,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chart: {
    marginLeft: 10,
    marginRight: 10,
  },
  assignedDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.grey_008,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  completedBeforeDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.blue_001,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  completedDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.green_002,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  completedAfterDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.red_003,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  inprogressDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.blue_002,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  resolvedDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.primary_002,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  reopenedDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
  overdueDot: {
    height: 12,
    width: 12,
    backgroundColor: colors.orange,
    borderRadius: 10,
    marginRight: 5,
    marginTop: 3,
  },
});
