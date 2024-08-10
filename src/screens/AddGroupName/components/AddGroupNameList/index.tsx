import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {AddGroupNameItem} from '../AddGroupNameItem';

interface AddGroupNameListProps {
  selectedMemberList: any;
}
export const AddGroupNameList: React.FC<AddGroupNameListProps> = ({
  selectedMemberList,
}) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedMemberList.map((item, index) => {
          return (
            <View key={index} style={styles().container}>
              <AddGroupNameItem item={item} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      marginBottom: 0,
    },
  });
  return mergeStyles;
};
