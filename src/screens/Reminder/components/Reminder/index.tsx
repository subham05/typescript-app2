import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import {DropdownPicker} from 'components/DropdownPicker';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View, TouchableOpacity, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from 'screens/CreateEvent/index.styles';
import {Stack} from 'stack-container';

type ReminderModal = {
  onReminderSelect?: (value: string) => void;
  onSaveCustom?: (
    beforeValue?: string,
    count?: number,
    option?: string,
    errMsg?: string,
  ) => void;
};
export const ReminderComponent: React.FC<ReminderModal> = ({
  onReminderSelect,
  onSaveCustom,
}) => {
  const {t} = useTranslation();

  const [reminder, setReminder] = useState<string>('');
  const allReminders = [
    // {label: '5 minutes before', value: '5 minutes before'},
    {label: '15 minutes before', value: '15_MINUTES_BEFORE'},
    {label: '30 minutes before', value: '30_MINUTES_BEFORE'},
    {label: '1 hour before', value: '1_HOUR_BEFORE'},
    // {label: '1 day before', value: '1 day before'},
    {label: 'Custom', value: 'CUSTOM'},
  ];
  const beforeDateArray = [
    {label: 'Minutes before', value: 'MINUTES'},
    {label: 'Hours before', value: 'HOURS'},
    {label: 'Days before', value: 'DAYS'},
    {label: 'Week before', value: 'WEEK'},
  ];
  const AsArray = ['As notification', 'As mail'];

  const [beforeDate, setBeforeDate] = useState<string>('MINUTES');
  const [customCount, setCustomCount] = useState<number | undefined | string>();
  const [asOption, setAsOption] = useState<string>('As notification');
  const [customReminderModal, setCustomReminderModal] =
    useState<boolean>(false);

  let errMsg = '';

  const RenderItemModal = ({item}: any) => {
    return (
      <TouchableOpacity onPress={() => setBeforeDate(item.value)}>
        <Stack style={styles.item}>
          <StackItem horizontal childrenGap={10}>
            {beforeDate === item.value ? (
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
              {item.label}
            </TextView>
          </StackItem>
        </Stack>
      </TouchableOpacity>
    );
  };
  const RenderItemAsModal = ({item}: any) => {
    return (
      <Stack>
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
        {/* {index !== AsArray.length - 1 && <Divider size={1} />} */}
      </Stack>
    );
  };
  const getErrorMsg = () => {
    const count = Number(customCount);
    if (beforeDate === beforeDateArray[0].value && (count > 60 || count <= 0)) {
      errMsg = 'Please provide values between 1 to 60 minutes.';
      return true;
    } else if (
      beforeDate === beforeDateArray[1].value &&
      (count > 24 || count <= 0)
    ) {
      errMsg = 'Please provide values between 1 to 24 hours.';
      return true;
    } else if (
      beforeDate === beforeDateArray[2].value &&
      (count > 31 || count <= 0)
    ) {
      errMsg = 'Please provide values between 1 to 31 days.';
      return true;
    } else if (
      beforeDate === beforeDateArray[3].value &&
      (count > 5 || count <= 0)
    ) {
      errMsg = 'Please provide values between 1 to 5 weeks.';
      return true;
    } else if (customCount && isNaN(count)) {
      errMsg = 'Please provide a number';
      return true;
    } else if (customCount && !Number.isInteger(count)) {
      errMsg = 'Please provide a valid integer value';
      return true;
    } else {
      return false;
    }
  };

  const styles = Styles();
  return (
    <>
      <DropdownPicker
        label={t('createEvent:reminder')}
        options={allReminders}
        value={reminder}
        onChange={item => {
          setReminder(item.value);
          onReminderSelect?.(item.value);
          if (item.value === 'CUSTOM') {
            setCustomReminderModal(true);
          }
        }}
        placeholder={t('createEvent:dropdownPlaceholder_1')}
        radioOptions
      />
      {customReminderModal && (
        <Modal
          isVisible={customReminderModal}
          onBackdropPress={() => {
            setCustomReminderModal(false);
            onSaveCustom?.('', Number(0), asOption, '');
          }}>
          <View>
            <View style={styles.modalView}>
              <StackItem childrenGap={16}>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.modalHeader}>
                  {t('calendarPage:custNotify')}
                </TextView>
                <TextField
                  onChangeText={text => {
                    if (text && text.length > 0) {
                      setCustomCount(text);
                      getErrorMsg();
                    } else {
                      setCustomCount(undefined);
                    }
                  }}
                  value={customCount}
                  keyboardType="number-pad"
                  style={
                    getErrorMsg() ? styles.inputModalError : styles.inputModal
                  }
                />
                {getErrorMsg() && customCount !== 0 && (
                  <TextView
                    weight="regular"
                    variant={FontSizes.small}
                    style={styles.modalError}>
                    {errMsg}
                  </TextView>
                )}
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
                  disabled={
                    !customCount || getErrorMsg() || customCount === '0'
                  }
                  onPress={() => {
                    if (!getErrorMsg()) {
                      setCustomReminderModal(false);
                      onSaveCustom?.(
                        beforeDate,
                        Number(customCount),
                        asOption,
                        errMsg,
                      );
                    }
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
