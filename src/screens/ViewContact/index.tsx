import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import {FooterComponent} from 'components/FooterComponent';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useChatDetailsMutation} from 'request/Message';
import {groupInCommon, userDetails} from 'request/Message/constants';
import {pageInfo} from 'screens/Contacts';
import {MessagesItem} from 'screens/Messages/components/MessagesItem';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewContact'>;
export const ViewContactScreen = (props: Props) => {
  const {t} = useTranslation();

  const {data, isFromGroup, isCreateScreen} = props.route.params!;
  const [getChatInfo, {data: chatData, isSuccess, isLoading}] =
    useChatDetailsMutation();

  const [userInfo, setUserInfo] = useState<userDetails>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [commonGroups, setCommonGroups] = useState<groupInCommon[]>([]);

  const animatedVal = useSharedValue(0);

  const headerScrollAnimatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedVal.value,
      [0, 300],
      [0, 1],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
      elevation: 2,
      backgroundColor: colors.grey_001,
      borderBottomWidth: 2,
      borderBottomColor: colors.grey_008,
    };
  });

  const scrollHandler = useAnimatedScrollHandler(event => {
    animatedVal.value = event.contentOffset.y;
  });

  const {userData} = useAppSelector(state => state.formanagement);

  const viewContactRequest = useMemo(() => {
    return {
      pageNo: pageNo,
      userId:
        isFromGroup || isCreateScreen
          ? data?._id
          : userData?._id === data?.chatWith
          ? data?.chatOwner
          : data?.chatWith,
      chatOwner: isCreateScreen ? userData?._id : data?.chatOwner,
      chatWith: isCreateScreen ? data._id : data?.chatWith,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    getChatInfo(viewContactRequest);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (chatData && isSuccess) {
      setUserInfo(chatData.data.userDetails);
      setPages(chatData.data.pageInfo);
      if (!isFromGroup) {
        setCommonGroups(chatData.data.record);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatData]);

  const onEndReached = () => {
    if (pages?.hasNextPage && !isLoading) {
      setPageNo((prev: number) => prev + 1);
    }
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      {isLoading && <Loader />}
      <Animated.View style={[headerScrollAnimatedStyles, styles.stickHeader]}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem horizontal childrenGap={30}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name="arrow_back"
                size={24}
                color={colors.black}
                style={styles.back}
              />
            </TouchableOpacity>
            <StackItem horizontal childrenGap={10} verticalAlign="center">
              <Persona
                name={userInfo?.name}
                image={userInfo?.profileUrl}
                size={38}
              />
              <TextView weight="medium" variant={FontSizes.regular}>
                {userInfo?.name}
              </TextView>
            </StackItem>
          </StackItem>
        </Stack>
      </Animated.View>

      <Stack
        horizontal
        horizontalAlign="space-between"
        style={[styles.headerr]}>
        <Stack horizontal>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon
              name="arrow_back"
              size={24}
              color={colors.black}
              style={styles.back}
            />
          </TouchableOpacity>
        </Stack>
      </Stack>

      <Animated.FlatList
        data={commonGroups}
        bounces={false}
        overScrollMode={'never'}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageContainer}
        ListHeaderComponent={() => {
          return (
            <Stack>
              <Stack
                style={[styles.groupIcon, {backgroundColor: colors.white}]}>
                <Persona
                  name={userInfo?.name}
                  image={userInfo?.profileUrl}
                  size={150}
                />
                <StackItem
                  childrenGap={10}
                  spacing={16}
                  spaceBelow={16}
                  style={styles.view}>
                  <TextView weight="medium" variant={FontSizes.large}>
                    {userInfo?.name}
                  </TextView>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    {userInfo?.designation}
                  </TextView>
                </StackItem>
              </Stack>
              <StackItem childrenGap={10} spacing={16} spaceBelow={16}>
                <TextView weight="medium" variant={FontSizes.regular}>
                  {t('viewContact:contactInfo')}
                </TextView>
                <StackItem childrenGap={5}>
                  <Stack horizontal>
                    <Icon name="email" size={24} color={colors.primary_003} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles.contactInfoHead}>
                      {t('viewContact:email')}
                    </TextView>
                  </Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={[styles.text, styles.rtlView]}>
                    {userInfo?.email}
                  </TextView>
                </StackItem>
                <Divider size={2} />
                <StackItem childrenGap={5}>
                  <Stack horizontal>
                    <Icon name="phone" size={24} color={colors.primary_003} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles.contactInfoHead}>
                      {t('viewContact:phone')}
                    </TextView>
                  </Stack>
                  {userInfo?.mobile && (
                    <TextView
                      weight="regular"
                      variant={FontSizes.small}
                      style={[styles.text, styles.rtlView]}>
                      {`+${userInfo?.countryCode} ${userInfo?.mobile}`}
                    </TextView>
                  )}
                </StackItem>
                <Divider size={2} />
              </StackItem>
              {!isFromGroup && (
                <Stack
                  spaceBelow={16}
                  spacing={16}
                  horizontal
                  horizontalAlign="space-between"
                  style={styles.titleMargin}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.text}>
                    {t('viewContact:groups')}
                  </TextView>

                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.text}>
                    {commonGroups.length && commonGroups.length}
                  </TextView>
                </Stack>
              )}
            </Stack>
          );
        }}
        renderItem={({item, index}) => {
          return (
            <View key={index} style={styles.container}>
              <MessagesItem
                item={item}
                type={'Groups'}
                onPress={value => {
                  props.navigation.navigate('ChattingScreen', {
                    type: 'Groups',
                    data: {
                      _id: value._id,
                      groupImage: value.groupImage,
                      groupName: value.groupName,
                    },
                  });
                }}
                viewContact={true}
                hideMsgDate
              />
            </View>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        ListFooterComponent={() => (
          <FooterComponent isLoading={isLoading && pageNo > 1} size={10} />
        )}
        ListEmptyComponent={() =>
          commonGroups.length === 0 && !isLoading && !isFromGroup ? (
            <Stack verticalAlign="center" style={styles.marginVertical}>
              <TextView variant={FontSizes.large} weight={'semibold'}>
                No data found
              </TextView>
            </Stack>
          ) : null
        }
        onEndReached={onEndReached}
      />
    </Container>
  );
};
