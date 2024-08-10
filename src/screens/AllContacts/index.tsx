import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/TextField';
import {MessageContactList} from 'components/Messages/MessageContactList';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {Styles} from './index.styles';
import {chatInviteeModal, useGetChatInviteeMutation} from 'request/Message';
import {MessageContactItem} from 'components/Messages/MessageContactItem';
import Loader from 'components/Loader';
import {debounce} from 'lodash';
import {useIsFocused} from '@react-navigation/native';
type Props = NativeStackScreenProps<SignedInStackParamList, 'AllContacts'>;
export const AllContactScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const createGroupObj = {
    _id: '',
    name: t('messagePage:createNewGroup'),
    profileUrl: '',
    createdAt: '',
    updatedAt: '',
    role: '',
  };
  const [
    getChatInviteeList,
    {
      data: chatInviteeData,
      isSuccess: isChatInviteeSuccess,
      isLoading: isChatInviteeLoading,
    },
  ] = useGetChatInviteeMutation();
  const [searchOption, setSearchOption] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);
  const [refresh, setRefresh] = useState(false);
  const [chatInviteeList, setChatInviteeList] = useState<chatInviteeModal[]>(
    [],
  );
  const hasNextPage = useRef<boolean>(false);
  const isFocused = useIsFocused();
  const requestObj = useMemo(() => {
    return {
      pageNo: pageNo,
      searchText: searchText,
    };
  }, [searchText, pageNo]);
  useEffect(() => {
    if (requestObj && isFocused) {
      getChatInviteeList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj, isFocused]);

  useEffect(() => {
    if (isFocused) {
      setChatInviteeList([]);
      setPageNo(1);
    }
  }, [isFocused]);

  useEffect(() => {
    if (refresh) {
      setChatInviteeList([]);
      setPageNo(1);
      getChatInviteeList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, requestObj]);

  useEffect(() => {
    if (chatInviteeData && isChatInviteeSuccess) {
      const {nodes, pageInfo} = chatInviteeData.data;
      pageNo === 1
        ? setChatInviteeList(nodes)
        : setChatInviteeList(prev => prev.concat(nodes));
      hasNextPage.current = pageInfo.hasNextPage!;
      setRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatInviteeSuccess]);
  const renderLeftContainer = () => {
    return (
      <IconButton
        name="search"
        size={24}
        color={colors.black}
        onPress={() => setSearchOption(!searchOption)}
      />
      // <TouchableOpacity onPress={() => setSearchOption(!searchOption)}>
      //   <Icon name="search" size={24} color={colors.black} />
      // </TouchableOpacity>
    );
  };

  const onChange = (e: string) => {
    // just won't work, this callback is debounced
    setPageNo(1);
    setSearchText(e.trim());
  };
  const debouncedOnChange = debounce(onChange, 2000);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('messagePage:contacts')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {searchOption && (
        <Stack
          horizontal
          spacing={16}
          spaceBelow={16}
          style={styles.attachmentView}>
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
      )}
      <Stack spacing={16} spaceBelow={16}>
        <MessageContactItem
          item={createGroupObj}
          onPress={item => {
            console.log('break should remove:', item.name);
            props.navigation.replace('CreateGroup');
          }}
        />
        <MessageContactList
          data={chatInviteeList}
          onPress={item =>
            props.navigation.navigate('ChattingScreen', {
              type: 'People',
              data: item,
              isCreateScreen: !item.chatId,
              isShortKey: true,
            })
          }
          onRefresh={() => {
            setRefresh(true);
            setPageNo(1);
          }}
          onScrollHandler={scrollHandler}
          currentPageNo={pageNo}
          pageNo={() => {
            if (chatInviteeData?.data.pageInfo.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isLoading={pageNo > 1 && isChatInviteeLoading}
        />
      </Stack>
      {isChatInviteeLoading && pageNo === 1 && <Loader />}
    </Container>
  );
};
