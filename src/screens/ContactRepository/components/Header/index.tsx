// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {STR_KEYS} from 'common/storage';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {SearchTextField} from 'components/TextField';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, TouchableOpacity} from 'react-native';
import {Styles} from './index.styles';

interface ContactRepositoryHeaderProps {
  selectedValue: string;
  onPress: (value: string) => void;
  getSearchedValue: (value: string) => void;
  props: any;
}

export const ContactRepositoryHeader: React.FC<
  ContactRepositoryHeaderProps
> = ({selectedValue, onPress, getSearchedValue}) => {
  const {t} = useTranslation();

  // const [userType, setUserType] = useState<string | null | undefined>('');

  // AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
  //   setUserType(res);
  // });

  const [selectedContact, setSelectedContact] = useState<string>(selectedValue);

  const onSelect = (value: string) => {
    setSelectedContact(value);
    onPress(value);
  };
  useEffect(() => {
    getSearchedValue('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);
  const styles = Styles();
  return (
    <>
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          pattern1={/[~`!%^*=[\]\\;,_©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?]/}
          pattern2={/^[ A-Za-z0-9.'-@#$&+]*$/}
          onSearchChange={value => getSearchedValue(value)}
          selectedContact={selectedContact}
        />
      </Stack>
      <Stack
        horizontal
        horizontalAlign="space-around"
        style={styles.contactView}
        spacing={16}>
        <TouchableOpacity
          style={
            selectedContact === 'Private'
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            Keyboard.dismiss();
            onSelect('Private');
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('contacts:private')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedContact === 'Public'
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            Keyboard.dismiss();
            onSelect('Public');
            console.log('🚀 ~ file: index.tsx:96 ~ Public:');
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('contacts:public')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedContact === 'Shared'
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            Keyboard.dismiss();
            onSelect('Shared');
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('contacts:shared')}
          </TextView>
        </TouchableOpacity>
      </Stack>
    </>
  );
};
