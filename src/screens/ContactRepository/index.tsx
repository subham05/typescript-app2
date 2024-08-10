/* eslint-disable react-hooks/rules-of-hooks */
import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack} from 'components/Stack';
import {ToolTip} from 'components/Tooltip';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {BackHandler, Keyboard, TouchableOpacity} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {
  useGetShareWithMeContactsMutation,
  // ContactRepositoryData,
  // getContactModal,
  useLazyGetPrivateContactListQuery,
  useLazyGetPublicContactListQuery,
} from 'request/ContactRepository';
import {ContactModal, ContactModalSort} from 'screens/Contacts';
import {shareContactData} from 'screens/CreateContact/types';
import {useAppSelector} from 'store/hooks';
import {StaffSubmenuModal} from 'store/Reducer';
import {BottomOptions} from './components/BottomOptions';
import {BottomPanel} from './components/BottomPanel';
import {FABBottomPanel} from './components/FABBottomPanel';
import {ContactRepositoryHeader} from './components/Header';
import {PrivateContactRepositoryList} from './components/PrivateContactRepositoryList';
import {PublicContactRepositoryList} from './components/PublicContactRepositoryList';
import RequestContact from './components/RequestContact';
import {SharedContactRepositoryList} from './components/SharedContactRepositoryList';
import {Styles} from './index.styles';
// import {StackActions} from '@react-navigation/native';

// type Props = NativeStackScreenProps<
//   SignedInStackParamList,
//   'PublicContactRepository'
// >;

export enum ShareFilterOptions {
  shareWithMe = 'SHAREWITHME',
  shareByMe = 'SHAREBYME',
  shareWithMeReq = 'shareWithMe',
  shareByMeREq = 'shareByhMe',
  shared = 'Shared',
}

export type Props = CompositeScreenProps<
  NativeStackScreenProps<SignedInStackParamList, 'PublicContactRepository'>,
  DrawerScreenProps<DrawerNavParamList, 'BottomTabs'>
>;

export const ContactRepositoryScreen = (props: Props) => {
  const {t} = useTranslation();
  const styles = Styles();
  const translateY = useSharedValue(0);
  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });
  const {params} = props.route;
  AsyncStorage.getItem(STR_KEYS.TOOLTIP_CONTACT_SEEN).then(res => {
    setTooltipSeen(res);
  });

  const [selectedContact, setSelectedContact] = useState<string>(
    params?.isShareNotification ? t('contacts:Shared') : t('contacts:private'),
  );
  const [isLongSelectCount, setIsLongSelectCount] = useState<number>(0);
  const [tooltipSeen, setTooltipSeen] = useState<string | null>('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[] | []>([]);
  /***********************************************************************PUBLIC AND PRIVATE STATE START ***************************************************************** */
  const [userType, setUserType] = useState<string | null | undefined>('');
  const [privateContactListArray, setPrivateContactListArray] = useState<
    ContactModal[]
  >([]);
  const [publicContactListArray, setPublicContactListArray] = useState<
    ContactModal[]
  >([]);
  const [privateContactListArraySorted, setPrivateContactListArraySorted] =
    useState<ContactModal[]>([]);
  const [publicContactListArraySorted, setPublicContactListArraySorted] =
    useState<ContactModal[]>([]);
  const [privateLastPage, setPrivateLastPage] = useState<number>(1);
  const [publicLastPage, setPublicLastPage] = useState<number>(1);
  const [privatePageCount, setPrivatePageCount] = useState<number>(1);
  const [sharedPageCount, setSharedPageCount] = useState<number>(1);
  const [publicPageCount, setPublicPageCount] = useState<number>(1);
  const [prePublic, setPrePublic] = useState<number>(0);
  const [prePrivate, setPrePrivate] = useState<number>(0);
  const [markAsPrivate, setMarkAsPrivate] = useState<boolean>(false);
  const [markAsPublic, setMarkAsPublic] = useState<boolean>(false);
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [privateRefresh, setPrivateRefresh] = useState<boolean>(false);
  const [publicRefresh, setPublicRefresh] = useState<boolean>(false);
  const [isSortingEnabledPublic, setIsSortingEnabledPublic] =
    useState<boolean>(false);
  const [isSortingEnabledPrivate, setIsSortingEnabledPrivate] =
    useState<boolean>(false);
  const [isSortingEnabledShared, setIsSortingEnabledShared] =
    useState<boolean>(false);
  const [isPanelActive, setIsPanelActive] = useState<boolean>(false);
  const [isFABPanelActive, setIsFABPanelActive] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');
  const [sortByPublic, setSortByPublic] = useState<string>('');
  const [sortByPrivate, setSortByPrivate] = useState<string>('');
  const [sortByShared, setSortByShared] = useState<string>('');
  const [staffMenuList, setStaffMenuList] = useState<StaffSubmenuModal[] | []>(
    [],
  );
  const [sharedStaffMenuList, setSharedStaffMenuList] = useState<
    StaffSubmenuModal[] | []
  >([]);
  const [shareWithMeList, setShareWithMeList] = useState<shareContactData[]>(
    [],
  );
  const [sharePageNumber, setSharePageNumber] = useState<number>(1);
  const [shareRefresh, setShareRefresh] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);
  const sharePageInfo = useRef<boolean>(false);
  const {companyId} = useAppSelector(state => state?.formanagement);

  useFocusEffect(
    useCallback(() => {
      setIsLongSelectCount(0);
      setSelectedItemIds([]);
    }, []),
  );

  /***********************************************************************PUBLIC AND PRIVATE STATE END ***************************************************************** */
  /***********************************************************************PUBLIC AND PRIVATE HOOKS CALL START ***************************************************************** */
  const [
    getPrivateOrPublicList,
    {currentData, isLoading, isFetching, error, isError, isSuccess},
  ] =
    selectedContact === 'Private'
      ? useLazyGetPrivateContactListQuery()
      : useLazyGetPublicContactListQuery();
  const [
    getShareWithMeList,
    {
      data: shareData,
      isLoading: isShareWithLoading,
      isSuccess: isShareWithSuccess,
      // isError: isShareWithError,
      // error: shareWithError,
    },
  ] = useGetShareWithMeContactsMutation();
  useEffect(() => {
    if (selectedContact === 'Private' && privatePageCount !== prePrivate) {
      getPrivateOrPublicList({
        searchValue: searchText,
        pageNo: privatePageCount,
        contactType: 'PRIVATE', //Called Private ContactList
        isSortingEnabled: isSortingEnabledPrivate,
        sortBy: sortByPrivate,
      });
      privatePageCount === 1 && prePrivate === 0 && setPrivateRefresh(false);
    } else if (
      selectedContact === 'Public' &&
      (publicPageCount !== prePublic || searchText)
    ) {
      getPrivateOrPublicList({
        searchValue: searchText,
        pageNo: publicPageCount,
        contactType: 'PUBLIC', //Called Public ContactList
        isSortingEnabled: isSortingEnabledPublic,
        sortBy: sortByPublic,
        companyId: companyId.length <= 1 ? companyId![0]?._id : undefined,
      });
      publicPageCount === 1 && prePublic === 0 && setPublicRefresh(false);
    }
    return () => {
      setMarkAsPrivate(false);
      setMarkAsPublic(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    privatePageCount,
    selectedContact,
    markAsPublic,
    searchText,
    stateUpdater,
    publicPageCount,
    markAsPrivate,
  ]);
  /***************************************************************Share with me API call *******************************************************************/
  const requestObj = useMemo(() => {
    return {
      searchValue: searchText,
      pageNo: sharePageNumber,
      sharedContactFilter:
        sortByShared === ShareFilterOptions.shareWithMe
          ? ShareFilterOptions.shareWithMeReq
          : sortByShared === ShareFilterOptions.shareByMe
          ? ShareFilterOptions.shareByMe
          : '',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    sharePageNumber,
    searchText,
    selectedContact,
    shareRefresh,
    sortByShared,
  ]);
  useEffect(() => {
    if (
      isShareWithSuccess &&
      shareData &&
      selectedContact === t('contacts:Shared')
    ) {
      const {nodes, pageInfo} = shareData;
      sharePageNumber === 1
        ? setShareWithMeList(nodes as shareContactData[])
        : setShareWithMeList(prev => prev.concat(nodes as shareContactData[]));
      sharePageInfo.current = pageInfo.hasNextPage!;
      setShareRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShareWithSuccess]);
  useEffect(() => {
    if (selectedContact === t('contacts:Shared')) {
      getShareWithMeList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);
  /***************************************************************Share with me API call end *******************************************************************/
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
    getStaffOptions();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _handleBackPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getStaffOptions = async () => {
    let staffList: any = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    let staffListTemp: any;
    let sharedStaffListTemp: any;
    staffList = JSON.parse(staffList);
    staffListTemp = staffList?.contact;
    sharedStaffListTemp = staffList?.sharedContact;
    setStaffMenuList(staffListTemp);
    setSharedStaffMenuList(sharedStaffListTemp);
  };
  const _handleBackPress = () => {
    props.navigation.navigate('BottomTabs');
    return true;
  };
  /***********************************************************************PUBLIC AND PRIVATE HOOKS CALL END ***************************************************************** */
  const openPanel = () => setIsPanelActive(true);
  const closePanel = () => setIsPanelActive(false);
  const openFABPanel = () => setIsFABPanelActive(true);
  const closeFABPanel = () => setIsFABPanelActive(false);
  /***********************************************************************PUBLIC AND PRIVATE API CALL START ***************************************************************** */
  useEffect(() => {
    selectedContact === 'Private'
      ? privatePageCount === 1 && setPrivateContactListArraySorted([])
      : publicPageCount === 1 && setPublicContactListArraySorted([]);
    if (error && isError) {
      const err: any = error;
      err?.error ? showToast(err.error) : showToast(err?.data?.error[0]?.msg);
    }
    if (
      currentData?.nodes &&
      selectedContact === 'Private' &&
      (privatePageCount !== prePrivate || privatePageCount === 1)
    ) {
      const {nodes, pageInfo} = currentData;
      const contactTempArray =
        privatePageCount !== 1
          ? isSortingEnabledPrivate
            ? nodes
            : privateContactListArray.concat(nodes as ContactModal[])
          : nodes;
      if (isSortingEnabledPrivate) {
        let sortedContactArrayTemp: ContactModal[] =
          privateContactListArraySorted;
        contactTempArray.map(item => {
          const {contacts} = item as ContactModalSort;
          contacts.map(contact => sortedContactArrayTemp.push(contact));
        });
        setPrivateContactListArraySorted(sortedContactArrayTemp);
      } else {
        setPrivateContactListArray(contactTempArray as ContactModal[]);
      }
      setPrivateLastPage(pageInfo.lastPageNo);
      setPrePrivate(privatePageCount);
      setMarkAsPublic(false);
      setPrivateRefresh(false);
    } else if (
      currentData?.nodes &&
      selectedContact === 'Public' &&
      (publicPageCount !== prePublic || publicPageCount === 1)
    ) {
      const {nodes, pageInfo} = currentData;
      let contactTempArray =
        publicPageCount !== 1
          ? isSortingEnabledPublic
            ? nodes
            : publicContactListArray.concat(nodes as ContactModal[])
          : nodes;
      if (isSortingEnabledPublic) {
        let sortedContactArrayTemp: ContactModal[] =
          publicContactListArraySorted;
        contactTempArray.map(item => {
          const {contacts} = item as ContactModalSort;
          contacts.map(contact => sortedContactArrayTemp.push(contact));
        });
        setPublicContactListArraySorted(sortedContactArrayTemp);
      } else {
        setPublicContactListArray(contactTempArray as ContactModal[]);
      }
      setPublicLastPage(pageInfo.lastPageNo);
      setPrePublic(publicPageCount);
      setMarkAsPrivate(false);
      setPublicRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData, error]);
  /***********************************************************************PUBLIC AND PRIVATE API CALL END ***************************************************************** */
  const onPrivateClick = () => {
    setPrePublic(0);
    setPublicPageCount(1);
    setMarkAsPrivate(true);
  };
  const onPublicClick = () => {
    setPrePrivate(0);
    setPrivatePageCount(1);
    setMarkAsPublic(true);
    selectedContact === 'Private'
      ? privatePageCount === 1 && prePrivate === 0 && setPrivateRefresh(false)
      : publicPageCount === 1 && prePublic === 0 && setPublicRefresh(false);
  };
  const onMarkPublicClick = (selectedItem: string) => {
    if (privatePageCount !== 1 || isSortingEnabledPrivate) {
      const getIdx = (
        isSortingEnabledPrivate
          ? privateContactListArraySorted
          : privateContactListArray
      ).findIndex(item => item._id === selectedItem);
      if (getIdx !== -1) {
        (isSortingEnabledPrivate
          ? privateContactListArraySorted
          : privateContactListArray
        ).splice(getIdx, 1);
        isSortingEnabledPrivate
          ? setPrivateContactListArraySorted([...privateContactListArraySorted])
          : setPrivateContactListArray([...privateContactListArray]);
      }
    } else {
      onPublicClick();
    }
  };

  const onMarkPrivateClick = (selectedItem: string) => {
    if (publicPageCount !== 1 || isSortingEnabledPublic) {
      const getIdx = (
        isSortingEnabledPublic
          ? publicContactListArraySorted
          : publicContactListArray
      ).findIndex(item => item._id === selectedItem);
      if (getIdx !== -1) {
        (isSortingEnabledPublic
          ? publicContactListArraySorted
          : publicContactListArray
        ).splice(getIdx, 1);
        isSortingEnabledPublic
          ? setPublicContactListArraySorted([...publicContactListArraySorted])
          : setPublicContactListArray([...publicContactListArray]);
      }
    } else {
      onPrivateClick();
    }
  };
  const getOptions = (user: string) => {
    const companies: string[] = [];
    companyId.length > 0 &&
      companyId.map(companys => companies.push(companys._id));
    switch (user) {
      case userTypes.Owner.toUpperCase():
        return {
          name: t('drawer:owner'),
          onClick: () =>
            props.navigation.navigate('FilteredContactList', {
              role: userTypes.Owner.toUpperCase(),
              companyId: companies,
              staffMenuList:
                selectedContact === t('contacts:Shared')
                  ? sharedStaffMenuList
                  : staffMenuList,
              type: selectedContact,
            }),
        };
      case userTypes.persoalAssistant:
        return {
          name: t('drawer:personalAssistant'),
          onClick: () =>
            props.navigation.navigate('FilteredContactList', {
              role: userTypes.persoalAssistant,
              companyId: companies,
              staffMenuList:
                selectedContact === t('contacts:Shared')
                  ? sharedStaffMenuList
                  : staffMenuList,
              type: selectedContact,
            }),
        };
      case userTypes.GeneralManager:
        return {
          name: t('drawer:generalManager'),
          onClick: () =>
            props.navigation.navigate('FilteredContactList', {
              role: userTypes.GeneralManager,
              companyId: companies,
              staffMenuList:
                selectedContact === t('contacts:Shared')
                  ? sharedStaffMenuList
                  : staffMenuList,
              type: selectedContact,
            }),
        };
      case userTypes.Manager.toUpperCase():
        return {
          name: t('drawer:manager'),
          onClick: () =>
            props.navigation.navigate('FilteredContactList', {
              role: userTypes.Manager.toUpperCase(),
              companyId: companies,
              staffMenuList:
                selectedContact === t('contacts:Shared')
                  ? sharedStaffMenuList
                  : staffMenuList,
              type: selectedContact,
            }),
        };
      case userTypes.Employee.toUpperCase():
        return {
          name: t('drawer:employee'),
          onClick: () =>
            props.navigation.navigate('FilteredContactList', {
              role: userTypes.Employee.toUpperCase(),
              companyId: companies,
              staffMenuList:
                selectedContact === t('contacts:Shared')
                  ? sharedStaffMenuList
                  : staffMenuList,
              type: selectedContact,
            }),
        };
      default:
        return {
          name: '',
          onClick: () => {},
        };
    }
  };
  const menuDataPrivate: MenuModel[] = staffMenuList?.map(
    (item: StaffSubmenuModal) => getOptions(item.user),
  );
  const menuDataShared: MenuModel[] = sharedStaffMenuList?.map(
    (item: StaffSubmenuModal) => getOptions(item.user),
  );
  const onClickOfSort = (sortType: string) => {
    if (selectedContact === 'Private') {
      sortType !== sortByPrivate && onClear(true);
      setIsSortingEnabledPrivate(true);
      setSortByPrivate(sortType);
      onPublicClick();
    } else {
      sortType !== sortByPublic && onClear(true);
      setIsSortingEnabledPublic(true);
      setSortByPublic(sortType);
      onPrivateClick();
    }
  };
  const onClear = (clear?: boolean) => {
    if (selectedContact === 'Private') {
      if (privatePageCount !== 1 || clear) {
        setPrivateContactListArraySorted([]);
        setPrivatePageCount(1);
        setPrePrivate(0);
        setSortByPrivate('');
      }
      setIsSortingEnabledPrivate(false);
    } else {
      if (publicPageCount !== 1 || clear) {
        setPublicContactListArraySorted([]);
        setPublicPageCount(1);
        setPrePublic(0);
        setSortByPublic('');
      }
      setIsSortingEnabledPublic(false);
    }
  };

  const onClickOfSharedSort = (sortType: string) => {
    setIsSortingEnabledShared(true);
    setSortByShared(sortType);
    // onPublicClick();
  };
  const onSharedClear = () => {
    if (sharedPageCount !== 1) {
      setSharedPageCount(1);
    }
    setSortByShared('');
    setIsSortingEnabledShared(false);
  };
  const getHighlight = (value = '') => {
    return (selectedContact === 'Private' &&
      isSortingEnabledPrivate &&
      sortByPrivate === value) ||
      (selectedContact === 'Public' &&
        isSortingEnabledPublic &&
        sortByPublic === value)
      ? {backgroundColor: colors.grey_002}
      : undefined;
  };
  const getHighlightShared = (value = '') => {
    return selectedContact === 'Shared' &&
      isSortingEnabledShared &&
      sortByShared === value
      ? {backgroundColor: colors.grey_002}
      : undefined;
  };
  const menuDataFilter: MenuModel[] = [
    {
      name:
        (selectedContact === 'Private' && isSortingEnabledPrivate) ||
        (selectedContact === 'Public' && isSortingEnabledPublic)
          ? t('Clear')
          : '',
      onClick: () => onClear(),
      titleStyle: styles.titleStyle,
      hide:
        selectedContact === 'Private'
          ? !isSortingEnabledPrivate
          : !isSortingEnabledPublic,
    },
    {
      name: t('contacts:companySort'),
      onClick: () => onClickOfSort('COMPANY'),
      rowStyle: getHighlight('COMPANY'),
    },
    {
      name: t('contacts:industrySort'),
      onClick: () => onClickOfSort('INDUSTRY'),
      rowStyle: getHighlight('INDUSTRY'),
    },
    {
      name: t('contacts:departSort'),
      onClick: () => onClickOfSort('DEPARTMENT'),
      rowStyle: getHighlight('DEPARTMENT'),
    },
    {
      name: t('contacts:sectorSort'),
      onClick: () => onClickOfSort('SECTOR'),
      rowStyle: getHighlight('SECTOR'),
    },
    {
      name: t('contacts:fieldSort'),
      onClick: () => onClickOfSort('FIELD'),
      rowStyle: getHighlight('FIELD'),
    },
  ];
  const menuSharedDataFilter: MenuModel[] = [
    {
      name:
        selectedContact === ShareFilterOptions.shared && isSortingEnabledShared
          ? t('Clear')
          : '',
      onClick: () => onSharedClear(),
      titleStyle: styles.titleStyle,
      hide: !isSortingEnabledShared,
    },
    {
      name: t('contacts:sharedWithMe'),
      onClick: () => onClickOfSharedSort(ShareFilterOptions.shareWithMe),
      rowStyle: getHighlightShared(ShareFilterOptions.shareWithMe),
    },
    {
      name: t('contacts:sharedByMe'),
      onClick: () => onClickOfSharedSort(ShareFilterOptions.shareByMe),
      rowStyle: getHighlightShared(ShareFilterOptions.shareByMe),
    },
  ];
  const renderCompanyContainer = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('SelectCompany', {
            onGoBack: () => {},
          })
        }>
        <Stack horizontal verticalAlign="center">
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            numberOfLines={1}
            style={styles.companyName}>
            {companyId?.length > 1
              ? t('addManager:allSelectedCompany')
              : companyId![0]?.name}
          </TextView>
          <Icon name="arrow_selection" size={24} color={colors.black} />
        </Stack>
      </TouchableOpacity>
    );
  };
  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        {selectedContact !== 'Shared' && renderCompanyContainer()}

        {(tooltipSeen === 'false' || tooltipSeen === null) &&
        selectedContact === 'Public' ? (
          <ToolTip
            data={t('contacts:tooltip')}
            icon="business_card"
            type="Contacts"
            onPress={val => setTooltipSeen(val)}
          />
        ) : (
          selectedContact === 'Public' && (
            <IconButton
              name="business_card"
              size={24}
              color={colors.black}
              onPress={() => {
                Keyboard.dismiss();
                openPanel();
              }}
            />
          )
        )}
        {selectedContact !== 'Shared' && (
          <PopupMenu
            data={menuDataPrivate}
            height={staffMenuList?.length * 52}
            width={152}
          />
        )}
        {selectedContact === 'Shared' && menuDataShared?.length && (
          <>
            <PopupMenu
              data={menuDataShared}
              height={sharedStaffMenuList?.length * 52}
              width={152}
            />
          </>
        )}
      </Stack>
    );
  };
  const setValuesOnTabChange = (
    value = '',
    searchValue = '',
    onTabChanging = false,
  ) => {
    value === 'Public'
      ? setPublicPageCount(1)
      : value === 'Private'
      ? setPrivatePageCount(1)
      : setSharePageNumber(1);
    setPrePrivate(0);
    setPrePublic(0);
    searchValue ? setSearchText(searchValue) : setSearchText('');
    if (onTabChanging) {
      // setFilterType('');
      setIsLongSelectCount(0);
      setSelectedContact(value);
      searchText
        ? value === 'Public'
          ? setPrivateContactListArray([])
          : setPublicContactListArray([])
        : null;
      setSelectedItemIds([]);
    }
  };

  return (
    <Container noSpacing onRetry={() => setStateUpdater(!stateUpdater)}>
      <Stack style={[styles.mainView, {backgroundColor: colors.grey_009}]}>
        <Stack style={styles.mainView}>
          <Header
            navigationType="STACK"
            preventDefault
            onBackPress={() => _handleBackPress()}
            hideLabel
            // label={t('contacts:contactRepository')}
            translateY={translateY}
            RenderLeftContainer={
              userType !== userTypes.Employee ? renderLeftContainer : undefined
            }
          />
          <Stack
            spacing={16}
            horizontal
            horizontalAlign="space-between"
            style={styles.head}>
            <TextView weight="semibold" variant={FontSizes.xlarge}>
              {selectedContact !== 'Shared'
                ? t('contacts:contactRepository')
                : t('contacts:sharedContacts')}
            </TextView>
            {selectedContact !== 'Shared' ? (
              <Stack style={styles.menu}>
                {selectedItemIds.length > 0 ? (
                  <Icon
                    name="close"
                    size={25}
                    color={colors.primary}
                    onPress={() => {
                      setIsLongSelectCount(0);
                      setSelectedItemIds([]);
                    }}
                  />
                ) : (
                  <PopupMenu
                    data={menuDataFilter}
                    height={
                      (selectedContact === 'Private' &&
                        isSortingEnabledPrivate) ||
                      (selectedContact === 'Public' && isSortingEnabledPublic)
                        ? 324
                        : 270
                    }
                    width={180}
                    icon={'filter'}
                  />
                )}
              </Stack>
            ) : (
              <PopupMenu
                data={menuSharedDataFilter}
                height={isSortingEnabledShared ? 154 : 100}
                width={180}
                icon={'filter'}
              />
            )}
          </Stack>
          <ContactRepositoryHeader
            selectedValue={selectedContact}
            getSearchedValue={value => {
              selectedContact === 'Private'
                ? setPrivateContactListArraySorted([])
                : setPublicContactListArraySorted([]);
              setValuesOnTabChange(selectedContact, value, false);
            }}
            onPress={value => setValuesOnTabChange(value, '', true)}
            props={props}
          />
          <Stack spacing={16} spaceBelow={16}>
            {selectedContact === 'Public' ? (
              <PublicContactRepositoryList
                data={publicContactListArray}
                sortedArray={publicContactListArraySorted}
                dataLength={currentData?.nodes.length!}
                searchText={searchText}
                isSuccess={isSuccess}
                isLoading={isLoading}
                isFetching={isFetching}
                isSortEnabled={isSortingEnabledPublic}
                isGotError={isError}
                refreshing={publicRefresh}
                pageCount={publicPageCount}
                sortBy={sortByPublic}
                longPressed={(value: boolean, itemId?: string[] | []) => {
                  setSelectedItemIds(itemId!);
                  value
                    ? setIsLongSelectCount(isLongSelectCount + 1)
                    : setIsLongSelectCount(isLongSelectCount - 1);
                }}
                selectedItemIds={selectedItemIds}
                count={isLongSelectCount}
                props={props}
                getRefresh={(value = false) => {
                  isSortingEnabledPublic &&
                    publicPageCount !== 1 &&
                    setPublicContactListArraySorted([]);
                  setPublicRefresh(true);
                  onPrivateClick();
                  value && setPublicRefresh(false);
                }}
                onEndReached={() => {
                  publicPageCount <= publicLastPage &&
                    !isFetching &&
                    (isSortingEnabledPublic
                      ? publicContactListArraySorted.length >= 1
                      : publicContactListArray.length >= 10) &&
                    setPublicPageCount(publicPageCount + 1);
                }}
                onMarkPrivateClick={selectedItem =>
                  onMarkPrivateClick(selectedItem._id)
                }
                onDeleteClick={selectItem => onMarkPrivateClick(selectItem._id)}
                onShareClick={id =>
                  props.navigation.navigate('InviteMember', {
                    edit: false,
                    documentId: [id],
                    isContact: true,
                    isShare: true,
                  })
                }
                onLogClick={id =>
                  props.navigation.navigate('AccessLogs', {
                    isContact: true,
                    isShareWithMe: false,
                    documentId: id,
                  })
                }
              />
            ) : selectedContact === 'Private' ? (
              <PrivateContactRepositoryList
                data={privateContactListArray}
                sortedArray={privateContactListArraySorted}
                dataLength={currentData?.nodes.length!}
                searchText={searchText}
                isLoading={isLoading}
                isSuccess={isSuccess}
                isFetching={isFetching}
                refreshing={privateRefresh}
                isGotError={isError}
                isSortEnabled={isSortingEnabledPrivate}
                sortBy={sortByPrivate}
                pageCount={privatePageCount}
                longPressed={(value: boolean, itemId?: string[] | []) => {
                  setSelectedItemIds(itemId!);
                  value
                    ? setIsLongSelectCount(isLongSelectCount + 1)
                    : setIsLongSelectCount(isLongSelectCount - 1);
                }}
                selectedItemIds={selectedItemIds}
                count={isLongSelectCount}
                props={props}
                getRefresh={(value = false) => {
                  isSortingEnabledPrivate &&
                    privatePageCount !== 1 &&
                    setPrivateContactListArraySorted([]);
                  setPrivateRefresh(true);
                  onPublicClick();
                  value && setPrivateRefresh(false);
                }}
                onEndReached={() => {
                  privatePageCount <= privateLastPage &&
                    !isFetching &&
                    (isSortingEnabledPrivate
                      ? privateContactListArraySorted.length >= 1
                      : privateContactListArray.length >= 10) &&
                    setPrivatePageCount(privatePageCount + 1);
                }}
                onMarkPublicClick={selectedItem =>
                  onMarkPublicClick(selectedItem._id)
                }
                onDeleteClick={selectItem => onMarkPublicClick(selectItem._id)}
                onShareClick={id => {
                  props.navigation.navigate('InviteMember', {
                    edit: false,
                    documentId: [id],
                    isContact: true,
                    isShare: true,
                  });
                }}
                onLogClick={id =>
                  props.navigation.navigate('AccessLogs', {
                    isContact: true,
                    isShareWithMe: false,
                    documentId: id,
                  })
                }
              />
            ) : (
              <SharedContactRepositoryList
                data={shareWithMeList}
                // sortedArray={sharedContactListArraySorted}
                pageNo={sharePageNumber}
                SharedContactDetailsNavigation={id =>
                  props.navigation.navigate('SharedContactDetails', {
                    contactId: id,
                  })
                }
                onEndReach={() =>
                  sharePageInfo.current &&
                  !isShareWithLoading &&
                  setSharePageNumber(sharePageNumber + 1)
                }
                refreshing={shareRefresh}
                getRefresh={() => {
                  setSharePageNumber(1);
                  setShareRefresh(true);
                }}
                isLoading={isShareWithLoading}
              />
            )}
          </Stack>
        </Stack>
        <Stack>
          {selectedContact !== 'Shared' && (
            <Stack style={isLongSelectCount > 0 ? {} : styles.floatingButton}>
              <FloatingButton
                name="add_floating"
                onPress={() => {
                  openFABPanel();
                }}
              />
            </Stack>
          )}
          <Stack>
            {isLongSelectCount > 0 && (
              <BottomOptions
                props={props}
                selectedContact={selectedContact}
                selectedItemIdArray={selectedItemIds}
                onMarkPrivatePress={() => {
                  setIsLongSelectCount(0);
                  selectedContact === 'Public' &&
                    selectedItemIds?.map((selectedItemId: string) => {
                      onMarkPrivateClick(selectedItemId);
                    });
                  selectedContact === 'Private' &&
                    selectedItemIds?.map((selectedItemId: string) => {
                      onMarkPublicClick(selectedItemId);
                    });
                  setSelectedItemIds([]);
                }}
                onShareclick={() =>
                  props.navigation.navigate('InviteMember', {
                    edit: false,
                    documentId: selectedItemIds,
                    isContact: true,
                    isShare: true,
                  })
                }
              />
            )}
          </Stack>
        </Stack>
      </Stack>
      {isPanelActive && (
        <BottomPanel
          panelState={isPanelActive}
          onPressEditBusinessCard={assets =>
            props.navigation.navigate('EditBusinessCard', {
              ocrData: assets,
              edit: false,
            })
          }
          onPressBusinessCard={() => props.navigation.navigate('BusinessCard')}
          onPressClose={closePanel}
        />
      )}
      {isFABPanelActive && (
        <FABBottomPanel
          panelState={isFABPanelActive}
          onPressClose={closeFABPanel}
          onRequestClick={() => setShow(true)}
          props={props}
        />
      )}
      {show && (
        <RequestContact show={show} setShow={setShow} companyId={companyId} />
      )}
    </Container>
  );
};
