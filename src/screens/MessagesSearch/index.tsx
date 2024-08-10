import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {debounce} from 'lodash';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useChatListMutation, useGroupchatListMutation} from 'request/Message';
import {chatModal} from 'request/Message/constants';
import {MessagesView} from 'screens/Messages/components/MessagesList';

type Props = NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>;
export const MessagesSearchScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [chatList, setChatList] = useState<chatModal[]>([]);
  const hasNextPage = useRef<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<string>(
    t('messagePage:people'),
  );
  const [searchText, setSearchText] = useState<string>('');

  const requestObj = useMemo(() => {
    return {
      pageNo: pageNumber,
      searchText: searchText,
    };
  }, [pageNumber, searchText]);

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

  useFocusEffect(
    useCallback(() => {
      if (selectedContact === 'Chats') {
        getChatList(requestObj);
      } else {
        groupchatList(requestObj);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestObj, selectedContact, searchText]),
  );
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
    }, [requestObj, selectedContact, isRefresh]),
  );

  useFocusEffect(
    useCallback(() => {
      return () => {
        setPageNumber(1);
      };
    }, []),
  );

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

  useEffect(() => {
    if (isGroupChatListSuccess && groupChatListData) {
      const {record, pageInfo} = groupChatListData?.data;
      pageNumber === 1
        ? setChatList(record as chatModal[])
        : setChatList(prev => prev.concat(record as chatModal[]));
      hasNextPage.current = pageInfo.hasNextPage!;
      setIsRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGroupChatListSuccess]);

  // const [searchOption, setSearchOption] = useState<boolean>(false);
  // const [search, setSearch] = useState<string>('');

  // const renderLeftContainer = () => {
  //   return (
  //     <Stack horizontal>
  //       <TouchableOpacity onPress={() => setSearchOption(!searchOption)}>
  //         <Icon name="search" size={24} color={colors.black} />
  //       </TouchableOpacity>
  //       <TouchableOpacity
  //         onPress={() => props.navigation.replace('CreateGroup')}>
  //         <Icon
  //           name="group_add"
  //           size={24}
  //           color={colors.black}
  //           style={styles().groupAdd}
  //         />
  //       </TouchableOpacity>
  //     </Stack>
  //   );
  // };

  const onChange = (e: string) => {
    // just won't work, this callback is debounced
    setPageNumber(1);
    setSearchText(e.trim());
  };
  const debouncedOnChange = debounce(onChange, 1000);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('messagePage:head')}
        translateY={translateY}
        // RenderLeftContainer={renderLeftContainer}
      />
      {/* {searchOption && ( */}
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles().attachmentView}>
        <SearchTextField
          value={searchText}
          setSearchValue={val => {
            debouncedOnChange(val);
          }}
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
        />
      </Stack>
      {/* )} */}
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
            setChatList([]);
            setPageNumber(1);
            setSelectedContact(t('messagePage:people'));
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
            setChatList([]);
            setPageNumber(1);
            setSelectedContact(t('messagePage:groups'));
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
          onEndReach={() =>
            hasNextPage.current &&
            !isChatListLoading &&
            !isGroupChatListLoading &&
            setPageNumber(pageNumber + 1)
          }
          getRefresh={() => {
            setPageNumber(1);
            setIsRefresh(true);
          }}
        />
      </Stack>
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
      marginBottom: 50,
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
      borderBottomWidth: 3,
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
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
