import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {GroupAddMembersList} from 'components/Messages/Group/GroupAddMembersList';
import {GroupAddedMembersList} from 'components/Messages/Group/GroupAddedMembersList';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {chatInviteeModal, useGetChatInviteeMutation} from 'request/Message';
import {debounce} from 'lodash';
export interface groupProps {
  id: number;
  name: string;
  image?: string;
}
type Props = NativeStackScreenProps<SignedInStackParamList, 'CreateGroup'>;
export const CreateGroupScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [searchOption, setSearchOption] = useState<boolean>(false);

  // const groupArray: groupProps[] = [
  //   {id: 1, name: 'Leslie Alexander', image: 'https://picsum.photos/200/300'},
  //   {id: 2, name: 'Prathamesh Joshi'},
  //   {id: 3, name: 'Nabendu Paul', image: 'https://picsum.photos/200/300'},
  //   {id: 4, name: 'Leslie Alexander', image: 'https://picsum.photos/200/300'},
  //   {id: 5, name: 'Prathamesh Joshi'},
  //   {id: 6, name: 'Nabendu Paul', image: 'https://picsum.photos/200/300'},
  //   {id: 7, name: 'Leslie Alexander', image: 'https://picsum.photos/200/300'},
  //   {id: 8, name: 'Prathamesh Joshi'},
  //   {id: 9, name: 'Nabendu Paul', image: 'https://picsum.photos/200/300'},
  //   {id: 10, name: 'Leslie Alexander', image: 'https://picsum.photos/200/300'},
  //   {id: 11, name: 'Prathamesh Joshi'},
  //   {id: 12, name: 'Nabendu Paul', image: 'https://picsum.photos/200/300'},
  // ];
  const [selectedMemberArray, setSelectedMemberArray] = useState<
    chatInviteeModal[] | undefined
  >([]);
  const [searchText, setSearchText] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [chatInviteeList, setChatInviteeList] = useState<chatInviteeModal[]>(
    [],
  );
  useEffect(() => {
    setSelectedMemberArray([]);
  }, []);

  const hasNextPage = useRef<boolean>(false);
  const requestObj = useMemo(() => {
    return {
      pageNo: pageNumber,
      searchText: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, pageNumber]);
  const [
    getChatInviteeList,
    {
      data: chatInviteeData,
      isSuccess: isChatInviteeSuccess,
      isLoading: isChatInviteeLoading,
    },
  ] = useGetChatInviteeMutation();

  useEffect(() => {
    if (requestObj) {
      getChatInviteeList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);

  useEffect(() => {
    if (chatInviteeData && isChatInviteeSuccess) {
      const {nodes, pageInfo} = chatInviteeData.data;
      pageNumber === 1
        ? setChatInviteeList(nodes)
        : setChatInviteeList(prev => prev.concat(nodes));
      hasNextPage.current = pageInfo.hasNextPage!;
      setIsRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChatInviteeSuccess]);

  const updateSelectedList = (item: chatInviteeModal) => {
    const position = selectedMemberArray!.findIndex(
      row => row._id === item._id,
    );
    let tempArray = [...selectedMemberArray!];
    if (position === -1) {
      tempArray.push(item);
    } else {
      tempArray.splice(position!, 1);
    }
    setSelectedMemberArray(tempArray);
  };

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
    setSearchText(e.trim());
    setPageNumber(1);
  };
  const debouncedOnChange = debounce(onChange, 500);
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('group:createGroup')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {searchOption && (
        <Stack
          horizontal
          // spacing={16}
          spaceBelow={16}
          style={styles.attachmentView}>
          <SearchTextField
            pattern1={/[]/}
            pattern2={
              /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
            }
            onSearchChange={val => {
              debouncedOnChange(val);
            }}
            isForCreateGroup
          />
        </Stack>
      )}
      <Stack spacing={22} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.small}
          truncate
          style={styles.rtlText}>
          {t('group:addMember')}
        </TextView>
      </Stack>
      <Stack spacing={10} spaceBelow={16}>
        <GroupAddedMembersList
          data={selectedMemberArray!}
          onPress={updateSelectedList}
        />
      </Stack>
      <Stack style={styles.horizontalLine}>
        <Divider />
      </Stack>

      <Stack spaceBelow={16} spacing={10}>
        <GroupAddMembersList
          data={chatInviteeList}
          onScrollHandler={scrollHandler}
          selectedMemberArray={selectedMemberArray!}
          onPress={updateSelectedList}
          refreshing={isRefresh}
          isLoading={isChatInviteeLoading}
          // onEndReach={() =>
          //   hasNextPage.current &&
          //   !isChatInviteeLoading &&
          //   setPageNumber(pageNumber + 1)
          // }
          pageNo={() => {
            if (chatInviteeData?.data.pageInfo.hasNextPage) {
              setPageNumber(prev => prev + 1);
            }
          }}
          getRefresh={() => {
            setPageNumber(1);
            setIsRefresh(true);
          }}
          currentPageNo={pageNumber}
        />
      </Stack>
      <FloatingButton
        name={'long_arrow_right'}
        isButtonDisabled={selectedMemberArray?.length! > 1 ? false : true}
        onPress={() => {
          props.navigation.navigate('AddGroupName', {
            selectedMemberList: selectedMemberArray,
          });
        }}
      />
      {isChatInviteeLoading && pageNumber === 1 && <Loader />}
    </Container>
  );
};

const styles = StyleSheet.create({
  horizontalLine: {
    marginBottom: 10,
  },
  attachmentView: {
    marginBottom: 16,
    borderRadius: 3,
  },
  attachmentIcon: {
    justifyContent: 'center',
    marginLeft: 10,
  },
  rtlText: {textAlign: 'left'},
});
