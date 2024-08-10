import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {graphData} from 'request/TaskReport/types';
import {VictoryPie} from 'victory-native';
import {Styles} from '../../index.styles';
import {colors} from 'common/theme/colors';

interface TaskReportChartProps {
  data: graphData[];
  colorScale: string[];
  isGraphEmpty: boolean;
}

export const ChartTaskReportScreen: FC<TaskReportChartProps> = ({
  data,
  colorScale,
  isGraphEmpty,
}) => {
  const {t} = useTranslation();
  const styles = Styles();

  return (
    <Stack
      horizontal
      horizontalAlign="space-between"
      spacing={16}
      spaceBelow={16}
      style={styles.chartBackground}>
      <Stack style={styles.chart}>
        <VictoryPie
          colorScale={isGraphEmpty ? [colors.grey_002] : colorScale}
          standalone={true}
          width={Dimensions.get('screen').width / 1.7}
          height={Dimensions.get('screen').width / 2}
          innerRadius={72}
          data={isGraphEmpty ? [{x: 'No data', y: 100}] : data}
          labelPosition={'centroid'}
          labelPlacement={'vertical'}
          labels={({datum}) => {
            return isGraphEmpty
              ? 'No data'
              : datum.y !== 0
              ? datum.y + '%'
              : '';
          }}
          labelRadius={80}
        />
      </Stack>
      <StackItem childrenGap={15}>
        <Stack horizontal>
          <View
            style={[styles.completedDot, {backgroundColor: colorScale?.[0]}]}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:complete')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View
            style={[styles.inprogressDot, {backgroundColor: colorScale?.[1]}]}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:inProgress')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View
            style={[styles.resolvedDot, {backgroundColor: colorScale?.[2]}]}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:resolved')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View
            style={[styles.reopenedDot, {backgroundColor: colorScale?.[3]}]}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:reOpened')}
          </TextView>
        </Stack>
        <Stack horizontal>
          <View
            style={[styles.overdueDot, {backgroundColor: colorScale?.[4]}]}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {t('taskReport:overdue')}
          </TextView>
        </Stack>
      </StackItem>
    </Stack>
  );
};
