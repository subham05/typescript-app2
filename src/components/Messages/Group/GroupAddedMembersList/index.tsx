import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {inviteList} from 'request/Message/constants';
import {GroupAddedMembersItem} from '../GroupAddedMembersItem';

interface GroupAddedMembersProps {
  data: inviteList[];
  onPress: (item: inviteList) => void;
}
export const GroupAddedMembersList: React.FC<GroupAddedMembersProps> = ({
  data,
  onPress,
}) => {
  return (
    <FlatList
      horizontal
      data={data}
      renderItem={({item, index}) => {
        return (
          <View key={index} style={styles().container}>
            <GroupAddedMembersItem
              index={index}
              item={item}
              onPress={onPress}
            />
          </View>
        );
      }}
      keyExtractor={(_, index) => index.toString()}
    />
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
