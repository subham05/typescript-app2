import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {IconButton} from 'components/IconButtons';
import {GroupAddMembersList} from 'components/Messages/Group/GroupAddMembersList';
import {GroupAddedMembersList} from 'components/Messages/Group/GroupAddedMembersList';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useAddGroupMemberMutation,
  useGroupInviteListMutation,
} from 'request/Message';
import {addGroupMemberModal, inviteList} from 'request/Message/constants';
import {pageInfo} from 'screens/Contacts';
import {Styles} from './index.styles';
import Loader from 'components/Loader';
export interface groupProps {
  id: number;
  name: string;
  image?: string;
}
type Props = NativeStackScreenProps<SignedInStackParamList, 'AddMember'>;
export const AddMemberScreen = (props: Props) => {
  const {t} = useTranslation();
  const {groupId} = props.route.params;

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [searchOption, setSearchOption] = useState<boolean>(false);

  const [getInviteList, {data, isSuccess, isLoading}] =
    useGroupInviteListMutation();

  const [
    addMembers,
    {
      data: addMemberData,
      isSuccess: addMemberSuccess,
      isLoading: addMemberLoading,
    },
  ] = useAddGroupMemberMutation();

  const [inviteRecords, setInviteRecords] = useState<inviteList[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [pages, setPages] = useState<pageInfo>();
  const [pageNo, setPageNo] = useState<number>(1);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const [selectedMemberArray, setSelectedMemberArray] = useState<inviteList[]>(
    [],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const updateSelectedList = (item: inviteList) => {
    const position = selectedMemberArray.findIndex(row => row._id === item._id);
    let tempArray = [...selectedMemberArray];
    let idArray = [...selectedIds];
    if (position === -1) {
      tempArray.push(item);
      idArray.push(item._id);
    } else {
      tempArray.splice(position, 1);
      idArray.splice(position, 1);
    }
    setSelectedMemberArray(tempArray);
    setSelectedIds(idArray);
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

  const bodyObj = useMemo(() => {
    return {
      groupId: groupId,
      pageNo: pageNo,
      searchText: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, searchText]);

  useEffect(() => {
    getInviteList(bodyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj]);

  useEffect(() => {
    if (data && isSuccess) {
      setInviteRecords(prev => prev.concat(data.data.nodes));
      setPages(data.data.pageInfo);
      setIsRefresh(false);
    }
  }, [data, isSuccess]);

  const onEndReached = () => {
    if (pages?.hasNextPage && !isLoading) {
      setPageNo((prev: number) => prev + 1);
    }
  };

  useEffect(() => {
    if (isRefresh) {
      getInviteList(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRefresh]);

  useEffect(() => {
    setPageNo(1);
    setInviteRecords([]);
  }, [searchText]);

  const addMembersToGroup = () => {
    const body: addGroupMemberModal = {
      groupId: groupId,
      body: {
        users: selectedIds,
      },
    };
    addMembers(body);
  };

  useEffect(() => {
    if (addMemberData && addMemberSuccess) {
      showToast(addMemberData.message);
      props.navigation.goBack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addMemberData, addMemberSuccess]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('group:contacts')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {isLoading && pageNo === 1 && <Loader />}
      {searchOption && (
        <Stack
          horizontal
          spacing={16}
          spaceBelow={16}
          style={styles.attachmentView}>
          <SearchTextField
            onSearchChange={text => {
              setSearchText(text);
              Keyboard.dismiss();
            }}
            value={searchText}
            pattern1={/[]/}
            pattern2={
              /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
            }
          />
        </Stack>
      )}
      <Stack spacing={20} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.spacing}>
          {t('group:addMember')}
        </TextView>
        <GroupAddedMembersList
          data={selectedMemberArray}
          onPress={updateSelectedList}
        />
        <Divider size={2} color={colors.grey_008} />
      </Stack>

      <Stack spacing={10} spaceBelow={16}>
        <GroupAddMembersList
          data={inviteRecords}
          selectedMemberArray={selectedMemberArray}
          onPress={updateSelectedList}
          pageNo={onEndReached}
          onScrollHandler={scrollHandler}
          isLoading={isLoading || addMemberLoading}
          refreshing={isRefresh}
          getRefresh={() => {
            setPageNo(1);
            setInviteRecords([]);
            setIsRefresh(true);
          }}
          currentPageNo={pageNo}
        />
      </Stack>

      {!!selectedMemberArray.length && (
        <Stack style={styles.floatingButton}>
          <FloatingButton
            name="done"
            onPress={() => addMembersToGroup()}
            styles={styles.floatingIcon}
            size={35}
          />
        </Stack>
      )}
    </Container>
  );
};
