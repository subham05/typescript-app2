import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {sharedUserModal} from 'screens/CreateContact/types';
import {SharedContactDetailsItem} from '../SharedContactDetailsItem';

interface SharedContactDetailsListProps {
  data: sharedUserModal[];
}
export const SharedContactDetailsList: React.FC<
  SharedContactDetailsListProps
> = ({data}) => {
  return (
    <View>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {data?.map((item, index) => {
          return (
            <View key={index} style={styles().container}>
              <SharedContactDetailsItem item={item} />
            </View>
          );
        })}
      </ScrollView>
      {/* <FooterComponent /> */}
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
