import AsyncStorage from '@react-native-async-storage/async-storage';
import {DrawerScreenProps} from '@react-navigation/drawer';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {imageSources} from 'assets/images';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import DeleteModal from 'components/DeleteModal';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {MembersList} from 'components/Members/MembersList';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import {isIPhoneX} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Alert, Image, Platform, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {InviteeUserData, useGetInviteeListMutation} from 'request/Calendar';
import {
  useGetContactInviteeListMutation,
  useShareContactMutation,
} from 'request/ContactRepository';
import {
  useGetDocumentInviteeListMutation,
  useShareDocumentMutation,
} from 'request/DocumentRepository';
import {useShareVoiceNoteMutation} from 'request/VoiceNote';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {setInviteeMembers, setSelectedInviteeObj} from 'store/Reducer';
import {Styles} from './index.styles';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SignedInStackParamList, 'InviteMember'>,
  DrawerScreenProps<DrawerNavParamList>
>;
// type Props = NativeStackScreenProps<SignedInStackParamList, 'InviteMember'>;
export const InviteMembers = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {edit, disabled, isShare, documentId, isContact, isShareVoice} =
    route.params!;
  const hasNextPage = useRef<boolean>(false);
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {companyId, inviteeMembers} = useAppSelector(
    state => state?.formanagement,
  );
  const userId = useRef<string>('');
  AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA).then(res => {
    userId.current = JSON.parse(res)._id;
  });
  const [
    getInvitee,
    {data: getInviteeData, isLoading: isLoadingGetInvitee, isSuccess},
  ] = useGetInviteeListMutation();
  const [
    getDocInvitee,
    {
      data: getDocInviteeData,
      isLoading: isLoadingDocInvitee,
      isSuccess: isDocSuccess,
    },
  ] = useGetDocumentInviteeListMutation();
  const [
    getContactInvitee,
    {
      data: getContactInviteeData,
      isLoading: isLoadingContactInvitee,
      isSuccess: isContactSuccess,
    },
  ] = useGetContactInviteeListMutation();
  const [
    shareDocument,
    {
      data: shareDocData,
      isLoading: isShareDocLoading,
      isSuccess: isShareDocSuccess,
    },
  ] = useShareDocumentMutation();
  const [
    shareVoiceNote,
    {data: shareVoiceNoteData, isSuccess: isShareVoiceNoteSuccess},
  ] = useShareVoiceNoteMutation();

  const [
    shareContact,
    {
      data: shareContactData,
      isLoading: isShareContactLoading,
      isSuccess: isShareContactSuccess,
    },
  ] = useShareContactMutation();
  const [search, setSearchText] = useState<string>('');
  const [pageNo, setPageNo] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [inviteeState, setInviteeState] = useState<InviteeUserData[]>([]);
  const [isDisable, setIsDisable] = useState(false);
  const [confirm, setConfirm] = useState(false);

  const getBodyObj = useMemo(() => {
    return {
      companyId: companyId?.map(({_id}) => _id),
      searchText: search,
      pageNo: pageNo,
    };
  }, [search, pageNo, companyId]);

  useEffect(() => {
    if (refresh) {
      setInviteeState([]);
    }
    isShare
      ? isContact
        ? getContactInvitee(getBodyObj)
        : getDocInvitee(getBodyObj)
      : getInvitee(getBodyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, getBodyObj]);

  useEffect(() => {
    if (
      (getInviteeData && isSuccess) ||
      (getDocInviteeData && isDocSuccess) ||
      (getContactInviteeData && isContactSuccess)
    ) {
      const {nodes, pageInfo} = isShare
        ? isContact
          ? getContactInviteeData?.data!
          : getDocInviteeData?.data!
        : getInviteeData?.data!;
      hasNextPage.current = pageInfo.hasNextPage;
      setInviteeState(prev => prev.concat(nodes));
    }
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInviteeData, isSuccess, isDocSuccess, isContactSuccess]);
  useEffect(() => {
    if (
      (shareDocData && isShareDocSuccess) ||
      (shareContactData && isShareContactSuccess)
    ) {
      const {message} = isContact ? shareContactData! : shareDocData!;
      showToast(message);
      isContact
        ? props.navigation.navigate('PublicContactRepository')
        : props.navigation.navigate('DocumentRepository');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShareDocSuccess, isShareContactSuccess]);

  useEffect(() => {
    if (isShareVoiceNoteSuccess) {
      const {message} = shareVoiceNoteData!;
      showToast(message);
      props.navigation.navigate('VoiceNotes');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShareVoiceNoteSuccess]);

  useEffect(() => {
    if (companyId?.length) {
      setInviteeState([]);
      setPageNo(1);
    }
  }, [companyId]);

  useEffect(() => {
    if (search.length) {
      setInviteeState([]);
      setPageNo(1);
    } else {
      setInviteeState([]);
      setPageNo(1);
    }
  }, [search]);

  useEffect(() => {
    if (
      inviteeMembers?.length === inviteeState.length &&
      inviteeMembers?.length > 0
    ) {
      setIsAllSelected(true);
    }
  }, [inviteeState.length, inviteeMembers?.length]);

  const [inviteModal, setInviteModal] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<
    Set<string | number>
  >(new Set<string | number>());
  useEffect(() => {
    if (inviteeMembers?.length) {
      inviteeMembers.map(item => {
        if (!selectedMemberIds.has(item)) {
          selectedMemberIds.add(item);
        }
      });
      setSelectedMemberIds(new Set(selectedMemberIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteeMembers]);

  const onConfirmCancel = () => {
    setIsDisable(true);
    let tempArr: string[] = [];
    if (isAllSelected) {
      inviteeState?.map(item => {
        userId.current !== item._id && tempArr?.push(item._id);
      });
    } else {
      selectedMemberIds.forEach(item => tempArr.push(item as string));
    }
    selectedMemberIds?.size > 0 || isAllSelected
      ? isContact
        ? shareContact({
            contactId: documentId! as string[],
            users: tempArr,
          })
        : isShareVoice
        ? shareVoiceNote({
            voicenoteId: documentId! as string,
            users: tempArr,
          })
        : shareDocument({
            documentId: documentId! as string,
            users: tempArr,
          })
      : Alert.alert('alert', t('document:selectShareMsg'));
    if (!tempArr?.length) {
      setIsDisable(false);
    }
  };

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('SelectCompany');
          }}>
          <Stack horizontal>
            <TextView
              weight="semibold"
              variant={FontSizes.medium}
              numberOfLines={1}
              style={styles.companyNameHead}>
              {companyId?.length > 1
                ? t('addManager:allSelectedCompany')
                : companyId![0]?.name}
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
      </Stack>
    );
  };

  useEffect(() => {
    if (isAllSelected && inviteeState.length) {
      inviteeState.map(item => {
        if (!selectedMemberIds.has(item._id)) {
          // eslint-disable-next-line no-new
          new Set(selectedMemberIds.add(item?._id));
        }
      });
      setSelectedMemberIds(new Set(selectedMemberIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAllSelected, inviteeState]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={
          isShare ? t('document:sharetoTitle') : t('calendarPage:inviteMembers')
        }
        translateY={translateY}
        isCloseNavigation
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          // eslint-disable-next-line no-empty-character-class
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
        />
      </Stack>
      {!search?.length && (
        <TouchableOpacity
          onPress={() => {
            if (isAllSelected) {
              selectedMemberIds.clear();
              setSelectedMemberIds(new Set());
              dispatch(setInviteeMembers([]));
            }
            setIsAllSelected(!isAllSelected);
          }}>
          <Stack
            spacing={5}
            spaceBelow={16}
            horizontal
            style={styles.selectAll}>
            <TextView
              weight="semibold"
              variant={FontSizes.regular}
              style={styles.selectAllText}>
              {t('selectAll')}
            </TextView>
            {isAllSelected ? (
              <Icon name="check_box" size={20} color={colors.primary_002} />
            ) : (
              <Icon
                name="check_box_blank"
                size={20}
                color={colors.primary_002}
              />
            )}
          </Stack>
        </TouchableOpacity>
      )}
      {/* <Stack spacing={16} spaceBelow={32} style={styles.marginStyle}> */}
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spacing={16} spaceBelow={16} style={{flex: 1}}>
        <MembersList
          onScrollHandler={scrollHandler}
          data={inviteeState}
          showCheckBox={true}
          isAllSelected={isAllSelected}
          onSelect={setIsAllSelected}
          isShare={isShare}
          userId={userId.current}
          onInviteeSelect={value => {
            if (!selectedMemberIds.has(value)) {
              setSelectedMemberIds(new Set(selectedMemberIds.add(value)));
              inviteeState.length === selectedMemberIds.size &&
                search.length <= 0 &&
                setIsAllSelected(true);
            } else {
              selectedMemberIds.delete(value);
              setSelectedMemberIds(new Set(selectedMemberIds));
              inviteeState.length !== selectedMemberIds.size &&
                setIsAllSelected(false);
            }
          }}
          dataLength={inviteeState.length}
          isLoading={
            pageNo > 1 &&
            (isLoadingGetInvitee ||
              isLoadingDocInvitee ||
              isLoadingContactInvitee)
          }
          setPageNo={() => {
            if (hasNextPage.current) {
              setPageNo(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            setRefresh(true);
            setPageNo(1);
          }}
          inviteeSelected={selectedMemberIds}
          search={search}
        />
        {/* <PrimaryButton
          disabled={selectedMemberIds?.size ? false : true}
          title={t('invite')}
          onPress={() => setInviteModal(true)}
        /> */}
      </Stack>
      {/* </Animated.ScrollView> */}
      {/* </Stack> */}
      {!disabled && !isShare && (
        <Stack
          spacing={16}
          spaceBelow={16}
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            paddingBottom: isIPhoneX()
              ? 30
              : Platform.OS === 'android'
              ? 20
              : 0,
          }}>
          {edit ? (
            <PrimaryButton title={t('save')} onPress={() => {}} />
          ) : (
            <>
              <PrimaryButton
                disabled={selectedMemberIds?.size ? false : true}
                title={t('invite')}
                onPress={() => setInviteModal(true)}
              />
            </>
          )}
        </Stack>
      )}
      {confirm &&
        !selectedMemberIds?.size! &&
        Alert.alert(
          'Alert',
          isContact
            ? t('share:alertContact')
            : isShareVoice
            ? t('share:alertVoiceNote')
            : t('share:alertDocument'),
          [{text: 'Ok', onPress: () => setConfirm(false)}],
        )}
      {confirm && selectedMemberIds?.size! > 0 && (
        <DeleteModal
          setReopenModal={setConfirm}
          Title={
            isContact
              ? t('share:confirmShareContact')
              : isShareVoice
              ? t('share:confirmShareVoice')
              : t('share:confirmShareDocuments')
          }
          reopenModal={confirm}
          onDeleteClick={() => {
            onConfirmCancel();
          }}
        />
      )}
      {isShare && (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton
            title={t('document:share')}
            disabled={inviteeState.length <= 0 || isDisable}
            onPress={() => {
              setConfirm(true);
            }}
          />
        </Stack>
      )}
      {inviteModal && (
        <Modal
          isVisible={inviteModal}
          onBackdropPress={() => setInviteModal(false)}
          style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <View style={styles.view}>
              <Image source={imageSources.inviteImage} style={styles.image} />
              <TextView
                weight="semibold"
                variant={FontSizes.medium}
                style={styles.shareText}>
                {t('calendarPage:invitationWillSent')}
              </TextView>
            </View>
            <Stack spacing={16} style={styles.cancel}>
              <PrimaryButton
                title={t('ok')}
                onPress={() => {
                  if (isAllSelected) {
                    let tempArr: string[] = [];
                    inviteeState.map(item => {
                      tempArr?.push(item._id);
                      if (!selectedMemberIds.has(item._id)) {
                        selectedMemberIds.add(item._id);
                      }
                    });
                    setSelectedMemberIds(new Set(selectedMemberIds));
                    dispatch(setInviteeMembers(tempArr!));
                  } else {
                    let arr: string[] = [];
                    selectedMemberIds.forEach(item => arr.push(item as string));
                    let selectedObj = [...inviteeState].filter(item =>
                      arr.find(ele => ele === item?._id),
                    );
                    dispatch(setInviteeMembers(arr));
                    dispatch(setSelectedInviteeObj(selectedObj));
                  }
                  setInviteModal(false);
                  props.navigation.goBack();
                }}
              />
            </Stack>
          </View>
        </Modal>
      )}
      {(((isLoadingGetInvitee ||
        isLoadingDocInvitee ||
        isLoadingContactInvitee) &&
        pageNo === 1) ||
        isShareDocLoading ||
        isShareContactLoading) &&
        search.length < 1 && (
          <Loader
            message={
              isShareDocLoading || isShareContactLoading
                ? 'Loading'
                : 'Fetching members...'
            }
          />
        )}
    </Container>
  );
};
