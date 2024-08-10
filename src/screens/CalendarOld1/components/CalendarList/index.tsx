import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {
  CalendarItem,
  CalendarProps,
} from 'screens/CalendarOld1/components/CalendarItem';

interface CalendarListViewProps {
  data: CalendarProps[];
  onPress: () => void;
}
export const CalendarListView: React.FC<CalendarListViewProps> = ({
  data,
  onPress,
}) => {
  return (
    <View>
      {data.map((item, index) => {
        return (
          <ScrollView key={index}>
            <View key={index} style={styles().container}>
              <CalendarItem
                key={index}
                data={item}
                index={index.toString()}
                onPress={onPress}
              />
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
