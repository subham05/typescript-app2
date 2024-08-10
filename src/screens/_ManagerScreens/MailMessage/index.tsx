import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {MailMessageListView} from './MailMessageView';
import {mailMessageDataSample} from './MailMessageView/mockdata';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'MailMessage'
>;
export const ManagerMailMessageScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Container noSpacing>
      <Header hideLabel navigationType="STACK" translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <TextView weight="bold" variant={FontSizes.medium}>
            {t('inboxPage:subject')}: Lorem ipsum dolor sit amet, consec tetur
            adipiscing elit.
          </TextView>
        </Stack>
        <Stack style={styles().eventsContainer}>
          <View>
            <MailMessageListView
              data={mailMessageDataSample}
              onPressCreateTask={() => navigation.navigate('AddTask')}
              onPressRelatedTask={() => navigation.navigate('RelatedTask')}
            />
          </View>
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingBottom: 40,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
    },
  });
  return mergeStyles;
};
