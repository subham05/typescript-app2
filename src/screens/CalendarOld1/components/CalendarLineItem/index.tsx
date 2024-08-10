import {colors} from 'common/theme/colors';
import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {taskStatusColor} from 'request/MasterCollection';
import {useAppSelector} from 'store/hooks';
import {CalendarProps} from '../CalendarItem';
interface CalendarLineItemProps {
  data: CalendarProps;
}

export const CalendarLineItem: React.FC<CalendarLineItemProps> = ({data}) => {
  const {statusColor} = useAppSelector(state => state?.formanagement);
  return (
    <>
      <View style={[styles(data?.status, statusColor).line]} />
    </>
  );
};

const styles = (
  status: string | undefined,
  statusColor: taskStatusColor | undefined,
) => {
  const mergeStyles = StyleSheet.create({
    line: {
      height: 5,
      width: Dimensions.get('screen').width,
      zIndex: 99,
      marginLeft: -23,
      marginTop: 108,
      backgroundColor: !status
        ? 'transparent'
        : status === 'Completed'
        ? statusColor?.Completed
        : colors.red_001,
    },
  });
  return mergeStyles;
};
