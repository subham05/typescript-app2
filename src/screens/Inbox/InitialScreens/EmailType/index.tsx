import React from 'react';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {Stack} from 'components/Stack';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {CompositeScreenProps} from '@react-navigation/core';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Google from '../../../../assets/svgs/Google.svg';
import Mail from '../../../../assets/svgs/Mail.svg';
import MicrosoftExchange from '../../../../assets/svgs/Microsoft-Exchange.svg';
import MicrosoftOutlook from '../../../../assets/svgs/Microsoft-outlook.svg';
import Yahoo from '../../../../assets/svgs/yahoo.svg';
type InboxNavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<EmailStackParamList, 'emailType'>
>;
const EmailType = (props: InboxNavProps) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);

  return (
    <Container noSpacing>
      <Header
        label={t('inboxPage:setupEmail')}
        translateY={translateY}
        navigationType="STACK"
      />
      <Stack spacing={10}>
        <TouchableOpacity
          style={styles().paddingStyle}
          onPress={() => props.navigation.navigate('loginWithGoogle')}>
          <Stack horizontal horizontalAlign="flex-start">
            <Google width={32} height={32} style={styles().rightStyle} />
            <TextView weight={'semibold'} variant={18}>
              {t('inboxPage:google')}
            </TextView>
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity style={styles().paddingStyle}>
          <Stack horizontal horizontalAlign="flex-start">
            <MicrosoftOutlook
              width={32}
              height={32}
              style={styles().rightStyle}
            />
            <TextView weight={'semibold'} variant={18}>
              {t('inboxPage:outlook')}
            </TextView>
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity style={styles().paddingStyle}>
          <Stack horizontal horizontalAlign="flex-start">
            <Yahoo width={32} height={32} style={styles().rightStyle} />
            <TextView weight={'semibold'} variant={18}>
              {t('inboxPage:yahoo')}
            </TextView>
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity style={styles().paddingStyle}>
          <Stack horizontal horizontalAlign="flex-start">
            <MicrosoftExchange
              width={32}
              height={32}
              style={styles().rightStyle}
            />
            <TextView weight={'semibold'} variant={18}>
              {t('inboxPage:office')}
            </TextView>
          </Stack>
        </TouchableOpacity>

        <TouchableOpacity style={styles().paddingStyle}>
          <Stack horizontal horizontalAlign="flex-start">
            <Mail width={32} height={32} style={styles().rightStyle} />
            <TextView weight={'semibold'} variant={18}>
              {t('inboxPage:other')}
            </TextView>
          </Stack>
        </TouchableOpacity>
      </Stack>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    paddingStyle: {
      padding: 20,
    },
    rightStyle: {
      marginRight: 20,
    },
  });
  return mergeStyles;
};
export default EmailType;
