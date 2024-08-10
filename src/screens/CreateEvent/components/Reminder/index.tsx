import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import {FormikDropdownPicker} from 'components/formikFields';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {useFormikContext} from 'formik';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Stack} from 'stack-container';
import Modal from 'react-native-modal';
import {Styles} from 'screens/CreateEvent/index.styles';
import {EventFormModel} from 'screens/CreateEvent/types';

export const Reminder = (data: EventFormModel, {reminderEdit}: any) => {
  const {t} = useTranslation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {values} = useFormikContext<EventFormModel>();

  const [reminder, setReminder] = useState<string>(
    reminderEdit ? reminderEdit : '15_MINUTES_BEFORE',
  );
  const allReminders = [
    // {label: '5 minutes before', value: '5 minutes before'},
    {label: '15 minutes before', value: '15_MINUTES_BEFORE'},
    {label: '30 minutes before', value: '30_MINUTES_BEFORE'},
    {label: '1 hour before', value: '1_HOUR_BEFORE'},
    {label: '1 day before', value: '1_DAY_BEFORE'},
    // {label: 'Custom', value: 'CUSTOM'},
  ];
  const beforeDateArray = [
    'Minutes before',
    'Hours before',
    'Days before',
    'Week before',
  ];

  const [beforeDate, setBeforeDate] = useState<string>('Minutes before');

  const AsArray = ['As notification', 'As mail'];

  const [customCount, setCustomCount] = useState<string>();
  const [asOption, setAsOption] = useState<string>('As notification');
  const [customReminderModal, setCustomReminderModal] =
    useState<boolean>(false);

  // useEffect(() => {
  //   if (values.reminder === 'CUSTOM') {
  //     setCustomReminderModal(true);
  //   }
  // }, [values.reminder]);

  useEffect(() => {
    setReminder(reminderEdit ? reminderEdit : '15_MINUTES_BEFORE');
    data.reminderType = reminderEdit ? reminderEdit : '15_MINUTES_BEFORE';
  }, [data, reminderEdit]);

  const RenderItemModal = ({item, index}: any) => {
    return (
      <StackItem childrenGap={10}>
        <TouchableOpacity onPress={() => setBeforeDate(item)}>
          <Stack style={styles.item}>
            <StackItem horizontal childrenGap={10}>
              {beforeDate === item ? (
                <Icon
                  name="radio_button_checked"
                  size={22}
                  color={colors.black}
                />
              ) : (
                <Icon
                  name="radio_button_unchecked"
                  size={22}
                  color={colors.black}
                />
              )}
              <TextView weight="regular" variant={FontSizes.regular}>
                {item}
              </TextView>
            </StackItem>
          </Stack>
        </TouchableOpacity>
        {index !== beforeDateArray.length - 1 && <Divider size={1} />}
      </StackItem>
    );
  };
  const RenderItemAsModal = ({item, index}: any) => {
    return (
      <StackItem childrenGap={10}>
        <TouchableOpacity onPress={() => setAsOption(item)}>
          <Stack style={styles.item}>
            <StackItem horizontal childrenGap={10}>
              {asOption === item ? (
                <Icon
                  name="radio_button_checked"
                  size={22}
                  color={colors.black}
                />
              ) : (
                <Icon
                  name="radio_button_unchecked"
                  size={22}
                  color={colors.black}
                />
              )}
              <TextView weight="regular" variant={FontSizes.regular}>
                {item}
              </TextView>
            </StackItem>
          </Stack>
        </TouchableOpacity>
        {index !== AsArray.length - 1 && <Divider size={1} />}
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <>
      <FormikDropdownPicker
        label={t('createEvent:reminder')}
        options={allReminders}
        value={reminder}
        name="reminderType"
        onSelect={item => {
          setReminder(item.value);
          data.reminderType = item.value;
        }}
        placeholder={t('createEvent:dropdownPlaceholder_1')}
        radioOptions
      />
      {customReminderModal && (
        <Modal
          isVisible={customReminderModal}
          onBackdropPress={() => {
            setCustomReminderModal(false);
          }}>
          <View>
            <View style={styles.modalView}>
              <StackItem childrenGap={16}>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.modalHeader}>
                  Custom notification
                </TextView>
                <TextField
                  onChangeText={text => setCustomCount(text)}
                  value={customCount}
                  keyboardType="number-pad"
                  style={styles.inputModal}
                />
                <FlatList
                  data={beforeDateArray}
                  renderItem={({item, index}) => (
                    <RenderItemModal item={item} index={index} />
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
                <Divider size={2} />
                <FlatList
                  data={AsArray}
                  renderItem={({item, index}) => (
                    <RenderItemAsModal item={item} index={index} />
                  )}
                  keyExtractor={(_, index) => index.toString()}
                />
                <PrimaryButton
                  title={t('done')}
                  onPress={() => {
                    setCustomReminderModal(false);
                  }}
                  style={styles.modalButton}
                />
              </StackItem>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
