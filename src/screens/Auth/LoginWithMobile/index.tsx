import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikPhoneField} from 'components/formikFields/FormikPhoneField';
import {RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {Formik, FormikProps} from 'formik';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {LoginOTP, useLoginOTPMutation} from 'request/Authentication';
import {InitialValues} from './constants';
import {SignInWIthMobileProps} from './types';
import {SignInWithMobileSchema} from './utils';

type HomeScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginWithMobileScreen'
>;

export const LoginWithMobileScreen = ({navigation}: HomeScreenProps) => {
  const {t} = useTranslation();
  const formikRef = useRef<FormikProps<SignInWIthMobileProps> | null>(null);

  const [
    getOTP,
    {
      isLoading,
      isError: isErrorLoginUser,
      isSuccess,
      error: LoginUserError,
      data: loginUserData,
    },
  ] = useLoginOTPMutation();

  // let isLoading = isLoadingLoginUser;

  // const [emailId, setEmail] = useState<string>('owner@email.com');
  // const [password, setPassword] = useState<string>('');

  // const [hideButton, setHideButton] = useState<boolean>(false);
  // const [isSelected, setIsSelected] = useState<boolean>(false);

  // const [reset, setReset] = useState<boolean>(false);

  const [countryCode, setCountryCode] = useState<string>('91');
  const [mobile, setMobile] = useState<string>('');
  const [shortCode, setShortCode] = useState<any>('IN');

  useEffect(() => {
    if (isSuccess && loginUserData?.success) {
      navigation.navigate('VerifyOTP', {
        mobile: true,
        country: countryCode,
        number: mobile,
      });
    } else if (isSuccess && !loginUserData?.success) {
      showToast(loginUserData?.message);
    } else if (isErrorLoginUser) {
      showToast(JSON.stringify(LoginUserError));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    LoginUserError,
    isErrorLoginUser,
    isSuccess,
    loginUserData,
    loginUserData?.message,
  ]);

  const onSubmit = (values: SignInWIthMobileProps) => {
    Keyboard.dismiss();
    setMobile(values.mobile);
    let bodyObj: LoginOTP = {
      countryCode: countryCode,
      mobile: values.mobile,
    };

    getOTP(bodyObj);
    // navigation.navigate('VerifyOTP', {
    //   mobile: true,
    //   country: countryCode,
    //   number: values.mobile,
    // });
  };
  useEffect(() => {
    setShortCode('JO');
  }, []);

  return (
    <Formik<SignInWIthMobileProps>
      initialValues={InitialValues}
      innerRef={formikRef}
      validateOnMount
      onSubmit={onSubmit}
      enableReinitialize
      validationSchema={SignInWithMobileSchema}>
      {({
        // values,
        // setFieldValue,
        // resetForm,
        handleSubmit,
      }) => {
        // const resetData = () => {
        //   setReset(true);
        //   resetForm({values: InitialValues});
        //   setReset(false);
        // };
        return (
          <Container noSpacing>
            <Image
              source={require('../../../assets/images/Splash_vector/top.png')}
              style={styles().topImage}
            />
            <Stack spacing={16} style={styles().backIcon}>
              <RippleIconButton
                name="arrow_back"
                size={24}
                color={colors.black}
                onPress={() => navigation.goBack()}
              />
            </Stack>
            <KeyboardAwareScrollView
              // behavior="height"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles().flexScroll}
              keyboardShouldPersistTaps="handled"
              bounces={false}
              overScrollMode={'never'}
              // keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}
            >
              <Stack style={styles().flex}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <Stack spacing={16} style={styles().mainStack}>
                    <TextView weight="bold" variant={FontSizes.largeHeader}>
                      {t('login:welcome')}
                    </TextView>
                    <TextView
                      weight="medium"
                      variant={FontSizes.xlarge}
                      style={styles().signIn}>
                      {t('login:signIn')}
                    </TextView>
                    <Stack spaceBelow={16}>
                      <FormikPhoneField
                        // ref={phoneInput}
                        label={t('login:mobileNo')}
                        placeholder={t('login:mobileNoPlaceholder')}
                        defaultCode={shortCode}
                        layout="first"
                        containerStyle={styles().contactContainerStyle}
                        onChangeCountry={country => {
                          setCountryCode(`${country.callingCode[0]}`);
                          // setFieldValue(
                          //   'contactPhoneCountryCode',
                          //   `+${country.callingCode[0]}`,
                          // );
                        }}
                        name="mobile"
                        // resetValues={reset}
                      />
                      {/* <FormikTextField
                      name="mobile"
                      label={t('login:mobileNo')}
                      placeholder={t('login:mobileNoPlaceholder')}
                      keyboardType="number-pad"
                      // onBlur={() => {
                      //   setHideButton(false);
                      // }}
                      // onFocus={() => setHideButton(true)}
                    /> */}
                      {/* <StackItem childrenGap={5}>
                  <TextView weight="regular" variant={FontSizes.small}>
                    {t('login:mobileNo')}
                  </TextView>
                  <InputTextField
                    placeholder={t('login:mobileNoPlaceholder')}
                    onChangeText={handleChange('mobile')}
                    value={values.mobile}
                    onBlur={() => {
                      setFieldTouched('mobile');
                      setHideButton(false);
                    }}
                    onFocus={() => setHideButton(true)}
                    number
                    isError={touched.mobile && errors.mobile ? true : false}
                  />
                  {touched.mobile && errors.mobile && (
                    <TextView
                      children={errors.mobile}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles().error}
                    />
                  )}
                </StackItem> */}
                    </Stack>
                    <PrimaryButton
                      title={t('login:proceed')}
                      onPress={handleSubmit}
                    />
                  </Stack>
                </TouchableWithoutFeedback>

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
              </Stack>
            </KeyboardAwareScrollView>

            {isLoading && <Loader />}
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
                  {t('login:termsAndConditions5')}{' '}
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
        );
      }}
    </Formik>
  );
};

const styles = () => {
  const loginStyles = StyleSheet.create({
    flex: {flex: 1},
    flexScroll: {flexGrow: 1, justifyContent: 'space-between'},
    backIcon: {
      marginTop: 10,
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
      marginTop: 130,
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
      justifyContent: 'center',
      right: 30,
      top: 3,
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
    },
    OTPtext: {
      justifyContent: 'center',
      textAlign: 'center',
      color: colors.primary,
    },
    termsBottomView: {
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    contactContainerStyle: {
      height: 50,
      width: '100%',
      backgroundColor: colors.white,
    },
  });
  return loginStyles;
};
