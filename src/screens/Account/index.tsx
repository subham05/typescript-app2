import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {userDataAction} from 'store/Reducer';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {
  // OfficeLocationModal,
  ProfileBody,
  ProfileModal,
  useEditProfileMutation,
  useLazyViewProfileQuery,
  useOfficeLocationListMutation,
} from '../../request/Profile';
// import {OfficeLocation} from './components/OfficeLocation';
import {PersonalDetails} from './components/PersonalDetails';
import {Styles} from './index.styles';
import {FooterComponent} from 'components/FooterComponent';
import {TouchableOpacity} from 'react-native';

export type AccountProps = NativeStackScreenProps<
  SignedInStackParamList,
  'AccountScreen'
>;

export const AccountScreen = (props: AccountProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const styles = Styles();

  const [getProfileData] = useLazyViewProfileQuery();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [profileData, setProfileData] = useState<ProfileModal>();
  const {userData} = useAppSelector(state => state.formanagement);
  const [editProfile, {isSuccess}] = useEditProfileMutation();
  const [trigger, setTrigger] = useState<boolean>(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsLoading(true);
    getProfileData({})
      .then(res => {
        setProfileData(res.data?.data?.foundUser);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, trigger]);

  const updateProfile = (bodyObj: ProfileBody) => {
    setIsLoading(true);
    editProfile(bodyObj)
      .then((res: any) => {
        if (res.error) {
          showToast(res.error.data.error[0].msg);
          setIsLoading(false);
        } else {
          showToast(res.data.message);
          AsyncStorage.setItem(
            STR_KEYS.LOGINUSERDATA,
            JSON.stringify({
              ...userData,
              name: bodyObj.name,
            }),
          );
          if (userData) {
            dispatch(userDataAction({...userData, name: bodyObj.name}));
          }
        }
      })
      .catch(() => setIsLoading(false));
  };

  const callFetchProfileApi = () => {
    setTrigger(!trigger);
  };

  const [pageNo, setPageNo] = useState<number>(1);
  const [officeLocations, setOfficeLocations] = useState([]);
  const [isOfficeOpened, setIsOfficeOpened] = useState(false);
  const [isLoadingOfficeLocation, setIsLoadingOfficeLocation] =
    useState<boolean>(false);

  const [
    getOfficeLocationList,
    {
      isSuccess: isSuccessOfficeLocationList,
      isLoading: isLoadingOfficeLocationList,
      data: officeLocationListingData,
    },
  ] = useOfficeLocationListMutation();

  const officeLocationListBodyObj = useMemo(() => {
    return {
      searchText: '',
      pageNo: pageNo,
    };
  }, [pageNo]);

  useEffect(() => {
    if (isOfficeOpened) {
      setIsLoadingOfficeLocation(true);
      getOfficeLocationList(officeLocationListBodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeLocationListBodyObj, isOfficeOpened]);

  useEffect(() => {
    if (isSuccessOfficeLocationList && officeLocationListingData) {
      setOfficeLocations(prev =>
        prev.concat(officeLocationListingData?.data.nodes),
      );
      setIsLoadingOfficeLocation(false);
    }
  }, [isSuccessOfficeLocationList, officeLocationListingData]);

  if (isLoading) {
    return <Loader />;
  }

  const ListEmptyComponent = () =>
    !officeLocations?.length && !isLoadingOfficeLocation && isOfficeOpened ? (
      <TextView
        variant={FontSizes.large}
        weight={'semibold'}
        style={styles.noData}>
        No data found
      </TextView>
    ) : null;

  const ListHeaderComponent = () => (
    <Stack>
      <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
        <Stack>
          <Stack spaceBelow={16} spacing={16} center>
            <Ripple
              onPress={() =>
                props.navigation.navigate('EditGroupIcon', {
                  profile: true,
                  image: userData?.profileUrl,
                })
              }>
              <Persona
                name={profileData?.name || ''}
                image={userData?.profileUrl || ''}
                size={92}
              />

              <Icon
                name="camera"
                size={18}
                color={colors.white}
                style={styles.iconImage}
              />
            </Ripple>
            <TextView
              weight="medium"
              variant={FontSizes.large}
              style={styles.name}
              truncate>
              {profileData?.name}
            </TextView>
          </Stack>
          <StackItem childrenGap={16} spacing={16} horizontal center>
            <DefaultButton
              title={t('accountPage:markAttendance')}
              onPress={() => {
                props.navigation.navigate('MarkAttendance');
              }}
              height={38}
              fontSize={FontSizes.small}
              width={165}
            />
            <PrimaryButton
              title={t('accountPage:shareContact')}
              onPress={() =>
                props.navigation.navigate('InviteMember', {
                  edit: false,
                  isShare: true,
                  documentId: [profileData?._id],
                  isContact: true,
                })
              }
              alignButton
              height={38}
              fontSize={FontSizes.small}
              width={165}
            />
          </StackItem>
          <PersonalDetails
            profileData={profileData}
            updateProfile={updateProfile}
          />
          <Divider size={2} />
        </Stack>
        <Stack spacing={16} spaceBelow={16} style={styles.marginTop}>
          <TouchableOpacity
            onPress={() => {
              if (!isOfficeOpened) {
                setPageNo(1);
              } else if (isOfficeOpened) {
                setOfficeLocations([]);
              }
              setIsOfficeOpened(prev => !prev);
            }}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center">
              <TextView
                weight="semibold"
                variant={FontSizes.large}
                style={{color: colors.primary_007}}>
                {t('accountPage:officeLocation')}
              </TextView>
              {isOfficeOpened ? (
                <Icon name="arrow_drop_up" size={30} color={colors.black} />
              ) : (
                <Icon name="arrow_drop_down" size={30} color={colors.black} />
              )}
            </Stack>
          </TouchableOpacity>
        </Stack>
      </KeyboardAwareScrollView>
    </Stack>
  );

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('accountPage:head')}
        translateY={translateY}
      />
      <Animated.FlatList
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        data={officeLocations}
        renderItem={({item, index}) => {
          return (
            <>
              {isOfficeOpened && (
                <Stack spacing={32}>
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setIsOfficeOpened(prev => !prev);
                      setOfficeLocations([]);
                      props.navigation.navigate('ViewCompany', {
                        companyData: item,
                        callFetchProfileApi: callFetchProfileApi,
                        isUserAuthorizedToEdit:
                          officeLocationListingData?.data?.isAuthorisedToDelete,
                      });
                    }}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.medium}
                      style={styles.companyLabel}>
                      {item?.name}
                    </TextView>
                  </TouchableOpacity>
                </Stack>
              )}
            </>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        ListHeaderComponent={() => <ListHeaderComponent />}
        ListFooterComponent={() => (
          <FooterComponent isLoading={isLoadingOfficeLocationList} />
        )}
        ListEmptyComponent={() => <ListEmptyComponent />}
        onEndReached={() => {
          if (officeLocationListingData?.data?.pageInfo.hasNextPage) {
            setPageNo(prev => prev + 1);
          }
        }}
      />
    </Container>
  );
};
