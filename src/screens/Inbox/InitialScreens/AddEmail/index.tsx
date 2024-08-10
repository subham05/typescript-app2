import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import Header from 'components/Header';
import {StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSharedValue} from 'react-native-reanimated';
import {Stack} from 'stack-container';
import {AddEmailFormikProps} from './types';
import {AddEmailSchema} from './utils';

export type InboxNavProps = NativeStackScreenProps<
  EmailStackParamList,
  'AddEmail'
>;

export const AddEmail = (props: InboxNavProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const InitialValues: AddEmailFormikProps = {
    email: '',
  };

  return (
    <Formik<AddEmailFormikProps>
      initialValues={InitialValues}
      onSubmit={values => {
        console.log('the values-->', values);
        props.navigation.navigate('AccountType', {
          email: values?.email,
        });
      }}
      validationSchema={AddEmailSchema}>
      {({handleSubmit}) => {
        return (
          <Container noSpacing>
            <Header
              label={t('inboxPage:addEmailTitle')}
              translateY={translateY}
            />
            <Stack style={styles().initialTop}>
              <KeyboardAwareScrollView>
                <StackItem childrenGap={16} spacing={16} spaceBelow={16}>
                  <FormikTextField
                    name="email"
                    label={t('inboxPage:emailAddressLabel')}
                    placeholder={t('inboxPage:emailAddressPlaceholder')}
                    keyboardType="email-address"
                  />
                  <Stack>
                    <TouchableOpacity>
                      <TextView style={styles().manualSetupColor}>
                        Manual Setup
                      </TextView>
                    </TouchableOpacity>
                  </Stack>
                  <Stack
                    style={{marginTop: Dimensions.get('screen').height / 2}}>
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
