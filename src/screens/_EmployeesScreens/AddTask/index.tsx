import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import {Divider} from 'components/Divider';
import {DropDownView} from 'components/DropDownView';
import Header from 'components/Header';
import {InputTextField} from 'components/InputView';
import {Stack, StackItem} from 'components/Stack';
import {Formik} from 'formik';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {InitialValues} from './constants';
import {Styles} from './index.styles';
import {AssignTaskSubtaskScreenProps} from './types';
import {AssignTaskSubtaskSchema} from './utils';

type Props = NativeStackScreenProps<EmployeesSignedInStackParamList, 'AddTask'>;
export const EmployeeAddTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {route} = {...props};
  const {subTask} = {...route.params};

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
                    {t('createEvent:date')}
                  </TextView>
                  <Stack horizontal center style={styles.buttonView}>
                    <View style={styles.fieldView}>
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

                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.label}>
                    {t('createEvent:time')}
                  </TextView>
                  <Stack horizontal center style={styles.buttonView}>
                    <View style={styles.fieldView}>
                      <DatePicker
                        date="05:00 AM"
                        mode="time"
                        icon="time"
                        iconSize={22}
                      />
                      {errors.fromTime && (
                        <TextView
                          children={errors.fromTime}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )}
                    </View>
                    <View style={styles.fieldView}>
                      <DatePicker
                        date="10:00 AM"
                        mode="time"
                        icon="time"
                        iconSize={22}
                      />
                      {errors.toTime && (
                        <TextView
                          children={errors.toTime}
                          weight="regular"
                          variant={FontSizes.xSmall}
                          style={styles.error}
                        />
                      )}
                    </View>
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
        </Container>
      )}
    </Formik>
  );
};
