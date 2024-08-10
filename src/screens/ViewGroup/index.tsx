import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {
  MessageContactItem,
  MessageContactProps,
} from 'components/Messages/MessageContactItem';
import {Persona} from 'components/Persona';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useGetGroupInfoMutation,
  useRemoveMemberMutation,
} from 'request/Message';
import {
  groupDetails,
  groupMembersRecord,
  removeGroupMemberModal,
} from 'request/Message/constants';
import {pageInfo} from 'screens/Contacts';
import {AlertModal} from './components/AlertModal';
import {BottomModal} from './components/BottomModal';
import {ModalSearch} from './components/ModalSearch';
import {SearchModalScreen} from './components/SearchModal';
import {Styles} from './index.styles';
import {showToast} from 'common/utils/ToastMessage';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewGroup'>;

// const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const ViewGroupScreen = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {data, isAdmin} = {
    ...route.params,
  };

  const [dataItem, setDataItem] = useState<MessageContactProps>();

  const [searchModal, setSearchModal] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);

  const animatedVal = useSharedValue(0);

  const deviceWidth = Dimensions.get('window').width;

  const [getGroupInfo, {data: groupInfoData, isSuccess, isLoading}] =
    useGetGroupInfoMutation();

  const [
    removeMember,
    {
      data: removeMemData,
      isSuccess: removeMemSuccess,
      isLoading: removeMemLoading,
    },
  ] = useRemoveMemberMutation();

  const [groupMembers, setGroupMembers] = useState<groupMembersRecord[]>([]);
  const [pages, setPages] = useState<pageInfo>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [groupData, setGroupData] = useState<groupDetails>();
  const [searchText, setSearchText] = useState<string>('');

  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  const isFocused = useIsFocused();

  const headerScrollAnimatedStyles = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedVal.value,
      [0, 300],
      [0, 1],
      Extrapolate.CLAMP,
    );
    // const height = interpolate(
    //   animatedVal.value,
    //   [0, 300],
    //   [0, 35],
    //   Extrapolate.CLAMP,
    // );
    return {
      opacity,
      elevation: 20,
      backgroundColor: colors.grey_001,
      borderBottomWidth: 2,
      borderBottomColor: colors.grey_008,
      // height,
      // elevation: translateY.value >= height * 0.9 ? 20 : 0,
      // backgroundColor: colors.primary,
      // heightVal === 0 ?
      // setSearchModal(false):null,
      // }
      // backgroundColor:
      //   translateY.value >= height * 0.9 ? colors.white : colors.red,
    };
  });

  const scrollHandler = useAnimatedScrollHandler(event => {
    animatedVal.value = event.contentOffset.y;
  });

  const menuData: MenuModel[] = [
    {
      name: t('edit'),
      onClick: () => {
        props.navigation.navigate('EditGroupSubject', {
          groupId: groupInfoData?.data?.gorupDetails?._id,
          groupName: groupInfoData?.data?.gorupDetails?.groupName,
        });
      },
    },
  ];

  const groupDetailsRequest = useMemo(() => {
    return {
      groupId: data?._id,
      pageNo: pageNo,
      searchText: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, searchText]);

  useEffect(() => {
    if (isFocused) {
      getGroupInfo(groupDetailsRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupDetailsRequest, isFocused]);

  useEffect(() => {
    if (isFocused) {
      setIsFirstLoad(true);
      setPageNo(1);
      setGroupMembers([]);
      setGroupData(undefined);
    }
  }, [isFocused]);

  useEffect(() => {
    if (groupInfoData && isSuccess) {
      setGroupData(groupInfoData.data.gorupDetails);
      setGroupMembers(prev => prev.concat(groupInfoData.data.record));
      setPages(groupInfoData.data.pageInfo);
      if (isFirstLoad) {
        setIsFirstLoad(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupInfoData, isSuccess]);

  const onEndReached = () => {
    if (pages?.hasNextPage && !isLoading) {
      setPageNo((prev: number) => prev + 1);
    }
  };

  useEffect(() => {
    if (!searchModal) {
      if (pageNo === 1) {
        setSearchText('');
        setGroupMembers([]);
        setIsFirstLoad(true);
        getGroupInfo(groupDetailsRequest);
      } else {
        setPageNo(1);
        setGroupMembers([]);
        setSearchText('');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchModal]);

  useEffect(() => {
    setPageNo(1);
    setGroupMembers([]);
  }, [searchText]);

  const removeMemberFromGrp = () => {
    setOpenModal(false);
    const selectedData = dataItem as groupMembersRecord;
    const bodyObj: removeGroupMemberModal = {
      groupId: data?._id,
      body: {
        user: selectedData._id,
      },
    };
    removeMember(bodyObj);
  };

  useEffect(() => {
    if (removeMemData && removeMemSuccess) {
      showToast(removeMemData.message);
      setPageNo(1);
      setGroupMembers([]);
      getGroupInfo(groupDetailsRequest);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [removeMemData, removeMemSuccess]);

  const styles = Styles();

  return (
    <Container noSpacing>
      {(isFirstLoad || removeMemLoading) && <Loader color={colors.white} />}
      <Animated.View style={[headerScrollAnimatedStyles, styles.stickHeader]}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          style={[styles.header]}>
          <StackItem horizontal childrenGap={30}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Icon
                name="arrow_back"
                size={24}
                color={colors.black}
                style={styles.back}
              />
            </TouchableOpacity>
            {/* <Animated.View style={[headerScrollAnimatedStyles]}> */}
            <StackItem horizontal childrenGap={10} verticalAlign="center">
              <Persona
                name={groupData?.groupName}
                image={groupData?.groupImage}
                size={38}
              />
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                numberOfLines={1}
                style={{width: deviceWidth / 2}}>
                {groupData?.groupName}
              </TextView>
            </StackItem>
            {/* </Animated.View> */}
          </StackItem>

          <TouchableOpacity onPress={() => {}} style={styles.addMember}>
            <PopupMenu data={menuData} height={54} width={93} />
          </TouchableOpacity>
        </Stack>
      </Animated.View>
      <Stack
        horizontal
        horizontalAlign="space-between"
        style={styles.backIconView}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrow_back"
            size={24}
            color={colors.black}
            style={styles.back}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.addMember}>
          <PopupMenu data={menuData} height={54} width={93} />
        </TouchableOpacity>
      </Stack>

      <Animated.FlatList
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        overScrollMode="never"
        bounces={false}
        contentContainerStyle={styles.listBottom}
        showsVerticalScrollIndicator={false}
        data={groupMembers}
        ListHeaderComponent={() => {
          return (
            <>
              <View style={[styles.groupIcon, {backgroundColor: colors.white}]}>
                <StackItem childrenGap={20}>
                  <Stack verticalAlign="center">
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate('EditGroupIcon', {
                          image: groupData?.groupImage,
                          groupName: groupData?.groupName,
                          groupId: data?._id,
                        })
                      }>
                      <Persona
                        name={groupData?.groupName}
                        image={groupData?.groupImage}
                        size={150}
                      />
                    </TouchableOpacity>
                  </Stack>
                  <Stack spacing={15}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.large}
                      textAlign="center">
                      {groupData?.groupName}
                    </TextView>
                  </Stack>
                </StackItem>
              </View>
              <SearchModalScreen
                onPressNavigate={() =>
                  props.navigation.navigate('AddMember', {groupId: data?._id})
                }
                onPressSearch={setSearchModal}
                membersCount={groupData?.groupMembers.length}
                isAdmin={isAdmin}
              />
            </>
          );
        }}
        renderItem={({item, index}) => {
          return (
            <View key={index} style={styles.container}>
              <MessageContactItem
                item={item}
                onPress={() => {
                  setDataItem(item);
                  setReopenModal(true);
                }}
              />
            </View>
          );
        }}
        ListFooterComponent={() => {
          return (
            <>
              {pageNo !== 1 && (
                <FooterComponent isLoading={isLoading} size={10} />
              )}
            </>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        ListEmptyComponent={() =>
          groupMembers.length <= 0 && !isLoading ? <EmptyComponent /> : <></>
        }
        onEndReached={onEndReached}
      />

      {openModal && (
        <AlertModal
          value={openModal}
          onPress={val => setOpenModal(val)}
          onPressOkay={removeMemberFromGrp}
          data={dataItem}
          groupName={groupData?.groupName}
        />
      )}
      {reopenModal && (
        <BottomModal
          data={dataItem}
          openValue
          reopenValue
          onPressOpenModal={setOpenModal}
          onPressReopenModal={setReopenModal}
          onPressChattingScreen={() => {
            props.navigation.navigate('ChattingScreen', {
              type: 'People',
              data: dataItem,
              isShortKey: true,
              isCreateScreen: !dataItem.chatId,
            });
          }}
          onPressViewScreen={() => {
            props.navigation.navigate('ViewContact', {
              data: dataItem,
              isFromGroup: true,
            });
          }}
          isAdmin={isAdmin}
        />
      )}
      {searchModal && (
        <ModalSearch
          data={groupMembers}
          value={searchModal}
          onPress={setSearchModal}
          onEndReached={onEndReached}
          isLoading={isLoading}
          setSearchText={setSearchText}
          searchText={searchText}
          onMemberPress={(open, item) => {
            setDataItem(item);
            setReopenModal(open);
          }}
        />
      )}
    </Container>
  );
};
