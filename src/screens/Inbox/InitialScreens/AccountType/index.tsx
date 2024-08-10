import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {StackItem} from 'components/Stack';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useSharedValue} from 'react-native-reanimated';

export type InboxNavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<EmailStackParamList, 'AccountType'>
>;

export const AccountType = (props: InboxNavProps) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);

  const navigateToAddPassword = () => {
    props.navigation.navigate('AddEmailPassword', {
      email: props.route.params?.email,
    });
  };

  return (
    <Container noSpacing>
      <Header
        label={props.route.params?.email}
        navigationType="STACK"
        translateY={translateY}
      />
      <StackItem childrenGap={16} spacing={16} style={styles().top}>
        <TextView>{t('inboxPage:whatTypeofAccount')}</TextView>
        <TouchableOpacity onPress={navigateToAddPassword} style={styles().top}>
          <TextView style={styles().optionColor}>{t('inboxPage:pop')}</TextView>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateToAddPassword}>
          <TextView style={styles().optionColor}>
            {t('inboxPage:imap')}
          </TextView>
        </TouchableOpacity>
      </StackItem>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    top: {
      marginTop: 16,
    },
    optionColor: {
      color: colors.primary,
    },
  });
  return mergeStyles;
};
