import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {MessagesView} from 'screens/Messages/components/MessagesList';
// import {groupMessagesList, messagesList} from './mockData';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {initiateSocket, startSocket} from 'common/utils/socket';
import {FloatingButtonChat} from 'components/FloatingButtonChat';
import Loader from 'components/Loader';
import {useChatListMutation, useGroupchatListMutation} from 'request/Message';
import {chatModal} from 'request/Message/constants';
import {debounce} from 'lodash';

type Props = NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>;
export const MessagesScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [selectedContact, setSelectedContact] = useState<string>(
    t('messagePage:people'),
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [chatList, setChatList] = useState<chatModal[]>([]);
  const hasNextPage = useRef<boolean>(false);

  const isFocused = useIsFocused();
  // const {userData} = useAppSelector(state => state.formanagement);

  const [
    getChatList,
    {
      data: chatListData,
      isSuccess: isChatListSuccess,
      isLoading: isChatListLoading,
    },
  ] = useChatListMutation();

  const [
    groupchatList,
    {
      data: groupChatListData,
      isSuccess: isGroupChatListSuccess,
      isLoading: isGroupChatListLoading,
    },
  ] = useGroupchatListMutation();

  useEffect(() => {
    if (isChatListSuccess && chatListData) {
      const {record, pageInfo} = chatListData.data;
      pageNumber === 1
        ? setChatList(record as chatModal[])
        : setChatList(prev => prev.concat(record as chatModal[]));
      hasNextPage.current = pageInfo.hasNextPage!;
      setIsRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatListSuccess]);

  useFocusEffect(
    useCallback(() => {
      // getChatList(requestObj);
      startSocket();
      initiateSocket('Mobile Socket started.');
      // return () => disconnectSocket();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  const requestObj = useMemo(() => {
    return {
      pageNo: pageNumber,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, selectedContact]);

  useFocusEffect(
    useCallback(() => {
      if (selectedContact === 'Chats') {
        getChatList(requestObj);
      } else {
        groupchatList(requestObj);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestObj, selectedContact]),
  );

  useEffect(() => {
    if (isFocused) {
      setChatList([]);
      setPageNumber(1);
    }
  }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      if (isRefresh) {
        if (selectedContact === 'Chats') {
          getChatList(requestObj);
        } else {
          groupchatList(requestObj);
        }
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isRefresh]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPageNumber(1);
      };
    }, []),
  );

  useEffect(() => {
    if (isGroupChatListSuccess && groupChatListData) {
      const {record, pageInfo} = groupChatListData.data;
      pageNumber === 1
        ? setChatList(record as chatModal[])
        : setChatList(prev => prev.concat(record as chatModal[]));
      hasNextPage.current = pageInfo.hasNextPage!;
      setIsRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGroupChatListSuccess]);

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <IconButton
          name="search"
          color={colors.black}
          size={24}
          onPress={() => props.navigation.navigate('MessagesSearch')}
        />
        <IconButton
          name="group_add"
          color={colors.black}
          size={24}
          onPress={() => props.navigation.navigate('CreateGroup')}
          style={styles().groupAdd}
        />
        {/* <TouchableOpacity
          onPress={() => props.navigation.navigate('MessagesSearch')}>
          <Icon name="search" size={24} color={colors.black} />
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          onPress={() => props.navigation.replace('CreateGroup')}>
          <Icon
            name="group_add"
            size={24}
            color={colors.black}
            style={styles().groupAdd}
          />
        </TouchableOpacity> */}
      </Stack>
    );
  };

  const onEndReached = () => {
    if (hasNextPage.current && !isChatListLoading && !isGroupChatListLoading) {
      setPageNumber(prev => prev + 1);
    }
  };

  const debounceOnReach = debounce(onEndReached, 300);

  return (
    <Container noSpacing>
      <Header
        label={t('messagePage:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles().contactView}>
        <TouchableOpacity
          style={
            selectedContact === t('messagePage:people')
              ? styles().contactSelected
              : styles().contactNotSelected
          }
          onPress={() => {
            if (selectedContact !== 'Chats') {
              setChatList([]);
              setPageNumber(1);
              setSelectedContact(t('messagePage:people'));
            }
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles().contactText}>
            {t('messagePage:people')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedContact === t('messagePage:groups')
              ? styles().contactSelected
              : styles().contactNotSelected
          }
          onPress={() => {
            if (selectedContact !== 'Groups') {
              setChatList([]);
              setPageNumber(1);
              setSelectedContact(t('messagePage:groups'));
            }
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles().contactText}>
            {t('messagePage:groups')}
          </TextView>
        </TouchableOpacity>
      </Stack>

      <Stack style={styles().eventsContainer}>
        <MessagesView
          onScrollHandler={scrollHandler}
          data={chatList}
          chatListLength={chatList.length}
          type={selectedContact}
          onPress={item =>
            props.navigation.navigate('ChattingScreen', {
              type: selectedContact === 'Chats' ? 'Chats' : 'Groups',
              data: item,
            })
          }
          refreshing={isRefresh}
          isLoading={isChatListLoading || isGroupChatListLoading}
          pageNo={pageNumber}
          onEndReach={debounceOnReach}
          getRefresh={() => {
            setPageNumber(1);
            setIsRefresh(true);
          }}
        />
      </Stack>
      {selectedContact === t('messagePage:people') && (
        <FloatingButtonChat
          name={'chat'}
          onPress={() => props.navigation.navigate('AllContacts')}
        />
      )}
      {(isChatListLoading || isGroupChatListLoading) &&
        pageNumber === 1 &&
        !isRefresh && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 5,
      marginTop: 43,
    },
    groupAdd: {
      marginLeft: 10,
    },
    contactView: {
      marginLeft: 16,
      marginTop: 10,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 4,
      borderBottomColor: colors.primary,
      width: '45%',
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginRight: 20,
      width: '45%',
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      marginRight: 16,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
