import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {RadioButton} from 'components/RadioButton';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {genderData} from 'screens/AddOwner';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AddOwnerProps} from './types';
import {AddOwnerSchema} from './utils';

type Props = NativeStackScreenProps<ManagerSignedInStackParamList, 'AddVendor'>;
export const AddVendorScreen = (props: Props) => {
  const {t} = useTranslation();

  const {route} = {...props};
  const {edit} = {...route.params};

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  // const [isDatePickerVisible, setDatePickerVisibility] =
  //   useState<boolean>(false);

  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };

  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  // const handleConfirm = () => {
  //   hideDatePicker();
  //   // const day   = pickeddate.getDate();
  //   // const month = pickeddate.getMonth();
  //   // const year  = pickeddate.getFullYear();
  //   // const monthName= moment().month(month).format("MMMM");
  //   // // pickeddate.setMonth(month);
  //   // // const monthName = pickeddate.toLocaleString("default", {month: "long"});
  //   // setDOB(day + ' ' + monthName + ' ' + year)
  //   // setDate(year+'-'+(month+1)+'-'+day)
  // };

  const renderLeftContainer = () => {
    return (
      <Stack>
        <Menu>
          <MenuTrigger>
            <Icon
              name="more"
              size={20}
              color={colors.black}
              style={styles.moreIcon}
            />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={styles.moreContainer}>
            <MenuOption
              onSelect={() => {
                setDeleteModal(true);
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('delete')}
                </TextView>
              </Stack>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Stack>
    );
  };

  const handleSubmit = () => {};

  const styles = Styles();
  return (
    <Formik<AddOwnerProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={() => handleSubmit()}
      validationSchema={AddOwnerSchema}>
      {({values, handleChange, errors, setFieldTouched, isValid}) => (
        <Container noSpacing>
          <Header
            navigationType="STACK"
            label={edit ? t('addOwner:edit') : t('managersHomePage:addVendor')}
            translateY={translateY}
            RenderLeftContainer={edit ? renderLeftContainer : undefined}
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
              <Stack spaceBelow={100}>
                <Stack spacing={16} spaceBelow={16}>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('managersHomePage:companyName')}
                      placeholder={t('managersHomePage:companyName')}
                      onChangeText={handleChange('companyName')}
                      value={values.companyName}
                      onBlur={() => setFieldTouched('companyName')}
                    />
                    {errors.companyName && (
                      <TextView
                        children={errors.companyName}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('managersHomePage:vendorName')}
                      placeholder={t('managersHomePage:vendorName')}
                      onChangeText={handleChange('name')}
                      value={values.name}
                      onBlur={() => setFieldTouched('name')}
                    />
                    {errors.name && (
                      <TextView
                        children={errors.name}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.genderLabel}>
                    {t('managersHomePage:gender')}
                  </TextView>
                  <Stack spaceBelow={16}>
                    <RadioButton data={genderData} />
                  </Stack>
                  {/* <Stack horizontal style={styles.label}>
                    <TouchableOpacity style={styles.gender}>
                      <Stack horizontal>
                        <Icon
                          name="radio_button_checked"
                          size={18}
                          style={styles.icon}
                        />
                        <TextView
                          weight="regular"
                          variant={FontSizes.regular}
                          style={styles.genderText}>
                          Male
                        </TextView>
                      </Stack>
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Stack horizontal>
                        <Icon
                          name="radio_button_unchecked"
                          size={18}
                          style={styles.icon}
                        />
                        <TextView
                          weight="regular"
                          variant={FontSizes.regular}
                          style={styles.genderText}>
                          Female
                        </TextView>
                      </Stack>
                    </TouchableOpacity>
                  </Stack> */}
                  {/* <StackItem childrenGap={5}>
                    <TextView weight="regular" variant={FontSizes.small}>
                      {t('managersHomePage:dob')}
                    </TextView>
                    <TouchableOpacity
                      onPress={() => {
                        showDatePicker();
                      }}>
                      <Stack horizontal style={styles.inputDate}>
                        <TextView
                          weight="regular"
                          variant={FontSizes.small}
                          style={styles.date}>
                          DD/MM/YY
                        </TextView>
                        <Icon
                          name="calendar"
                          size={18}
                          style={styles.calendar}
                        />
                      </Stack>
                    </TouchableOpacity>
                    <DateTimePickerModal
                      minimumDate={new Date()}
                      isVisible={isDatePickerVisible}
                      isDarkModeEnabled={
                        Appearance.getColorScheme() === 'dark' ? true : false
                      }
                      mode="date"
                      onConfirm={handleConfirm}
                      onCancel={hideDatePicker}
                    />
                    {touched.dob && errors.dob && (
                      <TextView
                        children={errors.dob}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem> */}
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('managersHomePage:address')}
                      placeholder={t('managersHomePage:address')}
                      onChangeText={handleChange('address')}
                      value={values.address}
                      onBlur={() => setFieldTouched('address')}
                    />
                    {errors.address && (
                      <TextView
                        children={errors.address}
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('managersHomePage:email')}
                      placeholder={t('managersHomePage:email')}
                      onChangeText={handleChange('email')}
                      value={values.email}
                      onBlur={() => setFieldTouched('email')}
                    />
                    {errors.email && (
                      <TextView
                        children={errors.email}
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('addOwner:contactNumber')}
                      placeholder={t('addOwner:contactNumber')}
                      onChangeText={handleChange('number')}
                      value={values.number}
                      onBlur={() => setFieldTouched('number')}
                    />
                    {errors.number && (
                      <TextView
                        children={errors.number}
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('addOwner:alternate_contactNumber')}
                      placeholder={t('addOwner:alternate_contactNumber')}
                      onChangeText={handleChange('alternateNumber')}
                      value={values.alternateNumber}
                      onBlur={() => setFieldTouched('alternateNumber')}
                    />
                    {errors.alternateNumber && (
                      <TextView
                        children={errors.alternateNumber}
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                </Stack>
              </Stack>
            </KeyboardAwareScrollView>
          </Animated.ScrollView>
          {edit ? (
            <Stack spacing={16} spaceBelow={16}>
              <PrimaryButton title={t('save')} onPress={() => {}} />
            </Stack>
          ) : (
            <Stack
              spacing={16}
              horizontal
              horizontalAlign="space-between"
              center>
              <TouchableOpacity disabled={!isValid} style={styles.saveButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.small}
                  style={styles.save}>
                  {t('save')}
                </TextView>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} style={styles.addMoreButton}>
                <TextView
                  weight="medium"
                  variant={FontSizes.small}
                  style={styles.addMore}>
                  {t('addMore')}
                </TextView>
              </TouchableOpacity>
            </Stack>
          )}
          {deleteModal && (
            <Modal isVisible={deleteModal}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.medium}
                    style={styles.shareVia}>
                    {t('homePage:alertVendor')}
                  </TextView>
                  <Stack horizontal style={styles.modal}>
                    <TextView
                      weight="semibold"
                      variant={FontSizes.regular}
                      style={styles.reopenModal}
                      onPress={() => setDeleteModal(false)}>
                      {t('cancel')}
                    </TextView>
                    <TextView
                      weight="semibold"
                      variant={FontSizes.regular}
                      style={styles.reopenModal}
                      onPress={() => {
                        setDeleteModal(false);
                      }}>
                      {t('delete')}
                    </TextView>
                  </Stack>
                </View>
              </View>
            </Modal>
          )}
        </Container>
      )}
    </Formik>
  );
};
