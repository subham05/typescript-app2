import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {SearchTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {MailListView} from './MailListView';
import {inboxDataSample} from './MailListView/mockdata';

export type InboxNavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<EmployeesSignedInStackParamList, 'DrawerNavigation'>
>;

export const EmployeeInboxScreen = (props: InboxNavProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const {navigation} = {...props};

  return (
    <Container noSpacing>
      <Header label={t('inboxPage:head')} translateY={translateY} />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles().attachmentView}>
        <SearchTextField />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <MailListView data={inboxDataSample} {...props} />
      </Animated.ScrollView>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
