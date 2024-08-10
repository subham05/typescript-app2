import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {ContactLogsMembersList} from './components/ContactMembersList';
import {Styles} from './index.styles';
import {contactList} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ContactLogs'>;
export const ContactLogsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('contacts:contacts')}
        translateY={translateY}
      />
      <Stack style={styles.flex}>
        <KeyboardAvoidingView
          behavior="height"
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
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
              <ContactLogsMembersList
                data={contactList}
                onPress={() => props.navigation.navigate('AccessLogs')}
              />
            </Stack>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        {/* <Stack style={{height: Dimensions.get('screen').height * 0.07}}>
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('save')}
              onPress={() => {
                props.navigation.navigate('PublicContactRepository');
              }}
            />
          </Stack>
        </Stack> */}
      </Stack>
    </Container>
  );
};
