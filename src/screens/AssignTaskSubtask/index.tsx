import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import {DropDownView} from 'components/DropDownView';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {InputTextField, SearchTextField} from 'components/InputView';
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
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AssignTaskSubtaskScreenProps} from './types';
import {AssignTaskSubtaskSchema} from './utils';
import Modal from 'react-native-modal';
import {MemberList} from 'components/MembersList/MemberList';
import {modalMembersList} from 'screens/ShareContact/mockDataModal';
import {membersProps} from 'components/Members/MembersItem';
import {RippleIconButton} from 'components/IconButtons';
import {MemberItem} from 'components/MembersList/MemberItem';
import {Persona} from 'components/Persona';

const userImage =
  'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

export const AssignTaskSubtaskScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [companyValue, setCompanyValue] = useState<string>('');
  const allCompanyData = [
    {label: 'The Walt Disney Company', value: 'The Walt Disney Company'},
    {label: 'Google', value: 'Google'},
    {label: 'Infosys', value: 'Infosys'},
    {label: 'Wipro', value: 'Wipro'},
    {label: 'ZTech Solutions', value: 'ZTech Solutions'},
    {label: 'Slack', value: 'Slack'},
    {label: 'Microsoft', value: 'Microsoft'},
  ];
  const [titleValue, setTitleValue] = useState<string>('');
  const allTitleData = [
    {label: 'Project', value: 'Project'},
    {label: 'Task', value: 'Task'},
    {label: 'Goal', value: 'Goal'},
  ];
  // const [addValue, setAddValue] = useState<string>('');
  // const allAddData = [
  //   {label: 'Task', value: 'Task'},
  //   {label: 'Subtask', value: 'Subtask'},
  // ];
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
  const [reportToModal, setReportToModal] = useState<boolean>(false);

  const [selfAssigned, setSelfAssigned] = useState<boolean>(true);
  const [assignTo, setAssignTo] = useState<membersProps>();
  const [selfReported, setSelfReported] = useState<boolean>(true);
  const [reportTo, setReportTo] = useState<membersProps>();

  const onPressAssignedTo = (val: membersProps | undefined) => {
    setSelfAssigned(false);
    setAssignTo(val);
    setAssignToModal(false);
  };

  const onPressReportTo = (val: membersProps | undefined) => {
    setSelfReported(false);
    setReportTo(val);
    setReportToModal(false);
  };

  const onSubmit = () => {};

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
      onSubmit={() => onSubmit()}
      validationSchema={AssignTaskSubtaskSchema}>
      {({
        values,
        handleChange,
        errors,
        setFieldTouched,
        // isValid,
        setFieldValue,
        touched,
        handleSubmit,
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
              <Stack>
                <Stack spacing={16} spaceBelow={16}>
                  <StackItem childrenGap={5}>
                    <DropDownView
                      placeholderStyle={styles.placeholderStyle}
                      data={allCompanyData}
                      labelField="label"
                      valueField="value"
                      placeholder={t('assign:companyDropdownPlaceholder')}
                      value={companyValue}
                      onChange={item => {
                        setFieldValue('company', item.value);
                        setCompanyValue(item.value);
                      }}
                      onBlur={() => setFieldTouched('company')}
                      renderItem={renderItem}
                      isError={touched.company && errors.company ? true : false}
                    />
                    {touched.company && errors.company && (
                      <TextView
                        children={errors.company}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
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
                      isError={touched.title && errors.title ? true : false}
                    />
                    {touched.title && errors.title && (
                      <TextView
                        children={errors.title}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  {/* <DropDownView
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
                  {touched.add && errors.add && (
                    <TextView
                      children={errors.add}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )} */}
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('assign:taskName')}
                      placeholder={t('assign:taskName')}
                      onChangeText={handleChange('name')}
                      value={values.name}
                      onBlur={() => setFieldTouched('name')}
                      isError={touched.name && errors.name ? true : false}
                      iconRightName={'mic'}
                    />
                    {touched.name && errors.name && (
                      <TextView
                        children={errors.name}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  <StackItem childrenGap={5}>
                    <InputTextField
                      label={t('assign:description')}
                      placeholder={t('assign:description')}
                      multiline={true}
                      numberOfLines={4}
                      onChangeText={handleChange('description')}
                      value={values.description}
                      onBlur={() => setFieldTouched('description')}
                      isError={
                        touched.description && errors.description ? true : false
                      }
                      iconRightName={'mic'}
                    />
                    {touched.description && errors.description && (
                      <TextView
                        children={errors.description}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )}
                  </StackItem>
                  {/* <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('addTask:assignTo')}
                    data={allAssignData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('addTask:dropdownPlaceholder')}
                    value={assignValue}
                    onChange={item => {
                      setFieldValue('assignTo', item.value);
                      setAssignValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('assignTo')}
                    renderItem={renderItem}
                  /> */}
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.label}>
                    {t('addTask:assignTo')}
                  </TextView>
                  <Stack>
                    <TouchableOpacity
                      onPress={() => {
                        setAssignToModal(true);
                      }}
                      style={styles.assignReportTo}>
                      {selfAssigned ? (
                        <Stack horizontal verticalAlign="center">
                          <Persona
                            name={'Leslie Alexander'}
                            image={userImage}
                          />
                          <Stack style={styles.view}>
                            <TextView
                              weight="medium"
                              variant={FontSizes.regular}
                              truncate>
                              Assign to me
                            </TextView>
                          </Stack>
                        </Stack>
                      ) : (
                        <MemberItem
                          item={assignTo}
                          onPress={() => {
                            setAssignToModal(true);
                          }}
                          isDividerFalse
                        />
                        // <Stack horizontal>
                        //   <TextView
                        //     weight="regular"
                        //     variant={FontSizes.small}
                        //     style={styles.date}
                        //     truncate>
                        //     {assignTo?.name}
                        //     {' | '}
                        //   </TextView>
                        //   <TextView
                        //     weight="regular"
                        //     variant={FontSizes.small}
                        //     style={styles.date}>
                        //     {assignTo?.position}
                        //   </TextView>
                        // </Stack>
                      )}
                    </TouchableOpacity>
                    {/* {errors.assignTo && (
                        <TextView
                          children={errors.assignTo}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )} */}
                  </Stack>
                  {/* <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('addTask:reportTo')}
                    data={allReportData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('managersHomePage:managersAssignTo3')}
                    value={reportValue}
                    onChange={item => {
                      setFieldValue('reportTo', item.value);
                      setReportValue(item.value);
                    }}
                    onBlur={() => setFieldTouched('reportTo')}
                    renderItem={renderItem}
                  /> */}
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.label}>
                    {t('addTask:reportTo')}
                  </TextView>
                  <Stack>
                    <TouchableOpacity
                      onPress={() => {
                        setReportToModal(true);
                      }}
                      style={styles.assignReportTo}>
                      {/* <Stack horizontal style={styles.inputDate}> */}
                      {selfReported ? (
                        <Stack horizontal verticalAlign="center">
                          <Persona
                            name={'Leslie Alexander'}
                            image={userImage}
                          />
                          <Stack style={styles.view}>
                            <TextView
                              weight="medium"
                              variant={FontSizes.regular}
                              truncate>
                              Report to me
                            </TextView>
                          </Stack>
                        </Stack>
                      ) : (
                        <MemberItem
                          item={reportTo}
                          onPress={() => {
                            setReportToModal(true);
                          }}
                          isDividerFalse
                        />
                        // <Stack horizontal>
                        //   <TextView
                        //     weight="regular"
                        //     variant={FontSizes.small}
                        //     style={styles.date}
                        //     truncate>
                        //     {reportTo?.name}
                        //     {' | '}
                        //   </TextView>
                        //   <TextView
                        //     weight="regular"
                        //     variant={FontSizes.small}
                        //     style={styles.date}>
                        //     {reportTo?.position}
                        //   </TextView>
                        // </Stack>
                      )}
                      {/* </Stack> */}
                    </TouchableOpacity>
                    {/* {errors.reportTo && (
                        <TextView
                          children={errors.reportTo}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )} */}
                  </Stack>
                  {selfAssigned && (
                    <InputTextField
                      label={t('addTask:relatedTask')}
                      placeholder={t('addTask:relatedTaskPlaceholder')}
                      onChangeText={handleChange('relatedTaskName')}
                      value={values.relatedTaskName}
                      onBlur={() => setFieldTouched('relatedTaskName')}
                    />
                  )}
                  <Stack horizontal center style={styles.buttonView}>
                    <View style={styles.fieldView}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('assign:startDate')}
                      </TextView>
                      <StackItem childrenGap={5}>
                        <DatePicker
                          date="MM DD, YYYY"
                          task
                          isError={
                            touched.startDate && errors.startDate ? true : false
                          }
                        />
                        {touched.startDate && errors.startDate && (
                          <TextView
                            children={errors.startDate}
                            weight="regular"
                            variant={FontSizes.xSmall}
                            style={styles.error}
                          />
                        )}
                      </StackItem>
                    </View>
                    <View style={styles.fieldView}>
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.label}>
                        {t('assign:dueDate')}
                      </TextView>
                      <StackItem childrenGap={5}>
                        <DatePicker
                          date="MM DD, YYYY"
                          task
                          isError={
                            touched.dueDate && errors.dueDate ? true : false
                          }
                        />
                        {touched.dueDate && errors.dueDate && (
                          <TextView
                            children={errors.dueDate}
                            weight="regular"
                            variant={FontSizes.xSmall}
                            style={styles.error}
                          />
                        )}
                      </StackItem>
                    </View>
                  </Stack>
                  <Stack>
                    <PriorityComponent />
                    {/* {errors.priority && (
                      <TextView
                        children={errors.priority}
                        weight="regular"
                        variant={FontSizes.xSmall}
                        style={styles.error}
                      />
                    )} */}
                  </Stack>
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
                <Stack spacing={16} spaceBelow={16}>
                  <PrimaryButton
                    title={t('addButton')}
                    onPress={() => {
                      handleSubmit();
                    }}
                  />
                </Stack>
              </Stack>
            </KeyboardAwareScrollView>
          </Animated.ScrollView>
          {assignToModal && (
            <Modal
              isVisible={assignToModal}
              style={styles.bottomModal}
              onBackdropPress={() => setAssignToModal(false)}>
              <View style={styles.bottomModalView}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  spacing={16}>
                  <Stack>
                    <TextView weight="bold" variant={FontSizes.large}>
                      Assign to
                    </TextView>
                  </Stack>
                  <RippleIconButton
                    name="close"
                    size={22}
                    onPress={() => setAssignToModal(false)}
                  />
                </Stack>
                <Stack
                  horizontal
                  spacing={16}
                  spaceBelow={16}
                  style={styles.attachmentView}>
                  <SearchTextField />
                </Stack>
                <ScrollView>
                  <Stack spacing={16}>
                    <MemberList
                      data={modalMembersList}
                      onPress={val => onPressAssignedTo(val)}
                      onPressSelf={() => {
                        setSelfAssigned(true);
                        setAssignToModal(false);
                      }}
                      isAssignTo
                    />
                  </Stack>
                </ScrollView>
              </View>
            </Modal>
          )}
          {reportToModal && (
            <Modal
              isVisible={reportToModal}
              style={styles.bottomModal}
              onBackdropPress={() => setReportToModal(false)}>
              <View style={styles.bottomModalView}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  spacing={16}>
                  <Stack>
                    <TextView weight="bold" variant={FontSizes.large}>
                      Report to
                    </TextView>
                  </Stack>
                  <RippleIconButton
                    name="close"
                    size={22}
                    onPress={() => setReportToModal(false)}
                  />
                </Stack>
                <Stack
                  horizontal
                  spacing={16}
                  spaceBelow={16}
                  style={styles.attachmentView}>
                  <SearchTextField />
                </Stack>
                <ScrollView>
                  <Stack spacing={16}>
                    <MemberList
                      data={modalMembersList}
                      onPress={val => onPressReportTo(val)}
                      onPressSelf={() => {
                        setSelfReported(true);
                        setReportToModal(false);
                      }}
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
