import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useLazyGetShareWithMeDetailQuery} from 'request/ContactRepository';
import {
  sharedBusinessData,
  sharedUserDataModal,
} from 'screens/CreateContact/types';
import {BusinessCard} from './components/BusinessCard';
import {SharedContactDetailsList} from './components/SharedContactDetailsList';
import {Styles} from './index.styles';
type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'SharedContactDetails'
>;
export const SharedContactDetailsScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const [sharedBusinessCardData, setSharedBusinessCardData] =
    useState<sharedBusinessData>();
  const [contactSharedUsers, setContactSharedUsers] = useState<
    sharedUserDataModal[]
  >([]);
  const sharedUsersLength = useRef<number | undefined>(undefined);
  const {params} = props?.route;
  const [
    getContactDetail,
    {
      data: contactData,
      isFetching: isContactFetching,
      isLoading: isContactLoading,
      isSuccess: isContactSuccess,
    },
  ] = useLazyGetShareWithMeDetailQuery();
  useEffect(() => {
    if (params?.contactId) {
      getContactDetail(params?.contactId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.contactId]);
  useEffect(() => {
    if (contactData && isContactSuccess) {
      const {data} = contactData;
      setSharedBusinessCardData(data.record);
      setContactSharedUsers(data.sharedUserData);
      let usersLength = 0;
      data?.sharedUserData?.map(user => (usersLength += user?.users?.length));
      sharedUsersLength.current = usersLength || 0;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('contacts:sharedContacts')}
        translateY={translateY}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEnabled={sharedUsersLength.current! > 3 ? true : false}
        onScroll={scrollHandler}
        scrollEventThrottle={sharedUsersLength.current! > 3 ? 16 : 0}>
        {sharedBusinessCardData && (
          <Stack spacing={16}>
            <BusinessCard selectedItem={sharedBusinessCardData} />
          </Stack>
        )}
        {sharedUsersLength?.current && (
          <Stack spacing={16} spaceBelow={16}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.headingColor}>
              {t('contacts:shareContact_1')}
              {` ${sharedUsersLength.current} `}
              {t('contacts:shareContact_2')}:
            </TextView>
          </Stack>
        )}
        {contactSharedUsers?.map(user => {
          const {companyName, role, users} = user;
          return (
            <StackItem childrenGap={10} spacing={16} spaceBelow={16}>
              <TextView weight="regular" variant={FontSizes.regular} truncate>
                {companyName || ''}
              </TextView>
              <Stack>
                <TextView weight="regular" variant={FontSizes.small} truncate>
                  {role || ''}
                </TextView>
                <SharedContactDetailsList data={users} />
              </Stack>
            </StackItem>
          );
        })}
      </Animated.ScrollView>
      {(isContactLoading || isContactFetching) && <Loader />}
    </Container>
  );
};
