import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryTheme,
} from 'victory-native';

export const ChartWorkloadReportScreen = () => {
  const {t} = useTranslation();

  return (
    <Stack spaceBelow={16} style={styles().chartView}>
      <Stack horizontal horizontalAlign="space-between">
        <Icon
          name="arrow_left"
          size={22}
          color={colors.grey_003}
          style={styles().icon}
        />
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{x: 1}}
          width={345}>
          <VictoryGroup
            offset={28}
            colorScale={[colors.primary_002, colors.grey_008]}>
            <VictoryBar
              barWidth={28}
              data={[
                {x: 'Esther H.', y: 80},
                {x: 'Jenny W.', y: 90},
                {x: 'Jane C.', y: 95},
                {x: 'Leslie A.', y: 80},
              ]}
              labels={({datum}) => datum.y + '%'}
            />
            <VictoryBar
              barWidth={28}
              data={[
                {x: 'Esther H.', y: 20},
                {x: 'Jenny W.', y: 10},
                {x: 'Jane C.', y: 5},
                {x: 'Leslie A.', y: 20},
              ]}
              labels={({datum}) => datum.y + '%'}
            />
          </VictoryGroup>
          <VictoryAxis
            style={{
              axis: {stroke: 'transparent'},
              ticks: {stroke: 'transparent'},
              // tickLabels: {fill: 'transparent'},
              grid: {stroke: 'transparent'},
            }}
          />
        </VictoryChart>
        <Icon
          name="arrow_right"
          size={22}
          color={colors.black}
          style={styles().icon}
        />
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
  });
  return mergeStyles;
};
