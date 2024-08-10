import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {SearchTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {contactList} from 'screens/Contacts/mockData';
import {ContactMembersList} from 'screens/OwnerContacts/components/ContactMembersList';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<ManagerSignedInStackParamList>;
export const EmployeeContactsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header label={t('drawer:employee')} translateY={translateY} />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <ContactMembersList
            data={contactList}
            onPress={() => {
              props.navigation.navigate('EmployeeContactDetails');
            }}
          />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
