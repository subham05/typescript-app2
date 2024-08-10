import {NativeStackScreenProps} from '@react-navigation/native-stack';
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
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
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
import {membersProps} from 'components/Members/MembersItem';
import {RippleIconButton} from 'components/IconButtons';

type Props = NativeStackScreenProps<ManagerSignedInStackParamList, 'AddTask'>;
export const ManagersAddTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {route} = {...props};
  const {subTask} = {...route.params};

  const [selectedContact] = useState<string>('Employee');

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
            label={t('homePage:addTask')}
            translateY={translateY}
          />
          {/* <Stack
            spaceBelow={16}
            horizontal
            horizontalAlign="space-between"
            style={styles.contactView}>
            <TouchableOpacity
              style={
                selectedContact === 'Employee'
                  ? styles.contactSelected
                  : styles.contactNotSelected
              }
              onPress={() => {
                setSelectedContact('Employee');
              }}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.contactText}>
                {t('managersHomePage:employee')}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                selectedContact === 'Vendors'
                  ? styles.contactSelected
                  : styles.contactNotSelected
              }
              onPress={() => {
                setSelectedContact('Vendors');
              }}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.contactText}>
                {t('managersHomePage:vendorSupplier')}
              </TextView>
            </TouchableOpacity>
          </Stack> */}
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
              <Stack spaceBelow={100}>
                <Stack spacing={16} spaceBelow={16}>
                  <DropDownView
                    placeholderStyle={styles.placeholderStyle}
                    label={t('addTask:title')}
                    data={allTitleData}
                    labelField="label"
                    valueField="value"
                    placeholder={t('addTask:dropdownPlaceholder')}
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
                  {!subTask && (
                    <>
                      <DropDownView
                        placeholderStyle={styles.placeholderStyle}
                        label={t('addTask:add')}
                        data={allAddData}
                        labelField="label"
                        valueField="value"
                        placeholder={t('addTask:dropdownPlaceholder')}
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
                    </>
                  )}
                  <InputTextField
                    label={t('addTask:taskName')}
                    placeholder={t('addTask:taskName')}
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
                    label={t('addTask:description')}
                    placeholder={t('addTask:descriptionPlaceholder')}
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
                  {/* {selectedContact === 'Employee' ? (
                    <DropDownView
                      placeholderStyle={styles.placeholderStyle}
                      label={t('addTask:assignTo')}
                      data={allAssignData}
                      labelField="label"
                      valueField="value"
                      placeholder={t('managersHomePage:managersAssignTo1')}
                      value={assignValue}
                      onChange={item => {
                        setFieldValue('assignTo', item.value);
                        setAssignValue(item.value);
                      }}
                      onBlur={() => setFieldTouched('assignTo')}
                      renderItem={renderItem}
                    />
                  ) : (
                    <DropDownView
                      placeholderStyle={styles.placeholderStyle}
                      label={t('addTask:assignTo')}
                      data={allAssignData}
                      labelField="label"
                      valueField="value"
                      placeholder={t('managersHomePage:managersAssignTo2')}
                      value={assignValue}
                      onChange={item => {
                        setFieldValue('assignTo', item.value);
                        setAssignValue(item.value);
                      }}
                      onBlur={() => setFieldTouched('assignTo')}
                      renderItem={renderItem}
                    />
                  )}
                  {touched.assignTo && errors.assignTo && (
                    <TextView
                      children={errors.assignTo}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )}
                  <DropDownView
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
                  />
                  {touched.reportTo && errors.reportTo && (
                    <TextView
                      children={errors.reportTo}
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
                      {selfAssigned ? (
                        <TextView
                          weight="regular"
                          variant={FontSizes.small}
                          style={styles.date}>
                          Assigned to me
                        </TextView>
                      ) : (
                        <Stack horizontal>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.date}
                            truncate>
                            {assignTo?.name}
                            {' | '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.date}>
                            {assignTo?.position}
                          </TextView>
                        </Stack>
                      )}
                    </Stack>
                  </TouchableOpacity>
                  {/* {errors.assignTo && (
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
                    {t('addTask:reportTo')}
                  </TextView>
                  <TouchableOpacity
                    onPress={() => {
                      setReportToModal(true);
                    }}>
                    <Stack horizontal style={styles.inputDate}>
                      {selfReported ? (
                        <TextView
                          weight="regular"
                          variant={FontSizes.small}
                          style={styles.date}>
                          Report to me
                        </TextView>
                      ) : (
                        <Stack horizontal>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.date}
                            truncate>
                            {reportTo?.name}
                            {' | '}
                          </TextView>
                          <TextView
                            weight="regular"
                            variant={FontSizes.small}
                            style={styles.date}>
                            {reportTo?.position}
                          </TextView>
                        </Stack>
                      )}
                    </Stack>
                  </TouchableOpacity>
                  {/* {errors.reportTo && (
                    <TextView
                      children={errors.reportTo}
                      weight="regular"
                      variant={FontSizes.xSmall}
                      style={styles.error}
                    />
                  )} */}
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
                        variant={FontSizes.small}
                        style={styles.label}>
                        {t('addTask:startDate')}
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
                        {t('addTask:dueDate')}
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
                    {subTask && (
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate('ManagersAddSubTask', {
                            type: selectedContact,
                          })
                        }>
                        <Stack horizontal style={styles.subtask}>
                          <Icon
                            name="add_subtask"
                            size={22}
                            color={colors.primary}
                            style={styles.icon}
                          />
                          <TextView
                            weight="medium"
                            variant={FontSizes.medium}
                            style={styles.attachFile}>
                            {t('addTask:subTask')}
                          </TextView>
                        </Stack>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => {}}>
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
                          {t('addTask:attach')}
                        </TextView>
                      </Stack>
                    </TouchableOpacity>
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
