import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {AlertPermission} from 'common/utils/permission/Alert';
import {showToast} from 'common/utils/ToastMessage';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {NavContext} from 'navigation/router';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Alert,
  AppState,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Contacts, {Contact} from 'react-native-contacts';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useSetContactListMutation} from 'request/ContactRepository';
import {
  checkContactPermission,
  getContactPermission,
} from '../../common/utils/permission';
import {Container, TextView} from '../../components';
import {PrimaryButton} from '../../components/Buttons';
import Header from '../../components/Header';
import {Stack} from '../../components/Stack';
import {SignedInStackParamList} from '../../navigation/Stacks/SignedInStack';
import {ContactMembersList} from './components/ContactMembersList';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ContactScreen'>;
export const SelectContactScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [loader, setLoader] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [contactList, setContactList] = useState<Contact[] | []>([]);
  const tempList = useRef<Contact[]>([]);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [enabledAlaert, setEnabledAlert] = useState<boolean>(false);
  const [uploadContacts, {isSuccess, data, isLoading, isError, error}] =
    useSetContactListMutation();
  const {saveContactsSynced} = useContext(NavContext);
  const appState = useRef(false);

  useFocusEffect(
    useCallback(() => {
      let subscription = AppState.addEventListener('change', () => {
        if (appState.current) {
          setTimeout(() => {
            setLoader(true);
            setContactsList();
          }, 2000);
          appState.current = false;
        }
      });

      setLoader(true);
      setContactsList();
      return () => {
        subscription?.remove();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (isError && error) {
      const err: any = error;
      if (err?.error) {
        showToast(err.error);
      } else {
        showToast(err?.data?.error[0]?.msg);
      }
      setLoader(false);
      setRefresh(false);
    }
    if (data && isSuccess) {
      saveContactsSynced();
      setLoader(false);
      setContactList([]);
      props.navigation.navigate('PublicContactRepository', {isSynced: true});
      showToast(data.message);
    }
    return () => {
      setLoader(false);
      setRefresh(false);
      setContactList([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess, error]);

  const setContactsList = async (isRefresh = false) => {
    const isContactPermission = await checkContactPermission();
    if (isContactPermission.isPermissionGranted) {
      showToast(t('contacts:fetchingContacts'));
      isRefresh ? setRefresh(true) : setLoader(true);
      Contacts.getAll().then(contact => {
        if (contact.length > 0) {
          setContactList(contact);
          contact.map(item => {
            const isAvailble = selectedMemberIds.find(
              id => id === item.recordID,
            );
            if (!isAvailble) {
              selectedMemberIds.push(item.recordID);
            }
          });

          setSelectedMemberIds([...selectedMemberIds]);
          tempList.current = [...contact];
          setIsAllSelected(true);
          isRefresh ? setRefresh(false) : setLoader(false);
        }
      });
    } else if (!isContactPermission.isPermissionGranted) {
      isRefresh ? setRefresh(false) : setLoader(false);
      setTimeout(() => {
        requestForPermission();
      }, 500);
    }
  };

  const requestForPermission = async () => {
    getContactPermission().then(resp => {
      (resp.statuses['android.permission.READ_CONTACTS'] === 'blocked' ||
        resp.statuses['ios.permission.CONTACTS'] === 'blocked') &&
        AlertPermission(t('permissions:contacts'), onCancel, onOk);
      resp.isPermissionGranted && setContactsList();
    });
  };
  const onCancel = () => requestForPermission();
  const onOk = () => (appState.current = true);
  const onSelectAllClick = () => {
    if (isAllSelected) {
      tempList.current = [];
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds([]);
      tempList.current = [];
      const tempIds = contactList.map((item: Contact) => item.recordID);
      setSelectedMemberIds([...tempIds]);
      tempList.current = [...contactList];
    }
    setIsAllSelected(!isAllSelected);
  };
  const styles = Styles();

  return (
    <Container noSpacing>
      <Header label={t('contacts:selectContacts')} translateY={translateY} />
      <Stack style={styles.flex}>
        <KeyboardAvoidingView
          behavior="height"
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <Stack spacing={16} spaceBelow={16}>
              {contactList.length > 0 && (
                <TouchableOpacity onPress={onSelectAllClick}>
                  <Stack
                    spaceBelow={16}
                    horizontal
                    horizontalAlign="flex-end"
                    style={styles.selectAll}
                    // style={[styles.selectAll, {right: -5}]}
                    verticalAlign="center">
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles.selectAllText}>
                      {t('common:selectAll')}
                    </TextView>
                    {isAllSelected ? (
                      <Icon
                        name="check_box"
                        size={20}
                        color={colors.primary_002}
                      />
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
              <ContactMembersList
                data={contactList}
                showCheckBox={true}
                loader={loader}
                refreshing={refresh}
                onRefresh={() => setContactsList(true)}
                isAllSelected={isAllSelected}
                selectedMemberIds={selectedMemberIds}
                onSelect={selectedItem => {
                  const isAvailable = selectedMemberIds.findIndex(
                    id => id === selectedItem.recordID,
                  );
                  if (isAvailable === -1) {
                    selectedMemberIds.push(selectedItem.recordID);
                    tempList.current.push(selectedItem);
                    setSelectedMemberIds([...selectedMemberIds]);
                  } else {
                    selectedMemberIds.splice(isAvailable, 1);
                    tempList.current.splice(isAvailable, 1);
                    setSelectedMemberIds([...selectedMemberIds]);
                  }
                  selectedMemberIds.length !== contactList.length
                    ? setIsAllSelected(false)
                    : setIsAllSelected(true);
                }}
              />
            </Stack>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        <Stack style={{height: Dimensions.get('screen').height * 0.07}}>
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('Sync')}
              disabled={
                isLoading ||
                contactList.length <= 0 ||
                selectedMemberIds.length <= 0
              }
              onPress={() => {
                if (
                  (selectedMemberIds.length === contactList.length ||
                    isAllSelected) &&
                  !enabledAlaert
                ) {
                  Alert.alert(t('Alert'), t('contacts:syncContactAlert'), [
                    {text: t('contacts:okay')},
                  ]);
                  setEnabledAlert(true);
                } else {
                  showToast(t('contacts:contactSyncing'));
                  uploadContacts(
                    isAllSelected ? contactList : tempList.current,
                  );
                }
              }}
            />
          </Stack>
        </Stack>
      </Stack>
      {isLoading ? <Loader /> : null}
    </Container>
  );
};
