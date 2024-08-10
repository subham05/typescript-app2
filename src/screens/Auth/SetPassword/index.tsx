import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import {Icon} from 'components/Icon';
import {RippleIconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSetPasswordMutation} from 'request/Authentication';
import {InitialValues} from './constants';
import {SetPasswordFormikProps} from './types';
import {SetPasswordSchema} from './utils';

type SetPasswordProps = NativeStackScreenProps<
  AuthStackParamList,
  'SetPassword'
>;

export const SetPasswordScreen = ({navigation, route}: SetPasswordProps) => {
  const {t} = useTranslation();
  const {email} = {
    ...route.params,
  };

  // const [hideButton, setHideButton] = useState<boolean>(false);

  // const [newPassword, setNewPassword] = useState<string>('');
  // const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(true);
  // const [newPasswordTouched, setNewPasswordTouched] = useState<boolean>(false);
  // const [confirmPasswordTouched, setConfirmPasswordTouched] =
  //   useState<boolean>(false);

  const [setPassword, {isSuccess, data, isError}] = useSetPasswordMutation();

  const RenderRightContainerNewPassword = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.attachmentIcon}
          onPress={() => setShowNewPassword(prevState => !prevState)}>
          {showNewPassword ? (
            <Icon name="visibility_off" size={22} color={colors.primary_003} />
          ) : (
            <Icon name="visibility" size={22} color={colors.primary_003} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const RenderRightContainerConfirmPassword = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.attachmentIcon}
          onPress={() => setShowConfirmPassword(prevState => !prevState)}>
          {showConfirmPassword ? (
            <Icon name="visibility_off" size={22} color={colors.primary_003} />
          ) : (
            <Icon name="visibility" size={22} color={colors.primary_003} />
          )}
        </TouchableOpacity>
      </>
    );
  };

  const onSubmit = (values: SetPasswordFormikProps) => {
    let obj = {...values, email: email};
    setPassword(obj);
  };

  useEffect(() => {
    if (isSuccess && data?.success) {
      showToast(data?.message);
      navigation.navigate('Login');
    } else if (isSuccess && !data?.success) {
      showToast(data?.message);
    } else if (isError) {
      showToast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, isError, data]);

  return (
    <Formik<SetPasswordFormikProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={onSubmit}
      validationSchema={SetPasswordSchema}>
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
          </Stack>
          {/* <Stack style={styles.flex}> */}
          <KeyboardAwareScrollView contentContainerStyle={styles.flexScroll}>
            <StackItem childrenGap={45} spacing={16} style={styles.mainStack}>
              <TextView weight="bold" variant={FontSizes.mediumHeader}>
                {t('forgotPassword:setPassword')}
              </TextView>
              <StackItem childrenGap={20}>
                <FormikTextField
                  name="newPassword"
                  label={t('forgotPassword:newPassword')}
                  placeholder={t('forgotPassword:newPassword')}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : undefined
                  }
                  secureTextEntry={showNewPassword ? true : false}
                  RenderRightContainer={RenderRightContainerNewPassword}
                />

                <FormikTextField
                  name="confirmPassword"
                  label={t('forgotPassword:confirmPassword')}
                  placeholder={t('forgotPassword:confirmPassword')}
                  keyboardType={
                    Platform.OS === 'ios' ? 'ascii-capable' : undefined
                  }
                  secureTextEntry={showConfirmPassword ? true : false}
                  RenderRightContainer={RenderRightContainerConfirmPassword}
                />
              </StackItem>
              <PrimaryButton
                title={t('forgotPassword:save')}
                onPress={handleSubmit}
              />
            </StackItem>
            <Stack style={styles.imageStyle}>
              <Image
                source={require('../../../assets/images/Splash_vector/bottom.png')}
                style={styles.bottomImage}
              />
            </Stack>
          </KeyboardAwareScrollView>
          {/* </Stack> */}
        </Container>
      )}
    </Formik>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  flexScroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
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
  label: {
    marginBottom: 5,
  },
  paddingButton: {
    marginBottom: 15,
  },
  icon: {
    marginTop: 45,
    backgroundColor: colors.white,
  },
  attachmentView: {
    backgroundColor: colors.white,
  },
  attachmentIcon: {
    justifyContent: 'center',
    // right: 30,
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
  imageStyle: {
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
