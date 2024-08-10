import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {StaffListNode} from 'request/StaffReport/types';
import {workloadListNodes} from 'request/WorkloadReport/types';

interface StaffReportItemProps {
  data: StaffListNode;
  onPress?: (item: workloadListNodes) => void;
  workload?: boolean;
}

export interface ReportProps {
  name: string;
  company: string;
  assigned: string;
  inprogress: string;
  overdue: string;
}

export const StaffReportItem: React.FC<StaffReportItemProps> = ({
  data,
  onPress,
}) => {
  const {t} = useTranslation();

  const onClick = () => {
    onPress!(data);
  };

  const {completed, inProgress, totalAssigned} = data.taskStatus;

  return (
    <TouchableOpacity onPress={() => onClick()}>
      <StackItem childrenGap={10} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between">
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {data.name}
          </TextView>
        </Stack>
        <TextView weight="regular" variant={FontSizes.small} truncate>
          {data.companyName}
        </TextView>
        <Stack horizontal horizontalAlign="space-between">
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
              {t('reports:completed')} :{' '}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().overdue}>
              {completed}
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
      color: colors.green,
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
