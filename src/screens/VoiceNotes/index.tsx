import {useFocusEffect} from '@react-navigation/native';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Keyboard, StyleSheet, TouchableOpacity} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {
  useGetSharedWithMeVoiceListMutation,
  useLazyGetVoiceNoteListQuery,
} from 'request/VoiceNote';
import {voiceNoteData} from './components/VoiceNotesItem';
import {VoiceNotesList} from './components/VoiceNotesList';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {VoiceNotesStrings} from './constants';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';

export type VoiceNoteProps = DrawerScreenProps<
  DrawerNavParamList,
  'VoiceNotes'
>;

export const VoiceNotesScreen = (props: VoiceNoteProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const [getMyVoiceList, {data, isSuccess, isFetching, isLoading, isError}] =
    useLazyGetVoiceNoteListQuery();

  const [
    getSharedList,
    {
      data: voiceNoteShareData,
      isSuccess: isSuccessVoiceNoteShare,
      isLoading: isLoadingVoiceNoteShare,
    },
  ] = useGetSharedWithMeVoiceListMutation();

  const [selectedOption, setSelectedOption] = useState<string>(
    VoiceNotesStrings.my,
  );
  const [myVoiceNoteList, setMyVoiceNoteList] = useState<voiceNoteData[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageNumberShare, setPageNumberShare] = useState(1);
  const [searchText, setSearchText] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const lastVoiceListPage = useRef<number>(1);
  const isRefreshing = useRef<boolean>(false);
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [onRefresh, setOnRefresh] = useState(false);
  const [shareVoiceNoteList, setShareVoiceNoteList] = useState<voiceNoteData[]>(
    [],
  );
  const [selectedFilter, setSelectedFilter] = useState<string>(
    VoiceNotesStrings.own,
  );
  // const [sharedByMe, setSharedByMe] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      if (props?.route?.params?.sharedWithMe) {
        setSelectedOption(VoiceNotesStrings.shared);
        setShareVoiceNoteList([]);
        getSharedList({
          pageNo: 1,
          searchText: searchText.trim(),
        });
      }
      return () => {
        setSelectedOption(VoiceNotesStrings.my);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.route?.params?.sharedWithMe]),
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedOption === VoiceNotesStrings.my) {
        pageNumber === 1 && setLoader(true);
        getMyVoiceList({
          pageNo: pageNumber,
          searchValue: searchText.trim(),
          type: selectedFilter,
        }).then(() => setLoader(false));
      } else if (selectedOption === VoiceNotesStrings.shared) {
        setLoader(true);
        getSharedList({
          pageNo: pageNumberShare,
          searchText: searchText.trim(),
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      pageNumber,
      searchText,
      stateUpdater,
      selectedOption,
      pageNumberShare,
      selectedFilter,
    ]),
  );

  useEffect(() => {
    setShareVoiceNoteList([]);
    setPageNumberShare(1);
  }, [searchText]);

  useEffect(() => {
    setLoader(false);
  }, [myVoiceNoteList, shareVoiceNoteList]);

  //** Shared with me voice note listing */
  useEffect(() => {
    if (isError) {
      isRefreshing.current = false;
      setLoader(false);
    } else if (
      selectedOption === VoiceNotesStrings.shared &&
      isSuccessVoiceNoteShare &&
      voiceNoteShareData?.data?.nodes.length
    ) {
      setShareVoiceNoteList(prev =>
        prev.concat(voiceNoteShareData?.data?.nodes),
      );
    }
    setOnRefresh(false);
    setLoader(false);
    isRefreshing.current = false;
  }, [voiceNoteShareData, selectedOption, isError, isSuccessVoiceNoteShare]);

  useEffect(() => {
    setPageNumber(1);
    setPageNumberShare(1);
    setShareVoiceNoteList([]);
    setMyVoiceNoteList([]);
  }, [selectedOption]);

  //** My voice note listing */
  useEffect(() => {
    if (isError) {
      isRefreshing.current = false;
      setLoader(false);
    }
    if (isSuccess && data?.nodes?.length) {
      const temp =
        pageNumber === 1 ? data?.nodes! : myVoiceNoteList.concat(data?.nodes!);

      setMyVoiceNoteList(temp);
      lastVoiceListPage.current = data?.pageInfo.lastPageNo!;
    }
    isRefreshing.current = false;
    setOnRefresh(false);
    setLoader(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isError, selectedOption]);

  useEffect(() => {
    if (onRefresh) {
      if (selectedOption === VoiceNotesStrings.my) {
        pageNumber === 1 && setLoader(true);
        getMyVoiceList({
          pageNo: pageNumber,
          searchValue: searchText.trim(),
          type: selectedFilter,
        })
          .then(() => {
            setLoader(false);
            setOnRefresh(false);
          })
          .catch(e => console.log(e));
        isRefreshing.current = false;
      } else if (selectedOption === VoiceNotesStrings.shared) {
        pageNumberShare === 1 && setLoader(true);
        getSharedList({
          pageNo: pageNumberShare,
          searchText: searchText.trim(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  const onDeleteVoiceNote = (
    selectedId?: string,
    isEdit?: boolean,
    voiceTitle?: string,
  ) => {
    if (pageNumber !== 1) {
      const getIdx = myVoiceNoteList.findIndex(item => item._id === selectedId);
      if (getIdx !== -1) {
        isEdit && selectedId && voiceTitle
          ? (myVoiceNoteList[getIdx].title = voiceTitle)
          : myVoiceNoteList.splice(getIdx, 1);

        setMyVoiceNoteList([...myVoiceNoteList]);
      }
    } else {
      setStateUpdater(!stateUpdater);
    }
  };
  const getMoreList = () => {
    if (
      selectedOption === VoiceNotesStrings.my &&
      lastVoiceListPage.current > pageNumber
    ) {
      !isFetching &&
        myVoiceNoteList.length >= 10 &&
        setPageNumber(pageNumber + 1);
    } else if (
      selectedOption === VoiceNotesStrings.shared &&
      voiceNoteShareData?.data?.pageInfo?.hasNextPage
    ) {
      setPageNumberShare(prev => prev + 1);
    }
  };
  const getRefresh = () => {
    if (selectedOption === VoiceNotesStrings.my) {
      setPageNumber(1);
    } else if (selectedOption === VoiceNotesStrings.shared) {
      setShareVoiceNoteList([]); //
      setPageNumberShare(1);
    }
    setOnRefresh(true);
    isRefreshing.current = true;
  };
  const menuDataPrivate: MenuModel[] = [
    {
      name: t('voiceNotes:createdByOwn'),
      onClick: () => {
        setSelectedFilter(VoiceNotesStrings.own);
        setPageNumber(1);
      },
      rowStyle: {
        backgroundColor:
          selectedFilter === VoiceNotesStrings.own
            ? colors.grey_006
            : 'transparent',
      },
    },
    {
      name: t('voiceNotes:createdByPA'),
      onClick: () => {
        setSelectedFilter(VoiceNotesStrings.pa);
        setPageNumber(1);
      },
      rowStyle: {
        backgroundColor:
          selectedFilter === VoiceNotesStrings.pa
            ? colors.grey_006
            : 'transparent',
      },
    },
  ];
  const renderLeftContainer = () => {
    return <PopupMenu data={menuDataPrivate} height={100} width={140} />;
  };
  return (
    <Container noSpacing onRetry={() => setStateUpdater(!stateUpdater)}>
      <Header
        // navigationType="STACK"
        label={t('voiceNotes:head')}
        translateY={translateY}
        RenderLeftContainer={
          selectedOption === VoiceNotesStrings.my
            ? renderLeftContainer
            : undefined
        }
      />
      <Stack
        spacing={26}
        horizontal
        horizontalAlign="space-between"
        style={styles.contactView}>
        <TouchableOpacity
          style={
            selectedOption === VoiceNotesStrings.my
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            Keyboard.dismiss();
            setMyVoiceNoteList([]);
            setSelectedOption(VoiceNotesStrings.my);
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('voiceNotes:myVoiceNotes')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedOption === VoiceNotesStrings.shared
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            Keyboard.dismiss();
            setMyVoiceNoteList([]);
            setSelectedOption(VoiceNotesStrings.shared);
          }}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('voiceNotes:sharedWithMe')}
          </TextView>
        </TouchableOpacity>
      </Stack>
      <StackItem>
        <Stack
          horizontal
          spacing={16}
          spaceBelow={16}
          style={styles.attachmentView}>
          <SearchTextField
            onSearchChange={value => {
              setPageNumber(1);
              setSearchText(value);
            }}
            pattern1={searchPattern1}
            pattern2={searchPattern2}
            // selectedContact={selectedOption}
          />
        </Stack>

        <VoiceNotesList
          VoiceListData={
            selectedOption === VoiceNotesStrings.my
              ? myVoiceNoteList
              : shareVoiceNoteList
          }
          shareDataLength={voiceNoteShareData?.data?.nodes?.length!}
          myVoiceSuccess={isSuccess}
          shareVoiceSuccess={isSuccessVoiceNoteShare}
          selectedOption={selectedOption}
          searchText={searchText}
          isLoadingList={isLoading || loader}
          isFetching={isFetching}
          refreshing={isRefreshing.current}
          pageNumber={pageNumber}
          getRefresh={getRefresh}
          getMoreList={getMoreList}
          onDelete={(selectedId, isEdit, voiceTitle) => {
            onDeleteVoiceNote(selectedId, isEdit, voiceTitle);
          }}
          onAccessLogsPress={itemId =>
            props.navigation.navigate('AccessLogs', {voiceNoteId: itemId!})
          }
          onSharePress={itemId =>
            props.navigation.navigate('InviteMember', {
              edit: false,
              isShare: true,
              documentId: itemId,
              isShareVoice: true,
            })
          }
          onSetReminderPress={itemId => {
            props.navigation.navigate('Reminder', {
              voiceNotes: true,
              voiceNoteData: itemId,
            });
          }}
        />
        {/* )} */}
      </StackItem>
      {pageNumberShare === 1 && isLoadingVoiceNoteShare && <Loader />}
    </Container>
  );
};

const styles = StyleSheet.create({
  contactView: {
    marginLeft: 42,
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
  sharedByMeContainer: {marginHorizontal: 23},
  sharedByMeText: {
    color: colors.primary_002,
    paddingHorizontal: 10,
  },
  attachmentView: {
    marginVertical: 16,
    marginRight: 16,
    borderRadius: 3,
  },
});
