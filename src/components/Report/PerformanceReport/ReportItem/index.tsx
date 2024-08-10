import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

interface ReportItemProps {
  data: ReportProps;
  onPress?: (item: ReportProps) => void;
  workload?: boolean;
}

export interface ReportProps {
  _id: string;
  name: string;
  zone: string;
  PerformanceDetails: {
    totalAssigned: number;
    inProgress: number;
    overDue: number;
    completed: number;
    onTime: number;
    beforeTime: number;
    afterTime: number;
  };
  companyName: string;
  role: string;
}

export const ReportItem: React.FC<ReportItemProps> = ({
  data,
  onPress,
  workload,
}) => {
  const {
    PerformanceDetails: {
      completed,
      afterTime,
      onTime,
      beforeTime,
      totalAssigned,
      inProgress,
      overDue,
    },
    companyName,
  } = data;
  const {t} = useTranslation();

  const onClick = () => {
    onPress!(data);
  };

  return (
    <TouchableOpacity onPress={() => onClick()}>
      <StackItem childrenGap={10} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {data.name}
          </TextView>
          {workload && (
            <Stack horizontal>
              <Stack horizontal>
                <View style={styles().percentage1} />
                <TextView weight="regular" variant={FontSizes.xxSmall}>
                  80%
                </TextView>
              </Stack>
              <Stack horizontal>
                <View style={styles().percentage2} />
                <TextView weight="regular" variant={FontSizes.xxSmall}>
                  20%
                </TextView>
              </Stack>
            </Stack>
          )}
        </Stack>
        <TextView weight="regular" variant={FontSizes.small} truncate>
          {companyName}
        </TextView>
        <Stack horizontal horizontalAlign="space-evenly" style={styles().stack}>
          <Stack horizontal>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('reports:totalAssigned')} :{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().totalAssigned}>
              {totalAssigned}
            </TextView>
          </Stack>
          <Stack horizontal>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('reports:inProgress')} :{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().inProgress}>
              {inProgress}
            </TextView>
          </Stack>
          <Stack horizontal>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('reports:overdue')} :{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().overdue}>
              {overDue}
            </TextView>
          </Stack>
        </Stack>
        <Stack horizontal horizontalAlign="space-evenly" style={styles().stack}>
          <Stack horizontal verticalAlign="center">
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={{color: colors.primary_003}}>
              {t('performanceReport:completed')}:{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={{color: colors.green}}>
              {completed}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={{color: colors.grey_008}}>
              {'  |'}
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
              {onTime}
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
              {beforeTime}
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
              {afterTime}
            </TextView>
          </Stack>
        </Stack>
        <View style={styles().bottom} />
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
    },
    stack: {
      marginLeft: '-5%',
    },
    text: {
      color: colors.primary_003,
    },
    totalAssigned: {
      color: colors.primary,
    },
    inProgress: {
      color: colors.blue_002,
    },
    overdue: {
      color: colors.orange,
    },
    bottom: {
      marginBottom: 15,
    },
    percentage1: {
      backgroundColor: colors.primary_002,
      height: 15,
      width: 15,
      // borderRadius: 7.5,
      marginRight: 5,
      marginLeft: 10,
    },
    percentage2: {
      backgroundColor: colors.grey_008,
      height: 15,
      width: 15,
      // borderRadius: 7.5,
      marginRight: 5,
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
