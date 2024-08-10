import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import {RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {useSendEmailOTPMutation} from 'request/Authentication';
import {InitialValues} from './constants';
import {ForgotPasswordFormikProps} from './types';
import {ForgotPasswordSchema} from './utils';

type ForgotPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'ForgotPassword'
>;

export const ForgotPasswordScreen = ({navigation}: ForgotPasswordProps) => {
  const {t} = useTranslation();

  const [email, setEmail] = useState<string>('');
  // const [emailTouched, setEmailTouched] = useState<boolean>(false);
  // const [hideButton, setHideButton] = useState<boolean>(false);

  const [sendOtp, {isSuccess, isLoading, data, isError}] =
    useSendEmailOTPMutation();
  useEffect(() => {
    console.log('data', data);
    if (isSuccess && data?.success && email) {
      console.log('I am going in', email);
      navigation.navigate('VerifyOTP', {email: email!});
    } else if (isSuccess && data?.success === false) {
      console.log('I am going in else if');
      showToast(data?.message);
    } else if (isError) {
      showToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError]);

  const onSubmit = (values: ForgotPasswordFormikProps) => {
    let emailVal = values.email.toLowerCase();
    let obj = {...values, email: emailVal};
    setEmail(emailVal);
    sendOtp(obj);
  };
  return (
    <Formik<ForgotPasswordFormikProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={onSubmit}
      validationSchema={ForgotPasswordSchema}>
      {({handleSubmit}) => (
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
            {/* <Ripple onPress={() => navigation.goBack()}>
              <Icon name="arrow_back" size={24} color={colors.black} />
            </Ripple> */}
          </Stack>
          <Stack style={styles.flex}>
            <KeyboardAvoidingView
              behavior="height"
              style={styles.flex}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
              <StackItem childrenGap={18} spacing={16} style={styles.mainStack}>
                <TextView weight="bold" variant={FontSizes.mediumHeader}>
                  {t('forgotPassword:forgotPassword')}
                </TextView>
                <StackItem childrenGap={5}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.medium}
                    style={styles.signIn}>
                    {t('forgotPassword:titleText_1')}
                  </TextView>
                  <FormikTextField
                    name="email"
                    label={t('login:email')}
                    placeholder={t('login:emailPlaceholder')}
                    keyboardType="email-address"
                    // onBlur={() => {
                    //   setHideButton(false);
                    // }}
                    // onFocus={() => setHideButton(true)}
                  />
                  {/* <StackItem childrenGap={5}>
                  <TextView weight="regular" variant={FontSizes.small}>
                    {t('login:email')}
                  </TextView>
                  <InputTextField
                    placeholder={t('login:emailPlaceholder')}
                    onChangeText={handleChange('email')}
                    value={values.email}
                    onBlur={() => {
                      setFieldTouched('email');
                      // setEmail(values.email);
                      setHideButton(false);
                    }}
                    onFocus={() => setHideButton(true)}
                    isError={touched.email && errors.email ? true : false}
                  />
                  {touched.email && errors.email && (
                    <TextView
                      children={errors.email}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                </StackItem> */}
                </StackItem>
                <View style={styles.paddingButton} />
                <PrimaryButton
                  title={t('forgotPassword:next')}
                  onPress={handleSubmit}
                />
              </StackItem>
            </KeyboardAvoidingView>
            <Stack style={{height: Dimensions.get('screen').height * 0.2}}>
              <Image
                source={require('../../../assets/images/Splash_vector/bottom.png')}
                style={styles.bottomImage}
              />
            </Stack>
          </Stack>
          {isLoading && <Loader />}
        </Container>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  backIcon: {
    marginTop: 10,
  },
  topImage: {
    position: 'absolute',
    right: 0,
  },
  bottomImage: {
    position: 'absolute',
    left: 0,
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
  paddingButton: {
    marginBottom: 15,
  },
  error: {
    fontSize: FontSizes.small,
    color: colors.red_002,
  },
});
