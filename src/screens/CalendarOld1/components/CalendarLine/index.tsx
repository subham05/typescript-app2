import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {CalendarProps} from '../CalendarItem';
import {CalendarLineItem} from '../CalendarLineItem';

interface CalendarLineViewProps {
  data: CalendarProps[];
}
export const CalendarLineView: React.FC<CalendarLineViewProps> = ({data}) => {
  return (
    <View>
      {data.map((item, index) => {
        return (
          <ScrollView key={index}>
            <View key={index} style={styles().container}>
              <CalendarLineItem data={item} />
            </View>
          </ScrollView>
        );
      })}
    </View>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      paddingBottom: 20,
    },
  });
  return mergeStyles;
};
