import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {SharedContactRepositoryList} from 'screens/ContactRepository/components/SharedContactRepositoryList';
import {contactRepositoryList} from 'screens/ContactRepository/mockData';
import {ContactRepositoryHeader} from './components/Header';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<
  EmployeesSignedInStackParamList,
  'SharedContact'
>;

export const EmployeeSharedContactScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const [selectedContact, setSelectedContact] =
    useState<string>('Shared with me');

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.mainView}>
        <Stack style={styles.mainView}>
          <Header
            navigationType="STACK"
            label={t('contacts:sharedContacts')}
            translateY={translateY}
          />
          <ContactRepositoryHeader
            selectedValue={selectedContact}
            onPress={value => {
              setSelectedContact(value);
            }}
          />
          <Stack spacing={16} spaceBelow={16}>
            <SharedContactRepositoryList
              data={contactRepositoryList}
              SharedConatctDetailsNavigation={() =>
                props.navigation.navigate('SharedContactDetails')
              }
            />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
