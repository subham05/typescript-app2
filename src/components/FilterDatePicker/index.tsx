import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {Appearance, StyleSheet, TouchableOpacity} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface FilterDatePickerProps {
  date: string;
  onPress?: (val: string) => void;
  mode?: 'date' | 'time' | 'datetime' | undefined;
  icon?: string;
  iconSize?: number;
}

export const FilterDatePicker: React.FC<FilterDatePickerProps> = ({
  date,
  mode = 'date',
  icon = 'calendar',
  iconSize = 20,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = () => {
    hideDatePicker();
    // const day   = pickedDate.getDate();
    // const month = pickedDate.getMonth();
    // const year  = pickedDate.getFullYear();
    // const monthName= moment().month(month).format("MMMM");
    // // pickedDate.setMonth(month);
    // // const monthName = pickedDate.toLocaleString("default", {month: "long"});
    // setDOB(day + ' ' + monthName + ' ' + year)
    // setDate(year+'-'+(month+1)+'-'+day)
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          showDatePicker();
        }}>
        <Stack horizontal verticalAlign="center">
          <Icon
            name={icon}
            size={iconSize}
            style={styles.calendar}
            color={colors.primary}
          />
          <TextView weight="regular" variant={FontSizes.xSmall}>
            {date}
          </TextView>
        </Stack>
      </TouchableOpacity>
      <DateTimePickerModal
        minimumDate={new Date()}
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={
          Appearance.getColorScheme() === 'dark' ? true : false
        }
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
};

const styles = StyleSheet.create({
  calendar: {
    right: 1,
  },
  date: {
    color: colors.black,
  },
  datePickerMargin: {marginTop: 16},
});
