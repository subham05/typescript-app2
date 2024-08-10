import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {getLocation} from 'common/utils/getLocation';
import {AlertPermission} from 'common/utils/permission/Alert';
import {
  checkLocationPermission,
  getLocationPermission,
} from 'common/utils/permission/ReadLocation';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import ConfirmationModal from 'components/ConfirmationModal';
import {FormikTextField} from 'components/formikFields';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {AuthContext, NavContext} from 'navigation/router';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  // KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginBody, useLoginMutation} from 'request/Authentication';
import {useCompanyListingMutation} from 'request/CompanyList';
import {useAppDispatch} from 'store/hooks';
import {setCompanyIdAction, userDataAction} from 'store/Reducer';
import {InitialValues} from './constants';
import {consentStatus, SignInProps} from './types';
import {SignInSchema} from './utils';
KeyboardAwareScrollView;

type HomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export interface LatLng {
  lat: number;
  lng: number;
}

export const LoginScreen = ({navigation}: HomeScreenProps) => {
  const {t} = useTranslation();

  const {signIn} = useContext(AuthContext);
  // const [emailId, setEmail] = useState<string>('owner@email.com');
  // const [password, setPassword] = useState<string>('');

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState<boolean>(true);
  const [location, setLocation] = useState<LatLng>();
  const [isLocationPermission, setIsLocationPermission] =
    useState<boolean>(false);
  const [isSubmitData, setIsSubmitData] = useState<boolean>(false);
  const [dataValues, setDataValues] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isConsent, setIsConsent] = useState(consentStatus.pending);
  const [isConfModalVisible, setIsConfModalVisible] = useState(false);

  const [
    loginUser,
    {
      isLoading: isLoadingLoginUser,
      isError: isErrorLoginUser,
      isSuccess,
      error: LoginUserError,
      data: loginUserData,
    },
  ] = useLoginMutation();

  const [
    getCompanies,
    {
      data: companyData,
      isLoading: isLoadingCompanyData,
      // error: companyError,
    },
  ] = useCompanyListingMutation();

  const {saveSelectCompany} = useContext(NavContext);

  // let isLoading = isLoadingLoginUser;

  const takeLocationPermission = () => {
    checkLocationPermission().then(res => {
      if (!res.isPermissionGranted) {
        if (res.result === 'denied') {
          getLocationPermission().then(resp => {
            if (resp.isPermissionGranted) {
              setIsLocationPermission(true);
            } else {
              setIsLocationPermission(false);
              AlertPermission(t('permissions:location'));
            }
            // (resp.statuses['android.permission.ACCESS_FINE_LOCATION'] ===
            //   'blocked' ||
            //   resp.statuses['ios.permission.LOCATION_WHEN_IN_USE'] ===
            //     'blocked') &&
            //   AlertPermission(t('permissions:location'));
            // resp.isPermissionGranted && setIsLocationPermission(true);
          });
        } else if (res.result === 'blocked') {
          setIsLocationPermission(false);
          AlertPermission(t('permissions:location'));
        }
      } else {
        setIsLocationPermission(true);
      }
    });
  };

  // const takeLocationPermission = () => {
  //   checkLocationPermission().then(res => {
  //     if (!res.isPermissionGranted) {
  //       if (res.result === 'denied') {
  //         getLocationPermission().then(resp => {
  //           (resp.statuses['android.permission.ACCESS_FINE_LOCATION'] ===
  //             'blocked' ||
  //             resp.statuses['ios.permission.LOCATION_WHEN_IN_USE'] ===
  //               'blocked') &&
  //             AlertPermission(t('permissions:location'));
  //           resp.isPermissionGranted && getLatLong();
  //         });
  //       } else if (res.result === 'blocked') {
  //         AlertPermission(t('permissions:location'));
  //       }
  //     } else {
  //       getLatLong();
  //     }
  //   });
  // };

  // const getLatLong = () => {
  //   setIsLocationPermission(true);
  //   getLocation().then(res => {
  //     setLocation(res.location);
  //   });
  // };

  useEffect(() => {
    if (location?.lat) {
      onSubmit(dataValues, location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const checkLocationSwitch = () => {
    return new Promise(resolve => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => resolve(data))
        .catch(() => setIsLocationPermission(false));
    });
  };

  const _getLocation = async () => {
    if (isLocationPermission && isSubmitData && dataValues) {
      setIsLoading(true);
      let isEnabled =
        Platform.OS === 'android' && (await checkLocationSwitch());

      if (
        isEnabled === 'already-enabled' ||
        isEnabled === 'enabled' ||
        Platform.OS === 'ios'
      ) {
        getLocation()
          .then(res => {
            setLocation(res.location);
          })
          .catch(err => {
            console.log('get location error-->', err);
          });
      }
      // .catch(error => console.log(error));
    } else if (!isLocationPermission && isSubmitData && dataValues) {
      // setLocation({lat: '', lng: ''});
      onSubmit(dataValues);
    }
  };

  useEffect(() => {
    _getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitData, isLocationPermission, dataValues]);

  useEffect(() => {
    takeLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      loginUserData?.data?.selectedCompanyId! &&
      companyData?.data.length! > 0
    ) {
      let selectedCompanyObj = companyData?.data.filter(
        item => item._id === loginUserData?.data?.selectedCompanyId!,
      );
      dispatch(setCompanyIdAction(selectedCompanyObj!));
      saveSelectCompany();
      signInFunction(loginUserData?.data?.role?.type!);
    } else if (
      !loginUserData?.data?.selectedCompanyId! &&
      companyData?.data.length! >= 0
    ) {
      signInFunction(loginUserData?.data?.role?.type!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData?.data, loginUserData?.data?.selectedCompanyId]);

  useEffect(() => {
    setIsLoading(false);
    setIsSubmitData(false);
    if (isSuccess && loginUserData?.success) {
      // showToast(loginUserData?.message);
      console.log('object', loginUserData);
      AsyncStorage.setItem(
        STR_KEYS.LOGINUSERDATA,
        JSON.stringify(loginUserData?.data!),
      );
      dispatch(userDataAction(loginUserData?.data!));
      // dispatch(setCompanyIdAction(loginUserData?.data.companies!));
      getCompanies();
    } else if (
      isSuccess &&
      !loginUserData?.success &&
      loginUserData?.message === 'Action required'
    ) {
      setIsConfModalVisible(true);
    } else if (isSuccess && !loginUserData?.success) {
      showToast(loginUserData?.message);
    } else if (isErrorLoginUser) {
      showToast(JSON.stringify(LoginUserError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    LoginUserError,
    dispatch,
    isErrorLoginUser,
    isSuccess,
    loginUserData,
    loginUserData?.message,
  ]);

  // useEffect(() => {
  //   takeLocationPermission();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (isSuccess && loginUserData?.success) {
  //     // showToast(loginUserData?.message);
  //     console.log('object', loginUserData);
  //     AsyncStorage.setItem(
  //       STR_KEYS.LOGINUSERDATA,
  //       JSON.stringify(loginUserData?.data!),
  //     );
  //     dispatch(userDataAction(loginUserData?.data!));
  //     // dispatch(setCompanyIdAction(loginUserData?.data.companies!));
  //     signInFunction(loginUserData?.data?.role?.type!);
  //   } else if (isSuccess && !loginUserData?.success) {
  //     showToast(loginUserData?.message);
  //   } else if (isErrorLoginUser) {
  //     showToast(JSON.stringify(LoginUserError));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   LoginUserError,
  //   dispatch,
  //   isErrorLoginUser,
  //   isSuccess,
  //   loginUserData,
  //   loginUserData?.message,
  // ]);

  const signInFunction = async (value: string) => {
    await AsyncStorage.removeItem(STR_KEYS.USERTYPE);
    if (value === 'MANAGER') {
      signIn(userTypes.Manager);
    } else if (value === 'OWNER') {
      signIn(userTypes.Owner);
    } else if (value === 'EMPLOYEE') {
      signIn(userTypes.Employee);
    } else if (value === 'GM') {
      signIn(userTypes.GeneralManager);
    } else if (value === 'PA') {
      signIn(userTypes.persoalAssistant);
    } else {
      signIn(userTypes.Vendor);
    }
  };

  // const [hideButton, setHideButton] = useState<boolean>(false);
  // const [isSelected, setIsSelected] = useState<boolean>(false);

  let deviceUniqueId: string;

  const onSubmit = async (values: SignInProps, loc?: LatLng) => {
    DeviceInfo.getUniqueId().then(res => (deviceUniqueId = res));
    let fcmToken = await AsyncStorage.getItem(STR_KEYS.FCM_TOKEN);
    let selectedLanguage = await AsyncStorage.getItem(
      STR_KEYS.LANGUAGE_SELECTED,
    );
    let bodyObj: LoginBody = {
      isLoginByEmail: true,
      email: values.email,
      loginFor: 'MOBILE',
      password: values.password,
      latlong: {
        latitude: loc?.lat || '',
        longitude: loc?.lng || '',
      },
      isLocationEnabled: isLocationPermission,
      isConsent: isConsent,
      device: {
        deviceId: DeviceInfo.getDeviceId() || '',
        osType: Platform.OS === 'android' ? 'ANDROID' : 'IOS' || '',
        osVersion: Platform.Version.toString() || '',
        deviceUniqueId: deviceUniqueId || '',
        deviceBrand: DeviceInfo.getBrand() || '',
        deviceModel: DeviceInfo.getModel() || '',
        deviceType: DeviceInfo.getDeviceType() || '',
        appVersion: '1.0',
        fcmToken: fcmToken || '',
      },
      language: selectedLanguage === 'English' ? 'english' : 'arabic',
    };
    // console.log('the body obj', bodyObj);
    loginUser(bodyObj);
  };

  const RenderRightContainer = () => {
    return (
      <>
        <TouchableOpacity
          style={styles().attachmentIcon}
          onPress={() => setShowPassword(prevState => !prevState)}>
          {showPassword ? (
            <Icon name="visibility_off" size={22} color={colors.primary_003} />
          ) : (
            <Icon name="visibility" size={22} color={colors.primary_003} />
          )}
        </TouchableOpacity>
      </>
    );
  };
  return (
    <Formik<SignInProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={values => {
        setDataValues(values);
        setIsSubmitData(true);
        // onSubmit;
      }}
      validationSchema={SignInSchema}>
      {({handleSubmit}) => (
        <Container noSpacing>
          <Image
            source={require('../../../assets/images/Splash_vector/top.png')}
            style={styles().topImage}
          />
          {/* <Stack style={styles().flex}> */}
          <KeyboardAwareScrollView
            // behavior="height"
            contentContainerStyle={styles().flexScroll}
            // style={styles().flex}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}
          >
            <Stack spacing={16} style={styles().mainStack}>
              <Stack style={styles().flex}>
                <View style={{}}>
                  <TextView weight="bold" variant={FontSizes.largeHeader}>
                    {t('login:welcome')}
                  </TextView>
                  <TextView
                    weight="medium"
                    variant={FontSizes.xlarge}
                    style={styles().signIn}>
                    {t('login:signIn')}
                  </TextView>
                </View>
                <StackItem childrenGap={10} spaceBelow={16}>
                  <FormikTextField
                    name="email"
                    label={t('login:email')}
                    placeholder={t('login:emailPlaceholder')}
                    keyboardType={
                      Platform.OS === 'ios' ? 'ascii-capable' : undefined
                    }
                  />
                  <FormikTextField
                    name="password"
                    label={t('login:password')}
                    placeholder={t('login:passwordPlaceholder')}
                    keyboardType={
                      Platform.OS === 'ios' ? 'ascii-capable' : undefined
                    }
                    // onBlur={() => {
                    //   setHideButton(false);
                    // }}
                    secureTextEntry={showPassword ? true : false}
                    // onFocus={() => setHideButton(true)}
                    RenderRightContainer={RenderRightContainer}
                  />
                </StackItem>
                <Stack>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.small}
                      style={styles().forgot}>
                      {t('login:forgotPassword')}
                    </TextView>
                  </TouchableOpacity>
                  <PrimaryButton
                    title={t('login:login')}
                    onPress={handleSubmit}
                  />
                  <StackItem horizontal childrenGap={5} style={styles().orView}>
                    <View style={styles().horizontalLine} />
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles().orText}>
                      {t('login:or')}
                    </TextView>
                    <View style={styles().horizontalLine} />
                  </StackItem>
                  <StackItem style={styles().flex}>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('LoginWithMobileScreen');
                      }}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.medium}
                        style={styles().OTPText}>
                        {t('login:loginWithOTP')}
                      </TextView>
                    </TouchableOpacity>
                    <></>
                  </StackItem>
                </Stack>
              </Stack>
            </Stack>
            <Stack style={styles().imageView}>
              <Image
                source={require('../../../assets/images/Splash_vector/bottom.png')}
                style={styles().bottomImage}
              />
              <Stack style={styles().termsBottomView}>
                <Stack horizontal>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    {t('login:termsAndConditions5')}{' '}
                  </TextView>
                </Stack>

                <Stack horizontal>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CMSScreen', {
                        cameFrom: 'Terms of service',
                      });
                    }}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles().termsText}>
                      {t('login:termsAndConditions2')}{' '}
                    </TextView>
                  </TouchableOpacity>
                  <TextView weight="regular" variant={FontSizes.regular}>
                    {t('login:termsAndConditions3')}{' '}
                  </TextView>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('CMSScreen', {
                        cameFrom: 'Privacy policy',
                      });
                    }}>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles().termsText}>
                      {t('login:termsAndConditions4')}
                    </TextView>
                  </TouchableOpacity>
                </Stack>
              </Stack>
            </Stack>
          </KeyboardAwareScrollView>
          {/* </Stack> */}
          {(isLoading || isLoadingLoginUser || isLoadingCompanyData) && (
            <Loader message="Logging you in" />
          )}
          <ConfirmationModal
            isVisible={isConfModalVisible}
            closeModal={() => {
              setIsConsent(consentStatus.pending);
              setIsConfModalVisible(false);
            }}
            onAccept={() => {
              setIsConsent(consentStatus.accepted);
              handleSubmit();
              setIsConfModalVisible(false);
            }}
            data={loginUserData?.data!}
          />
          {/* {!hideButton && (
            <Image
              source={require('../../../assets/images/Splash_vector/bottom.png')}
              style={styles().bottomImage}
            />
          )}
          {!hideButton && (
            <Stack style={styles().termsBottomView}>
              <Stack horizontal>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('login:termsAndConditions1')}{' '}
                </TextView>
              </Stack>

              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles().termsText}>
                  {t('login:termsAndConditions2')}{' '}
                </TextView>
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('login:termsAndConditions3')}{' '}
                </TextView>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles().termsText}>
                  {t('login:termsAndConditions4')}
                </TextView>
              </Stack>
            </Stack>
          )} */}
        </Container>
      )}
    </Formik>
  );
};

const styles = () => {
  const loginStyles = StyleSheet.create({
    flex: {flex: 1},
    flexScroll: {
      flexGrow: 1,
      justifyContent: 'space-between',
    },
    topImage: {
      position: 'absolute',
      right: 0,
    },
    bottomImage: {
      position: 'absolute',
      left: -70,
      bottom: 0,
    },
    mainStack: {
      flex: 1,
      marginTop: Dimensions.get('screen').height > 700 ? 150 : 50,
    },
    signIn: {
      marginTop: 20,
      marginBottom: 16,
    },
    label: {
      marginBottom: 5,
    },
    forgot: {
      // marginVertical: 5,
      textAlign: 'right',
      color: colors.primary_002,
      marginBottom: 20,
    },
    attachmentView: {
      backgroundColor: colors.white,
    },
    attachmentIcon: {
      // justifyContent: 'center',
      // right: 30,
      // top: 3,
    },
    image: {
      height: 22,
      width: 22,
    },
    error: {
      fontSize: FontSizes.small,
      color: colors.red_002,
    },
    termsText: {color: colors.primary_002},
    termsView: {marginBottom: 16},
    horizontalLine: {height: 2, width: 98, backgroundColor: colors.primary_003},
    orText: {color: colors.primary_003},
    orView: {
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 16,
      marginTop: Platform.OS === 'ios' ? 100 : 20,
      flex: 1,
    },
    OTPText: {
      justifyContent: 'center',
      textAlign: 'center',
      color: colors.primary,
    },
    termsBottomView: {
      position: 'absolute',
      bottom: Platform.OS === 'ios' ? 10 : 0,
      alignSelf: 'center',
    },
    imageView: {
      flex: 1,
      justifyContent: 'flex-end',
      height:
        Platform.OS === 'android' && Dimensions.get('screen').height > 860
          ? // ? Dimensions.get('screen').height * 0.23
            // : Dimensions.get('screen').height * 0.19,
            //with forgot password
            Dimensions.get('screen').height * 0.19
          : Dimensions.get('screen').height * 0.15,
    },
  });
  return loginStyles;
};
