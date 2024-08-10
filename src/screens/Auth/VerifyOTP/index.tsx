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
import {RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {AuthContext, NavContext} from 'navigation/router';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import BackgroundTimer from 'react-native-background-timer';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import DeviceInfo from 'react-native-device-info';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  LoginBody,
  useLoginMutation,
  useVerifyEmailOtpMutation,
} from 'request/Authentication';
import {useCompanyListingMutation} from 'request/CompanyList';
import {useAppDispatch} from 'store/hooks';
import {setCompanyIdAction, userDataAction} from 'store/Reducer';
import {LatLng} from '../Login';
import {Styles} from './index.styles';

type VerifyOTPProps = NativeStackScreenProps<AuthStackParamList, 'VerifyOTP'>;

export const VerifyOTPScreen = ({navigation, route}: VerifyOTPProps) => {
  const {t} = useTranslation();
  const AVOID_SPECIAL_CHAR_REGEX = /[- #*;,.<>\{\}\[\]\\\/]/gi;
  const {mobile, country, number, email} = {
    ...route.params,
  };
  const dispatch = useAppDispatch();

  const [
    getCompanies,
    {
      data: companyData,
      isLoading: isLoadingCompanyData,
      // error: companyError,
    },
  ] = useCompanyListingMutation();

  const [
    verifyOtp,
    {
      isSuccess: isSuccesEmailOtp,
      data: emailOtpData,
      isLoading: isLoadingEmailOtp,
      // error: errorEmailOtpData,
      isError: isErrorEmailOtpData,
    },
  ] = useVerifyEmailOtpMutation();

  const submitEmailOtp = () => {
    if (value?.length < 4) {
      showToast('OTP should be 4 digits only');
    } else {
      verifyOtp({email: email!, otp: value});
    }
  };

  const {saveSelectCompany} = useContext(NavContext);

  const CELL_COUNT = 4;
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [timer, setTimer] = useState<number>(60);
  const [count, setCount] = useState<string>(timer.toString());

  const [location, setLocation] = useState<LatLng>();
  const [isSubmitData, setIsSubmitData] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocationPermission, setIsLocationPermission] =
    useState<boolean>(false);

  // const startCountdown = () => {
  //   let counter = 10;

  //   const interval = setInterval(() => {
  //     setCount(
  //       counter === 9 ||
  //         counter === 8 ||
  //         counter === 7 ||
  //         counter === 6 ||
  //         counter === 5 ||
  //         counter === 4 ||
  //         counter === 3 ||
  //         counter === 2 ||
  //         counter === 1
  //         ? '0' + counter.toString()
  //         : counter.toString(),
  //     );
  //     counter--;

  //     if (counter < 0) {
  //       clearInterval(interval);
  //     }
  //   }, 1000);
  // };

  const tick = useCallback(() => {
    if (timer !== 0) {
      setTimer(timer - 1);
      if (timer === 10) {
        setCount('09');
      } else if (timer.toString().length === 1) {
        setCount('0' + (timer - 1).toString());
      } else {
        setCount((timer - 1).toString());
      }
    }
  }, [timer]);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      BackgroundTimer.start();
    }
    const timerID = BackgroundTimer.setInterval(() => tick(), 1000);
    return () => BackgroundTimer.clearInterval(timerID);
  }, [tick]);

  // useEffect(() => {
  //   startCountdown();
  // }, []);

  const {signIn} = useContext(AuthContext);

  const signInFunction = async (type: string) => {
    await AsyncStorage.removeItem(STR_KEYS.USERTYPE);
    if (type === 'MANAGER') {
      signIn(userTypes.Manager);
    } else if (type === 'OWNER') {
      signIn(userTypes.Owner);
    } else if (type === 'EMPLOYEE') {
      signIn(userTypes.Employee);
    } else if (type === 'GM') {
      signIn(userTypes.GeneralManager);
    } else if (type === 'PA') {
      signIn(userTypes.persoalAssistant);
    } else {
      signIn(userTypes.Vendor);
    }
  };

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

  let deviceUniqueId: string;

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
          });
        } else if (res.result === 'blocked') {
          setIsLocationPermission(false);
        }
      } else {
        setIsLocationPermission(true);
      }
    });
  };

  useEffect(() => {
    takeLocationPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location?.lat) {
      onSubmit(location);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (emailOtpData?.success) {
      showToast(emailOtpData?.message);
      navigation.navigate('SetPassword', {email: email!});
    } else if (emailOtpData?.success === false) {
      showToast(emailOtpData?.message);
    } else if (isErrorEmailOtpData) {
      showToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccesEmailOtp, isErrorEmailOtpData]);

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
    if (isLocationPermission && isSubmitData) {
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
    } else if (!isLocationPermission && isSubmitData) {
      onSubmit();
    }
  };

  useEffect(() => {
    _getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitData, isLocationPermission]);

  useEffect(() => {
    if (
      loginUserData?.data?.selectedCompanyId! &&
      companyData?.data.length! > 0
    ) {
      let selectedCompanyObj = companyData?.data.filter(
        item => item._id === loginUserData?.data?.selectedCompanyId!,
      );
      console.log('breakd', loginUserData?.data);

      dispatch(setCompanyIdAction(selectedCompanyObj));
      saveSelectCompany();
      signInFunction(loginUserData?.data?.role?.type!);
    } else if (
      !loginUserData?.data?.selectedCompanyId! &&
      companyData?.data.length! > 0
    ) {
      signInFunction(loginUserData?.data?.role?.type!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyData?.data, loginUserData?.data?.selectedCompanyId]);

  useEffect(() => {
    setIsLoading(false);
    setIsSubmitData(false);
    if (isSuccess && loginUserData?.success) {
      AsyncStorage.setItem(
        STR_KEYS.LOGINUSERDATA,
        JSON.stringify(loginUserData?.data!),
      );
      dispatch(userDataAction(loginUserData?.data!));
      getCompanies();
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

  const onSubmit = async (loc?: LatLng) => {
    DeviceInfo.getUniqueId().then(res => (deviceUniqueId = res));
    let fcmToken = await AsyncStorage.getItem(STR_KEYS.FCM_TOKEN);
    let selectedLanguage = await AsyncStorage.getItem(
      STR_KEYS.LANGUAGE_SELECTED,
    );
    let bodyObj: LoginBody = {
      isLoginByEmail: false,
      countryCode: country,
      loginFor: 'MOBILE',
      mobile: number,
      otp: value,
      latlong: {
        latitude: loc?.lat || '',
        longitude: loc?.lng || '',
      },
      isLocationEnabled: isLocationPermission,
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
    if (value === '1234') {
      loginUser(bodyObj);
    } else {
      showToast('Please enter correct OTP');
      setIsLoading(false);
      setIsSubmitData(false);
    }
  };

  const styles = Styles;
  return (
    <Container noSpacing>
      <Image
        source={require('../../../assets/images/Splash_vector/top.png')}
        style={styles.topImage}
      />
      <Stack spacing={16} style={styles.backIcon}>
        <RippleIconButton
          name="arrow_back"
          size={24}
          color={colors.black}
          onPress={() => navigation.goBack()}
        />
      </Stack>
      <Stack style={styles.flex}>
        <KeyboardAwareScrollView contentContainerStyle={styles.flexScroll}>
          <StackItem childrenGap={18} spacing={16} style={styles.mainStack}>
            <TextView weight="bold" variant={FontSizes.mediumHeader}>
              {t('forgotPassword:verifyOTP')}
            </TextView>
            {mobile ? (
              <>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.signIn}>
                  {t('forgotPassword:titleText_3')}
                </TextView>
                <TextView weight="medium" variant={FontSizes.medium}>
                  {`+${country} ${number}`}
                  {t('forgotPassword:titleText_4')}
                </TextView>
              </>
            ) : (
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={styles.signIn}>
                {t('forgotPassword:titleText_2')}
              </TextView>
            )}
            <Stack>
              <CodeField
                ref={ref}
                {...props}
                // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                value={value}
                onChangeText={(text: string) =>
                  setValue(text.replace(AVOID_SPECIAL_CHAR_REGEX, ''))
                }
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="numeric"
                textContentType="oneTimeCode"
                renderCell={({index, symbol, isFocused}) => (
                  <View>
                    <TextView
                      weight="semibold"
                      variant={FontSizes.xlarge}
                      key={index}
                      style={[styles.cell, isFocused && styles.focusCell]}
                      onLayout={getCellOnLayoutHandler(index)}>
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </TextView>
                  </View>
                )}
              />
              <Stack horizontal horizontalAlign="space-between">
                <StackItem horizontal childrenGap={10} style={styles.signIn}>
                  <TextView weight="regular" variant={FontSizes.small}>
                    {t('forgotPassword:receivedOTP')}
                  </TextView>
                  {timer === 0 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setCount('60');
                        setTimer(60);
                        setValue('');
                      }}>
                      <TextView
                        weight="medium"
                        variant={FontSizes.small}
                        style={styles.resendOTP}>
                        {t('forgotPassword:resendOTP')}
                      </TextView>
                    </TouchableOpacity>
                  ) : (
                    <TextView
                      weight="medium"
                      variant={FontSizes.small}
                      style={styles.resendOTPDisabled}>
                      {t('forgotPassword:resendOTP')}
                    </TextView>
                  )}
                </StackItem>
                {timer !== 0 && (
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.timer}>
                    00:{count}
                  </TextView>
                )}
              </Stack>
            </Stack>
            <View style={styles.paddingButton} />
            <PrimaryButton
              title={t('forgotPassword:verify')}
              onPress={() => {
                mobile ? setIsSubmitData(true) : submitEmailOtp();
              }}
            />
          </StackItem>
          <Stack
            style={{
              height:
                Platform.OS === 'android' &&
                Dimensions.get('screen').height > 860
                  ? Dimensions.get('screen').height * 0.23
                  : Dimensions.get('screen').height * 0.19,
            }}>
            <Image
              source={require('../../../assets/images/Splash_vector/bottom.png')}
              style={styles.bottomImage}
            />
          </Stack>
        </KeyboardAwareScrollView>
      </Stack>
      {(isLoading || isLoadingLoginUser || isLoadingCompanyData) && (
        <Loader message="Logging you in" />
      )}
      {isLoadingEmailOtp && <Loader />}
    </Container>
  );
};
