import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {FlatList} from 'react-native';
import {InboxNavProps} from '..';
import {MailInboxRowInterface, MailItem} from '../MailItem';

interface MailListViewProps extends InboxNavProps {
  data: MailInboxRowInterface[];
}
export const MailListView: React.FC<MailListViewProps> = ({
  data,
  navigation,
}) => {
  return (
    <>
      <FlatList
        data={data}
        renderItem={({...props}) => (
          <MailItem
            {...props}
            onPress={() => {
              navigation.navigate('MailMessage');
            }}
          />
        )}
        ListFooterComponent={() => <FooterComponent />}
      />
    </>
  );
};
