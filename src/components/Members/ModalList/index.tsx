import {membersProps} from 'components/Members/MembersItem';
import React from 'react';
import {FlatList} from 'react-native';
import {ModalItem} from '../ModalItem';

interface ModalListProps {
  data: membersProps[];
  isEmail?: boolean;
}
export const ModalList: React.FC<ModalListProps> = ({data, isEmail}) => {
  return (
    <FlatList
      data={data}
      renderItem={({item}) => <ModalItem item={item} isEmail={isEmail} />}
      keyExtractor={(_, index) => index.toString()}
    />
  );
};
