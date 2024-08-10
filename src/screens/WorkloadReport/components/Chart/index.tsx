import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {IconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {workloadGraph} from 'request/WorkloadReport/types';
import {respHeight} from 'screens/Calendar/utils/responsive';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
} from 'victory-native';

type WorkloadGraphProps = {
  data: workloadGraph[];
};

export const ChartWorkloadReportScreen: FC<WorkloadGraphProps> = ({data}) => {
  const {t} = useTranslation();

  const [pageNo, setPageNo] = useState<number>(0);

  const blankChartData = [
    {x: '', y: 0},
    {x: ' ', y: 0},
  ];

  return (
    <Stack spaceBelow={16} style={styles().chartView}>
      <Stack horizontal horizontalAlign="space-between" style={styles().chart}>
        <Stack style={styles().icon}>
          <IconButton
            name="arrow_left"
            size={22}
            color={pageNo === 0 ? colors.grey_003 : colors.black}
            onPress={() => setPageNo(prev => prev - 1)}
            disabled={pageNo === 0 ? true : false}
          />
        </Stack>
        {data.length ? (
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{x: 1}}
            width={320}>
            <VictoryAxis
              style={{
                axis: {stroke: 'transparent'},
                ticks: {stroke: 'transparent'},
                // tickLabels: {fill: 'transparent'},
                grid: {stroke: 'transparent'},
              }}
              tickFormat={e =>
                `${e.toString().slice(0, 30)}${
                  e.toString().length > 30 ? '...' : ''
                }`
              }
            />
            <VictoryGroup
              offset={38}
              colorScale={[colors.primary_002, colors.grey_008]}>
              <VictoryBar
                barWidth={38}
                data={data.length ? data[pageNo]?.occupied : blankChartData}
                // data={blankChartData}
                labels={({datum}) => datum.y + '%'}
              />
              <VictoryBar
                barWidth={38}
                // data={blankChartData}
                data={data.length ? data[pageNo]?.free : blankChartData}
                labels={({datum}) => datum.y + '%'}
              />
            </VictoryGroup>
          </VictoryChart>
        ) : (
          <View style={styles().emptyView}>
            <TextView>No data</TextView>
          </View>
        )}

        <Stack style={styles().icon}>
          <IconButton
            name="arrow_right"
            size={22}
            color={data.length === pageNo + 1 ? colors.grey_003 : colors.black}
            onPress={() => setPageNo(prev => prev + 1)}
            disabled={data.length === pageNo + 1 ? true : false}
          />
        </Stack>
      </Stack>
      <Stack spacing={40} style={styles().statusView}>
        <StackItem childrenGap={10} horizontal>
          <Stack horizontal>
            <View style={styles().percentage1} />
            <TextView weight="regular" variant={FontSizes.xSmall}>
              {t('workloadReport:occupied')}
            </TextView>
          </Stack>
          <Stack horizontal>
            <View style={styles().percentage2} />
            <TextView weight="regular" variant={FontSizes.xSmall}>
              {t('workloadReport:free')}
            </TextView>
          </Stack>
        </StackItem>
      </Stack>
    </Stack>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    chartView: {
      backgroundColor: colors.white,
      marginBottom: 26,
      marginTop: 10,
    },
    chart: {
      paddingHorizontal: 0,
    },
    statusView: {
      alignItems: 'center',
    },
    percentage1: {
      backgroundColor: colors.primary_002,
      height: 15,
      width: 15,
      marginRight: 5,
      marginLeft: 10,
    },
    percentage2: {
      backgroundColor: colors.grey_008,
      height: 15,
      width: 15,
      marginRight: 5,
      marginLeft: 10,
    },
    icon: {
      alignSelf: 'center',
    },
    emptyView: {
      height: respHeight(300),
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return mergeStyles;
};
