import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {MailMessageListView} from './MailMessageView';
import {useGetEmailDetailMutation} from 'request/Inbox';
import Loader from 'components/Loader';
import {emailDetailDataModal} from 'request/Inbox/constants';
import {useFocusEffect} from '@react-navigation/native';

type Props = NativeStackScreenProps<SignedInStackParamList, 'MailMessage'>;
export const MailMessageScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const {mailId, searchText, setSearchTextVal} = route.params;
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const [emailDetailData, setEmailDetailData] =
    useState<emailDetailDataModal>();
  const [
    getEmail,
    {data: emailData, isSuccess: isEmailSuccess, isLoading: isEmailLoading},
  ] = useGetEmailDetailMutation();

  useFocusEffect(
    useCallback(() => {
      getEmail(mailId);
    }, [mailId, getEmail]),
  );

  useEffect(() => {
    if (emailData && isEmailSuccess) {
      const {data: emailDetailsdata} = emailData;
      // "priorityTaskId": {"_id": "64e5ae5792a5733070655572", "taskStatus": "Assigned"}
      setEmailDetailData(emailDetailsdata);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmailSuccess]);

  return (
    <Container noSpacing>
      <Header
        preventDefault
        onBackPress={() => {
          if (searchText) {
            setSearchTextVal?.(searchText!);
          }
          navigation.goBack();
        }}
        hideLabel
        navigationType="STACK"
        translateY={translateY}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack horizontal spacing={22} spaceBelow={16}>
          {emailDetailData && (
            <TextView weight="medium" variant={FontSizes.medium}>
              {t('inboxPage:subject')}: {emailDetailData?.subject}.{' '}
              {(emailDetailData?.isActionable ||
                emailDetailData?.isInformative) && (
                <View
                  style={{
                    height:
                      Platform.OS === 'ios'
                        ? Dimensions.get('screen').height / 35
                        : Dimensions.get('screen').height / 40,
                    paddingTop:
                      Platform.OS === 'ios'
                        ? Dimensions.get('screen').height / 250
                        : Dimensions.get('screen').height / 350,
                  }}>
                  <Stack style={styles().type}>
                    <TextView weight="regular" variant={FontSizes.xSmall}>
                      {emailDetailData?.isActionable
                        ? t('inboxPage:actionable')
                        : emailDetailData?.isInformative
                        ? t('inboxPage:informative')
                        : ''}
                    </TextView>
                  </Stack>
                </View>
              )}
              {/* <TextView weight="regular" variant={FontSizes.xxSmall}>
              {data.type}
            </TextView> */}
            </TextView>
          )}
          {/* {(emailDetailData?.isActionable ||
            emailDetailData?.isInformative) && (
            <Stack style={styles().type}>
              <TextView weight="regular" variant={FontSizes.xxSmall}>
                {emailDetailData?.isActionable
                  ? t('inboxPage:actionable')
                  : emailDetailData?.isInformative
                  ? t('inboxPage:informative')
                  : ''}
              </TextView>
            </Stack>
          )} */}
          {/* <Stack style={styles().type}>
            <TextView weight="regular" variant={FontSizes.xxSmall}>
              {data.type}
            </TextView>
          </Stack> */}
        </Stack>
        <Stack style={styles().eventsContainer}>
          <View>
            {emailDetailData && (
              <MailMessageListView
                data={[emailDetailData!]}
                onPressCreateTask={() =>
                  navigation.navigate('AddTask', {
                    mailData: emailDetailData,
                    subTask: true,
                  })
                }
                onPressRelatedTask={() =>
                  navigation.navigate('RelatedTask', {
                    taskIds: emailDetailData?.taskId,
                    isMail: true,
                  })
                }
              />
            )}
          </View>
        </Stack>
      </Animated.ScrollView>
      {isEmailLoading && <Loader />}
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
    type: {
      backgroundColor: colors.primary_005,
      height: 23,
      justifyContent: 'center',
      borderRadius: 3,
      paddingHorizontal: 10,
    },
  });
  return mergeStyles;
};
