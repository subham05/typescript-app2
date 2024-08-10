import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {attendanceListData} from 'request/AttendanceReport/types';

interface AttendanceItemProps {
  data: attendanceListData;
  onPress?: (item: attendanceListData) => void;
}

export interface AttendanceProps {
  name: string;
  totalDays: string;
  working: string;
  present: string;
  absent: string;
}

export const AttendanceItem: React.FC<AttendanceItemProps> = ({
  data,
  onPress,
}) => {
  const {t} = useTranslation();

  const onClick = () => {
    onPress!(data);
  };

  const {absentDays, presentDays, totalDays, workingDays} =
    data.attendanceDetails;

  return (
    <TouchableOpacity onPress={() => onClick()}>
      <StackItem childrenGap={4} style={styles().container}>
        <StackItem childrenGap={4}>
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {data.name}
          </TextView>
          <StackItem horizontal childrenGap={5}>
            <TextView weight="regular" variant={FontSizes.small}>
              {t('attendance:attended')}:
            </TextView>
            <TextView weight="regular" variant={FontSizes.small}>
              {totalDays}
            </TextView>
          </StackItem>
        </StackItem>
        <Stack center horizontal horizontalAlign="space-between">
          <Stack center horizontal horizontalAlign="space-between">
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('attendance:workingDays')} :
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().totalAssigned}>
              {workingDays}
            </TextView>
          </Stack>
          <Stack center horizontal horizontalAlign="space-between">
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('attendance:presentDays')} :
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().inProgress}>
              {presentDays}
            </TextView>
          </Stack>
          <Stack center horizontal horizontalAlign="space-between">
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles().text}>
              {t('attendance:absentDays')} :
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles().overdue}>
              {absentDays}
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
      color: colors.blue_001,
    },
    overdue: {
      color: colors.red_001,
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
