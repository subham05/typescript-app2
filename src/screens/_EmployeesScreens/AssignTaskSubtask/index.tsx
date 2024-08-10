import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import {DropDownView} from 'components/DropDownView';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {PriorityComponent} from 'components/Priority';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AssignTaskSubtaskScreenProps} from './types';
import {AssignTaskSubtaskSchema} from './utils';
import {MemberList} from 'components/MembersList/MemberList';
import {modalMembersList} from 'screens/ShareContact/mockDataModal';

export const EmployeeAssignTaskSubtaskScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [titleValue, setTitleValue] = useState<string>('');
  const allTitleData = [
    {label: 'Project', value: 'Project'},
    {label: 'Task', value: 'Task'},
    {label: 'Goal', value: 'Goal'},
  ];
  const [addValue, setAddValue] = useState<string>('');
  const allAddData = [
    {label: 'Task', value: 'Task'},
    {label: 'Subtask', value: 'Subtask'},
  ];
  // const [assignValue, setAssignValue] = useState<string>('');
  // const [reportValue, setReportValue] = useState<string>('');

  // const allAssignData = [
  //   {label: 'Assign to me', value: 'Assign to me'},
  //   {label: 'Manager', value: 'Manager'},
  //   {label: 'Manager name', value: 'Manager name'},
  // ];

  // const allReportData = [
  //   {label: 'Manager', value: 'Manager'},
  //   {label: 'Manager name', value: 'Manager name'},
  // ];

  const [assignToModal, setAssignToModal] = useState<boolean>(false);

  const handleSubmit = () => {};

  const renderItem = (item: any) => {
    return (
      <StackItem style={styles.item} childrenGap={10}>
        <TextView weight="regular" variant={FontSizes.regular}>
          {item.label}
        </TextView>
        <Divider size={1.5} />
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <Formik<AssignTaskSubtaskScreenProps>
      initialValues={InitialValues}
      validateOnMount
      onSubmit={() => handleSubmit()}
      validationSchema={AssignTaskSubtaskSchema}>
      {({
        values,
        handleChange,
        errors,
        setFieldTouched,
        isValid,
        setFieldValue,
      }) => (
        <Container noSpacing>
          <Header
            navigationType="STACK"
            label={t('assign:head')}
            translateY={translateY}
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
              <Stack spaceBelow={70}>
                <Stack spacing={16} spaceBelow={16}>
                  <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('assign:title')}
                    data={allTitleData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('assign:dropdownPlaceholder')}
                    value={titleValue}
                    onChange={item => {
                      setFieldValue('title', item.value);
                      setTitleValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('title')}
                    renderItem={renderItem}
                  />
                  {errors.title && (
                    <TextView
                      children={errors.title}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('assign:add')}
                    data={allAddData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('assign:dropdownPlaceholder')}
                    value={addValue}
                    onChange={item => {
                      setFieldValue('add', item.value);
                      setAddValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('add')}
                    renderItem={renderItem}
                  />
                  {errors.add && (
                    <TextView
                      children={errors.add}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  <InputTextField
                    label={t('assign:taskName')}
                    placeholder={t('assign:taskName')}
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
                  <InputTextField
                    label={t('assign:description')}
                    placeholder={t('assign:descriptionPlaceholder')}
                    multiline={true}
                    numberOfLines={4}
                    onChangeText={handleChange('description')}
                    value={values.description}
                    onBlur={() => setFieldTouched('description')}
                  />
                  {errors.description && (
                    <TextView
                      children={errors.description}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  {/* <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('addTask:assignTo')}
                    data={allAssignData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('managersHomePage:managersAssignTo3')}
                    value={assignValue}
                    onChange={item => {
                      setFieldValue('assignTo', item.value);
                      setAssignValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('assignTo')}
                    renderItem={renderItem}
                  />
                  {touched.assignTo && errors.assignTo && (
                    <TextView
                      children={errors.assignTo}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )} */}
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.label}>
                    {t('addTask:assignTo')}
                  </TextView>
                  <TouchableOpacity
                    onPress={() => {
                      setAssignToModal(true);
                    }}>
                    <Stack horizontal style={styles.inputDate}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.small}
                        style={styles.date}>
                        Jenny Wilson | Employee
                      </TextView>
                    </Stack>
                  </TouchableOpacity>
                  {errors.assignTo && (
                    <TextView
                      children={errors.assignTo}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  <Stack horizontal center style={styles.buttonView}>
                    <View style={styles.fieldView}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.small}
                        style={styles.label}>
                        {t('assign:startDate')}
                      </TextView>
                      <DatePicker date="MM DD, YYYY" task />
                      {errors.startDate && (
                        <TextView
                          children={errors.startDate}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )}
                    </View>
                    <View style={styles.fieldView}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.small}
                        style={styles.label}>
                        {t('assign:dueDate')}
                      </TextView>
                      <DatePicker date="MM DD, YYYY" task />
                      {errors.dueDate && (
                        <TextView
                          children={errors.dueDate}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )}
                    </View>
                  </Stack>
                  <PriorityComponent />
                  {errors.priority && (
                    <TextView
                      children={errors.priority}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  <Stack horizontal>
                    <Icon
                      name="attach_file"
                      size={22}
                      color={colors.primary}
                      style={styles.icon}
                    />
                    <TextView
                      weight="medium"
                      variant={FontSizes.medium}
                      style={styles.attachFile}>
                      {t('assign:attachFile')}
                    </TextView>
                  </Stack>
                </Stack>
              </Stack>
            </KeyboardAwareScrollView>
          </Animated.ScrollView>
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('addButton')}
              onPress={() => {}}
              disabled={!isValid}
            />
          </Stack>
          {assignToModal && (
            <Modal
              isVisible={assignToModal}
              style={styles.bottomModal}
              onBackdropPress={() => setAssignToModal(false)}>
              <View style={styles.bottomModalView}>
                <ScrollView>
                  <Stack spacing={16}>
                    <MemberList
                      data={modalMembersList}
                      onPress={() => {
                        setAssignToModal(false);
                      }}
                      isAssignTo
                    />
                  </Stack>
                </ScrollView>
              </View>
            </Modal>
          )}
        </Container>
      )}
    </Formik>
  );
};
