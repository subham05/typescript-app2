import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, View} from 'react-native';
import {VictoryPie} from 'victory-native';

export const ChartWorkloadReportScreen = () => {
  const {t} = useTranslation();

  const data = [
    {x: 1, y: 80},
    {x: 2, y: 20},
  ];

  return (
    <Stack spaceBelow={16} style={styles().chartView}>
      <StackItem childrenGap={20} spacing={40} style={styles().statusView}>
        <VictoryPie
          colorScale={[colors.primary_002, colors.grey_008]}
          standalone={true}
          width={Dimensions.get('screen').width}
          height={Dimensions.get('screen').height / 4.2}
          innerRadius={72}
          data={data}
          labelPosition={'centroid'}
          labelPlacement={'vertical'}
          labels={({datum}) => datum.y + '%'}
          labelRadius={85}
        />
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
      </StackItem>
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
      paddingTop: 20,
    },
    percentage1: {
      backgroundColor: colors.primary_002,
      height: 15,
      width: 15,
      borderRadius: 7.5,
      marginRight: 5,
      marginLeft: 10,
    },
    percentage2: {
      backgroundColor: colors.grey_008,
      height: 15,
      width: 15,
      borderRadius: 7.5,
      marginRight: 5,
      marginLeft: 10,
    },
    icon: {
      alignSelf: 'center',
    },
  });
  return mergeStyles;
};
