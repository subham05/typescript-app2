import {colors} from 'common/theme/colors';
import {showToast} from 'common/utils/ToastMessage';
import {Container} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import React, {FC, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {
  ChangePassBody,
  useChangePasswordMutation,
} from 'request/ChangePassword';
import {ChangePassProps, RenderRightProps} from './types';
import {ChangePassSchema} from './utils';
import {styles} from './index.styles';
import {FontSizes} from 'common/theme/font';

const ChangePassword = () => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);

  const [showOldPass, setShowOldPass] = useState<boolean>(true);
  const [showNewPass, setShowNewPass] = useState<boolean>(true);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(true);

  const [changePassApi, {isLoading}] = useChangePasswordMutation();

  const InitialValues: ChangePassProps = {
    oldPass: '',
    newPass: '',
    confirmPass: '',
  };

  const onSaveClicked = (values: ChangePassProps) => {
    const bodyObj: ChangePassBody = {
      oldPassword: values.oldPass,
      newPassword: values.newPass,
      confirmPassword: values.confirmPass,
    };
    changePassApi(bodyObj).then((res: any) => {
      if (res.error && res.error.data.error.length) {
        showToast(res.error.data.error[0].msg);
      } else {
        showToast(res.data.message);
      }
    });
  };

  const RenderRightContainer: FC<RenderRightProps> = ({
    showPass,
    setShowPass,
  }) => {
    return (
      <TouchableOpacity onPress={() => setShowPass(!showPass)}>
        {showPass ? (
          <Icon name="visibility_off" size={22} color={colors.primary_003} />
        ) : (
          <Icon name="visibility" size={22} color={colors.primary_003} />
        )}
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Formik<ChangePassProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={values => {
        onSaveClicked(values);
      }}
      validationSchema={ChangePassSchema}>
      {({handleSubmit}) => (
        <Container noSpacing>
          <Header
            // navigationType="STACK"
            translateY={translateY}
            label={t('drawer:changePass')}
          />
          <Stack spacing={16} spaceBelow={16} style={styles.mainStack}>
            <KeyboardAwareScrollView contentContainerStyle={styles.scrollView}>
              <StackItem
                childrenGap={10}
                spaceBelow={16}
                style={styles.mainStack}>
                <FormikTextField
                  name="oldPass"
                  label={'Old password'}
                  placeholder={t('login:oldPasswordPlaceholder')}
                  secureTextEntry={showOldPass ? true : false}
                  RenderRightContainer={() => {
                    return (
                      <RenderRightContainer
                        showPass={showOldPass}
                        setShowPass={setShowOldPass}
                      />
                    );
                  }}
                />
                <FormikTextField
                  name="newPass"
                  label={'New password'}
                  placeholder={t('login:newPasswordPlaceholder')}
                  secureTextEntry={showNewPass ? true : false}
                  RenderRightContainer={() => {
                    return (
                      <RenderRightContainer
                        showPass={showNewPass}
                        setShowPass={setShowNewPass}
                      />
                    );
                  }}
                />
                <FormikTextField
                  name="confirmPass"
                  label={'Confirm password'}
                  placeholder={t('login:confirmPasswordPlaceholder')}
                  secureTextEntry={showConfirmPass ? true : false}
                  RenderRightContainer={() => {
                    return (
                      <RenderRightContainer
                        showPass={showConfirmPass}
                        setShowPass={setShowConfirmPass}
                      />
                    );
                  }}
                />
              </StackItem>
              <Stack spacing={16} style={styles.buttonStyle}>
                <PrimaryButton
                  alignButton
                  // disabled={!isValid}
                  fontSize={FontSizes.regular}
                  title={t('save')}
                  onPress={handleSubmit}
                />
              </Stack>
            </KeyboardAwareScrollView>
          </Stack>
        </Container>
      )}
    </Formik>
  );
};

export default ChangePassword;
