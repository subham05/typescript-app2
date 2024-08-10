import {TextView} from 'components';
import {Icon} from 'components/Icon';
import moment from 'moment';
import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import {Stack} from 'stack-container';

export type DueDatePickerProps = Omit<
  ReactNativeModalDateTimePickerProps,
  'onConfirm' | 'onCancel'
> & {
  startDate: string;
  dateFromDB: string;
  onDateSelected?: (value: Date) => void;
  icon?: string;
  iconSize?: number;
  format?: string;
  fontSize?: 22 | 18 | 16 | 14 | 12 | 52 | 28 | 42 | 10 | 20;
};

export const DueDatePicker: React.FC<DueDatePickerProps> = ({
  mode = 'date',
  onDateSelected,
  format = 'MMM DD, YYYY',
  dateFromDB,
  startDate,
  fontSize = 18,
  ...props
}) => {
  const dateStart = moment(startDate, 'MMM DD, YYYY').add(1, 'day').format();
  const [dateSelected, setDateSelected] = useState<string>(dateFromDB);

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (pickedDate: Date) => {
    if (mode === 'time') {
      let pickedTime = moment(pickedDate).format('hh:mm A');
      setDateSelected(pickedTime);
    } else {
      let datePicked = moment(pickedDate).format(format);
      setDateSelected(datePicked);
    }
    hideDatePicker();
    onDateSelected!(pickedDate);
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePicker}>
        <Stack horizontal>
          <Icon name="calendar" size={18} style={styles.smallIcon} />
          <TextView weight="medium" variant={fontSize}>
            {dateSelected}
          </TextView>
        </Stack>
      </TouchableOpacity>
      <DateTimePickerModal
        {...props}
        minimumDate={new Date(dateStart)}
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // we can use this for dark mode
        // isDarkModeEnabled={
        //   Appearance.getColorScheme() === 'dark' ? true : false
        // }
      />
    </>
  );
};

const styles = StyleSheet.create({
  smallIcon: {
    marginRight: 5,
  },
});
