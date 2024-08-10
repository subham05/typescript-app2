import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import DateTimePickerModal, {
  ReactNativeModalDateTimePickerProps,
} from 'react-native-modal-datetime-picker';
import {Stack} from 'stack-container';

export type DatePickerProps = Omit<
  ReactNativeModalDateTimePickerProps,
  'onConfirm' | 'onCancel'
> & {
  placeholder?: string | undefined;
  onDateSelected?: (value: Date) => void;
  icon?: string;
  iconSize?: number;
  hideIcon?: boolean;
  isError?: boolean;
  format?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  resetValues?: boolean;
  isPlaceholderBlack?: boolean;
  isDateTimeSelected?: boolean;
  isStartDateSelected?: boolean;
  isValidAge?: boolean;
  ageCheck?: boolean;
  isFormat?: boolean;
  edit?: boolean;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  mode = 'date',
  placeholder = mode === 'date' ? 'DD/MM/YY' : 'HH:MM',
  icon = 'calendar',
  iconSize = 18,
  hideIcon,
  isError,
  onDateSelected,
  format = 'DD/MM/YY',
  label,
  value,
  resetValues,
  isPlaceholderBlack,
  disabled = false,
  isDateTimeSelected = true,
  isStartDateSelected = false,
  isValidAge = false,
  ageCheck = false,
  isFormat = false,
  edit = false,
  ...props
}) => {
  const [dateSelected, setDateSelected] = useState<string | undefined>(
    placeholder,
  );
  const [valueDate, setValueDate] = useState(new Date().toString());
  const [pickedDateState, setPickedDateState] = useState<Date>();

  useEffect(() => {
    if (value?.length) {
      setValueDate(value!);
    }
    return () => {
      setValueDate(value!);
    };
  }, [value]);

  const [isDatePickerVisible, setDatePickerVisibility] =
    useState<boolean>(false);

  useEffect(() => {
    if (isValidAge && pickedDateState) {
      let datePicked = moment(pickedDateState).format(format);
      if (isDateTimeSelected) {
        setDateSelected(datePicked);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidAge, pickedDateState]);

  const borderStyle: StyleProp<ViewStyle> | undefined = {
    borderWidth: 1,
    borderColor: isError
      ? colors.red
      : disabled
      ? colors.grey_012
      : colors.white,
    borderRadius: 3,
  };

  const backgroundStyle: StyleProp<ViewStyle> | undefined = {
    backgroundColor: disabled ? colors.grey_012 : colors.white,
  };

  const dateColorStyle: StyleProp<TextStyle> | undefined = {
    color: isPlaceholderBlack
      ? colors.black
      : value !== undefined
      ? colors.black
      : dateSelected === placeholder && !edit
      ? colors.primary_003
      : colors.black,
  };

  useEffect(() => {
    if (isStartDateSelected) {
      let datePicked = moment(pickedDateState).format(format);
      setDateSelected(datePicked);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickedDateState, isStartDateSelected]);

  // const todaysDate = new Date();
  useEffect(() => {
    if (resetValues) {
      cleanTextFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetValues]);
  useEffect(() => {
    setDateSelected(placeholder);
  }, [placeholder]);

  const cleanTextFields = () => {
    setDateSelected(placeholder);
    value = '';
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (pickedDate: Date) => {
    setPickedDateState(pickedDate);
    if (mode === 'time') {
      let pickedTime = moment(pickedDate).format('hh:mm A');
      setDateSelected(pickedTime);
    } else if (isValidAge && ageCheck) {
      let datePicked = moment(pickedDate).format(format);
      if (isDateTimeSelected) {
        setDateSelected(datePicked);
      }
    }
    hideDatePicker();
    onDateSelected!(pickedDate);
  };

  return (
    <>
      <Stack childrenGap={5}>
        {label !== undefined && label?.length > 0 && (
          <TextView variant={FontSizes.regular} style={styles.label}>
            {label}
          </TextView>
        )}
        {disabled ? (
          <Stack
            horizontal
            style={[styles.inputDate, borderStyle, backgroundStyle]}
            verticalAlign="center">
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={dateColorStyle}>
              {value ? value : dateSelected}
            </TextView>
            {!hideIcon && (
              <Icon name={icon} size={iconSize} style={styles.calendar} />
            )}
          </Stack>
        ) : (
          <TouchableOpacity onPress={showDatePicker}>
            <Stack
              horizontal
              style={[styles.inputDate, borderStyle]}
              verticalAlign="center">
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={dateColorStyle}>
                {value ? value : dateSelected}
              </TextView>
              {!hideIcon && (
                <Icon name={icon} size={iconSize} style={styles.calendar} />
              )}
            </Stack>
          </TouchableOpacity>
        )}
      </Stack>
      <DateTimePickerModal
        {...props}
        date={
          mode === 'time'
            ? moment(value, 'HH:mm').toDate()
            : isFormat
            ? moment(value, format).toDate()
            : value
            ? new Date(valueDate)
            : new Date()
        }
        // minimumDate={minimumDate ? minimumDate : undefined}
        isVisible={isDatePickerVisible}
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        // maximumDate={todaysDate}
        // we can use this for dark mode
        // isDarkModeEnabled={
        //   Appearance.getColorScheme() === 'dark' ? true : false
        // }
      />
    </>
  );
};

const styles = StyleSheet.create({
  inputDate: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 10,
    // marginTop: 5,
    backgroundColor: colors.white,
    // borderColor: isError ? colors.red : colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 3,
  },
  calendar: {
    right: 10,
  },
  datePickerMargin: {marginTop: 16},
  label: {
    color: colors.primary_003,
    textAlign: 'left',
  },
});
