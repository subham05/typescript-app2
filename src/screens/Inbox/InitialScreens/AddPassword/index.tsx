import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Platform, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {Stack} from 'stack-container';
import {AddPasswordFormikProps} from './types';
import {AddPasswordSchema} from './utils';

export type InboxNavProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<EmailStackParamList, 'AddEmailPassword'>
>;

export const AddEmailPassword = (props: InboxNavProps) => {
  const {t} = useTranslation();

  const [showPassword, setShowPassword] = useState(true);
  const translateY = useSharedValue(0);

  const InitialValues: AddPasswordFormikProps = {
    password: '',
  };

  const RenderRightContainer = () => {
    return (
      <>
        <TouchableOpacity
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
    <Formik<AddPasswordFormikProps>
      initialValues={InitialValues}
      onSubmit={values => {
        console.log('the values-->', values);
        props.navigation.navigate('ServerSetting', {
          email: props.route?.params?.email,
        });
      }}
      validationSchema={AddPasswordSchema}>
      {({handleSubmit}) => {
        return (
          <Container noSpacing>
            <Header
              label={props.route.params?.email}
              navigationType="STACK"
              translateY={translateY}
            />
            <Stack style={styles().initialTop}>
              <KeyboardAwareScrollView>
                <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
                  <FormikTextField
                    name="password"
                    label={t('inboxPage:password')}
                    placeholder={t('inboxPage:passwordPlaceholder')}
                    keyboardType={
                      Platform.OS === 'ios' ? 'ascii-capable' : undefined
                    }
                    secureTextEntry={showPassword}
                    RenderRightContainer={RenderRightContainer}
                  />
                  <Stack
                    style={{marginTop: Dimensions.get('screen').height / 1.8}}>
                    <PrimaryButton
                      alignButton
                      title={t('inboxPage:next')}
                      fontSize={FontSizes.regular}
                      onPress={handleSubmit}
                    />
                  </Stack>
                </StackItem>
              </KeyboardAwareScrollView>
            </Stack>
          </Container>
        );
      }}
    </Formik>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    emailLabel: {
      marginTop: 20,
      marginBottom: 16,
    },
    headingBottom: {
      marginBottom: 16,
    },
    buttonStyle: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    addMoreButton: {
      marginTop: 15,
      width: '94%',
      marginBottom: 16,
      borderRadius: 3,
    },
    manualSetupColor: {
      color: colors.primary,
    },
    initialTop: {
      marginTop: 16,
    },
  });
  return mergeStyles;
};
