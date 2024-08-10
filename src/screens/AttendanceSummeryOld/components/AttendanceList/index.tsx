import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {AttendanceItem, AttendanceProps} from '../AttendanceItem';

interface AttendanceListProps {
  data: AttendanceProps[];
  onPress?: (item: AttendanceProps) => void;
}
export const AttendanceList: React.FC<AttendanceListProps> = ({
  data,
  onPress,
}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item, index}) => (
        <View key={index} style={styles().container}>
          <AttendanceItem data={item} onPress={onPress} />
        </View>
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent />}
    />
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    bottomPadding: {
      marginBottom: 200,
    },
  });
  return mergeStyles;
};
