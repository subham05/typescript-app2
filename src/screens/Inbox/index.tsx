import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import {
  // useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {MailListView} from './MailListView';
// import { inboxDataSample } from './MailListView/mockData';
import Loader from 'components/Loader';
import {
  emailListDataModal,
  useAddEmailThreadsMutation,
  useGetEmailListMutation,
  useSetEmailLableAsMutation,
} from 'request/Inbox';
import {useAppSelector} from 'store/hooks';
import Refresh from '../../assets/svgs/refresh.svg';
import {getRefreshEmail, getThreads} from './commonFunction';

export type InboxNavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<EmailStackParamList, 'Inbox'>
>;

export const InboxScreen = (props: InboxNavProps) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const [inboxFilter, setInboxFilter] = useState<string>(t('inboxPage:inbox'));
  const [searchText, setSearchText] = useState<string>('');
  const [showLabelModal, setShowLabelModal] = useState<boolean>(false);
  const [actionable, setActionable] = useState<boolean>(false);
  const [informative, setinformative] = useState(false);
  const [selected, setSelected] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [emailList, setEmailList] = useState<emailListDataModal[]>([]);
  const hasNextPage = useRef<boolean>(false);
  const {userData} = useAppSelector(state => state.formanagement);
  const [setMailThread, {isSuccess}] = useAddEmailThreadsMutation();
  const [
    getEmailList,
    {data: emailData, isLoading: isEmailLoading, isSuccess: isEmailSuccess},
  ] = useGetEmailListMutation();
  const [
    setEmailLableAs,
    {data: emailLableAsData, isSuccess: isEmailLableAsSuccess},
  ] = useSetEmailLableAsMutation();

  const requestObj = useMemo(() => {
    return {
      pageNo: pageNumber,
      action: inboxFilter === t('inboxPage:inbox') ? 'INBOX' : 'SENT',
      searchText: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, inboxFilter, searchText]);

  useEffect(() => {
    if (refresh) {
      let bodyObj = {
        pageNo: 1,
        action: inboxFilter === t('inboxPage:inbox') ? 'INBOX' : 'SENT',
        searchText: searchText,
      };
      getEmailList(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useFocusEffect(
    useCallback(() => {
      getEmailList(requestObj);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestObj]),
  );

  useEffect(() => {
    if (emailData && isEmailSuccess) {
      const {nodes, pageInfo} = emailData;
      const newFile = nodes.map(item => {
        return {...item, isSelected: false};
      });

      pageNumber === 1
        ? setEmailList(newFile)
        : setEmailList(prev => prev.concat(newFile));
      hasNextPage.current = pageInfo.hasNextPage!;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmailSuccess]);

  useEffect(() => {
    if (isSuccess) {
      setRefresh(false);
    }
    if (isEmailLableAsSuccess && emailLableAsData) {
      setSelected(false);
      pageNumber !== 1 && setPageNumber(1);
      if (actionable) {
        setActionable(true);
      } else if (informative) {
        setinformative(true);
      }
      getEmailList(requestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmailLableAsSuccess, isSuccess]);

  const onSearchTextChange = (searchTextParam: string) => {
    setPageNumber(1);
    setSearchText(searchTextParam);
  };

  const onLongPress = (item: emailListDataModal) => {
    const newArray = [...emailList];

    newArray?.map((emailItem, index) => {
      if (newArray[index].isSelected) {
        newArray[index].isSelected = false;
        setSelected(false);
      }
      if (emailItem._id === item._id) {
        newArray[index].isSelected = true;
        setSelected(true);
        setSelectedId(item._id);
      }
    });
    setEmailList(newArray);
  };
  const menuData: MenuModel[] = [
    {
      name: t('inboxPage:inbox'),
      onClick: () => {
        if (inboxFilter !== t('inboxPage:inbox')) {
          setPageNumber(1);
          setSearchText('');
          setEmailList([]);
          setInboxFilter(t('inboxPage:inbox'));
        }
      },
      rowStyle: {
        backgroundColor:
          inboxFilter === t('inboxPage:inbox') ? colors.grey_002 : colors.white,
      },
    },
    {
      name: t('inboxPage:sentMail'),
      onClick: () => {
        if (inboxFilter !== t('inboxPage:sentMail')) {
          setPageNumber(1);
          setSearchText('');
          setEmailList([]);
          setInboxFilter(t('inboxPage:sentMail'));
        }
      },
      rowStyle: {
        backgroundColor:
          inboxFilter === t('inboxPage:sentMail')
            ? colors.grey_002
            : colors.white,
      },
    },
  ];

  const labelData: MenuModel[] = [
    {
      name: 'Label as',
      onClick: () => {
        setShowLabelModal(true);
        emailData?.nodes.filter(item => {
          if (item?._id === selectedId) {
            if (item?.isActionable) {
              setActionable(true);
            } else if (item?.isInformative) {
              setinformative(true);
            }
          }
        });
      },
    },
  ];

  const renderLeftContainer = () => {
    return (
      <Stack>
        <PopupMenu
          data={labelData}
          height={50}
          width={Dimensions.get('screen').width / 4.3}
          menuStyle={styles().moreIcon}
        />
      </Stack>
    );
  };
  const onOkPress = () => {
    const ids: string[] = [selectedId];
    // selected.forEach(email => ids.push(email));
    const obj = actionable
      ? {
          emailId: ids,
          isActionable: actionable,
        }
      : {
          emailId: ids,
          isInformative: informative,
        };
    setEmailLableAs(obj);
    setShowLabelModal(false);
    setActionable(false);
    setinformative(false);
  };

  const getRefresh = () => {
    setRefresh(true);
    setPageNumber(1);
    setSelected(false);
    getRefreshEmail(userData).then((response: any) => {
      getThreads(response?.data).then((response1: any) => {
        const obj = {
          messages: response1?.data?.messages,
          labelIds: [inboxFilter === t('inboxPage:inbox') ? 'INBOX' : 'SENT'],
        };
        setMailThread(obj);
      });
    });
  };

  return (
    <Container noSpacing>
      <Header
        hideLabel
        RenderLeftContainer={selected ? renderLeftContainer : undefined}
        translateY={translateY}
      />
      <Stack
        spacing={20}
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center">
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {inboxFilter === t('inboxPage:inbox')
            ? t('inboxPage:head')
            : t('inboxPage:sentMail')}
        </TextView>
        {!selected ? (
          <StackItem horizontal horizontalAlign="center" childrenGap={5}>
            {/* <RefreshIcon
              name="refresh"
              size={20}
              color={colors.black}
              style={{marginTop: 3}}
              onPress={getRefresh}
            /> */}
            <TouchableOpacity style={{marginTop: 3}} onPress={getRefresh}>
              <Refresh width={22} height={22} />
            </TouchableOpacity>
            <PopupMenu
              data={menuData}
              height={100}
              width={178}
              icon={'filter'}
              menuStyle={styles().moreIcon}
              isDivider
            />
          </StackItem>
        ) : (
          <Stack>
            <Icon
              name="close"
              size={25}
              color={colors.primary}
              onPress={() => {
                const newArray = [...emailList];

                newArray?.map((emailItem, index) => {
                  if (newArray[index].isSelected) {
                    newArray[index].isSelected = false;
                    setSelected(false);
                  }
                });
                setEmailList(newArray);
                setSelected(false);
              }}
            />
          </Stack>
        )}
      </Stack>
      <Stack horizontal spacing={16} style={styles().attachmentView}>
        <SearchTextField
          // eslint-disable-next-line no-empty-character-class
          value={searchText}
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
          selectedContact={inboxFilter}
          onSearchChange={val => {
            setPageNumber(1);
            setSearchText(val.trim());
          }}
        />
      </Stack>
      <MailListView
        data={emailList}
        selectedView={inboxFilter}
        onLongPress={onLongPress}
        isSelected={selected}
        isRefresh={refresh}
        isLoading={isEmailLoading}
        onPress={data =>
          props.navigation.navigate('MailMessage', {
            mailId: data._id,
            searchText: searchText,
            setSearchTextVal: onSearchTextChange,
          })
        }
        onEndReach={() => hasNextPage.current && setPageNumber(pageNumber + 1)}
        onRefresh={getRefresh}
      />
      {showLabelModal && (
        <Modal
          style={styles().centerAlignModal}
          isVisible={showLabelModal}
          onBackdropPress={() => setShowLabelModal(false)}>
          <View style={styles().bottomModalView}>
            <StackItem childrenGap={16} spacing={26}>
              <Ripple
                onPress={() => {
                  if (actionable) {
                    setActionable(false);
                  } else {
                    setActionable(true);
                    setinformative(false);
                  }
                }}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles().shareText}>
                    {t('inboxPage:actionable')}
                  </TextView>
                  <Stack style={styles().iconManager}>
                    <Icon
                      name={actionable ? 'check_box' : 'check_box_blank'}
                      size={20}
                    />
                  </Stack>
                </Stack>
              </Ripple>
              <Ripple
                onPress={() => {
                  if (informative) {
                    setinformative(false);
                  } else {
                    setinformative(true);
                    setActionable(false);
                  }
                }}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  horizontalAlign="space-between">
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles().shareText}>
                    {t('inboxPage:informative')}
                  </TextView>
                  <Stack style={styles().iconEmployee}>
                    <Icon
                      name={informative ? 'check_box' : 'check_box_blank'}
                      size={20}
                    />
                  </Stack>
                </Stack>
              </Ripple>
              <StackItem
                horizontal
                childrenGap={26}
                horizontalAlign="flex-end"
                // style={styles().modal}
              >
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles().reopenModal}
                  onPress={() => setShowLabelModal(false)}>
                  {t('inboxPage:cancel')}
                </TextView>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles().reopenModal}
                  onPress={onOkPress}>
                  {t('ok')}
                </TextView>
              </StackItem>
            </StackItem>
          </View>
        </Modal>
      )}
      {isEmailLoading && pageNumber === 1 && !refresh && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
      marginTop: 16,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    filterIcon: {top: 20},
    moreIcon: {marginTop: 3},

    bottomModal: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    bottomModalView: {
      backgroundColor: 'white',
      paddingBottom: 16,
      paddingTop: 26,
      maxHeight: 380,
      borderRadius: 6,
      width: Dimensions.get('screen').width / 1.5,
    },
    applyButton: {
      marginTop: 15,
      width: '47%',
      borderRadius: 3,
    },
    buttonView: {
      justifyContent: 'space-between',
      paddingBottom: 10,
    },
    apply: {
      padding: 15,
      textAlign: 'center',
      color: colors.white,
    },
    closeButton: {
      height: 50,
      marginTop: 15,
      backgroundColor: colors.white,
      width: '47%',
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 3,
    },
    close: {
      padding: 15,
      textAlign: 'center',
      color: colors.primary,
    },
    shareText: {
      textAlign: 'center',
      color: colors.black,
    },
    iconManager: {
      justifyContent: 'center',
      // marginRight: 20,
      marginTop: 2,
    },
    iconEmployee: {
      justifyContent: 'center',
      // marginRight: 20,
      marginTop: 2,
    },
    modal: {
      alignSelf: 'flex-end',
      padding: 10,
    },
    reopenModal: {
      // padding: 15,
      color: colors.primary,
    },
    centerAlignModal: {justifyContent: 'center', alignItems: 'center'},
    modalStyle: {alignItems: 'center'},
  });
  return mergeStyles;
};
