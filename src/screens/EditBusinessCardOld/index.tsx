import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {FormikTextField} from 'components/formikFields';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {EditBusinessCardProps} from './types';
import {EditBusinessCardSchema} from './utils';

export const EditBusinessCard = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const onSubmit = () => {};

  const styles = Styles();
  return (
    <Formik<EditBusinessCardProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={() => onSubmit()}
      validationSchema={EditBusinessCardSchema}>
      {({handleSubmit}) => (
        <Container noSpacing>
          <Header
            navigationType="STACK"
            label={t('businessCard:head')}
            translateY={translateY}
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
              <StackItem childrenGap={16} spacing={16} spaceBelow={100}>
                <Stack>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.input}>
                    Company name
                  </TextView>
                </Stack>
                <FormikTextField
                  name="username"
                  label={t('businessCard:userName')}
                  placeholder={t('businessCard:userName')}
                />
                <FormikTextField
                  name="designation"
                  label={t('businessCard:designation')}
                  placeholder={t('businessCard:designation')}
                />
                <FormikTextField
                  name="email"
                  label={t('businessCard:workEmail')}
                  placeholder={t('businessCard:workEmailPlaceholder')}
                />
                <FormikTextField
                  name="number"
                  label={t('businessCard:contactNumber')}
                  placeholder={t('businessCard:contactNumber')}
                  keyboardType="number-pad"
                />
                <FormikTextField
                  name="address"
                  label={t('businessCard:address')}
                  placeholder={t('businessCard:address')}
                />
                <StackItem horizontal childrenGap={16}>
                  <TouchableOpacity>
                    <StackItem
                      horizontal
                      verticalAlign="center"
                      childrenGap={10}>
                      <Icon
                        name="public_mark"
                        size={20}
                        color={colors.primary_007}
                      />
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={{color: colors.primary_007}}>
                        {t('contacts:markPublic')}
                      </TextView>
                    </StackItem>
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <StackItem
                      horizontal
                      verticalAlign="center"
                      childrenGap={10}>
                      <Icon
                        name="private_mark"
                        size={20}
                        color={colors.primary}
                      />
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={{color: colors.primary}}>
                        {t('contacts:markPrivate')}
                      </TextView>
                    </StackItem>
                  </TouchableOpacity>
                </StackItem>
              </StackItem>
            </KeyboardAwareScrollView>
            <Stack spacing={16} spaceBelow={16}>
              <PrimaryButton
                title={t('save')}
                onPress={() => {
                  handleSubmit();
                }}
              />
            </Stack>
          </Animated.ScrollView>
        </Container>
      )}
    </Formik>
  );
};
