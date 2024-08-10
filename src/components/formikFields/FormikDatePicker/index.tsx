import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {TextView} from 'components';
import {DatePicker, DatePickerProps} from 'components/DatePicker';
import {useField} from 'formik';
import moment from 'moment';
import React from 'react';
import {StyleSheet} from 'react-native';

export type FormikDatePickerProps = Omit<
  DatePickerProps,
  'onConfirm' | 'onCancel'
> & {
  name: string;
  onPress?: (value: Date) => void;
  selectedDate?: Date;
  isTimeNotRestricted?: boolean;
  isStartDateSelected?: boolean;
  isValidAge?: boolean;
};

export const FormikDatePicker: React.FC<FormikDatePickerProps> = ({
  mode = 'date',
  name,
  placeholder,
  onPress,
  selectedDate,
  isTimeNotRestricted = false,
  isStartDateSelected = false,
  isValidAge = false,
  ...props
}) => {
  const [field, meta, helpers] = useField<string | undefined | null | Date>(
    name,
  );
  const {error, touched} = {...meta};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {value} = field;

  const handleConfirm = (pickedDate: Date) => {
    if (mode === 'time') {
      let selectedStartDate = moment(selectedDate).format('YYYY/MM/DD');
      // let selectedStartTime = moment().format('hh:mm A');
      let currentStartDate = moment(pickedDate).format('YYYY/MM/DD');
      // let pickedStartTime = moment(pickedDate).format('hh:mm A');

      // let startDatePicked = moment(selectedDate).toISOString();
      // let dateStartPicked = startDatePicked?.split('T')[0];
      // let datePicked = moment(pickedDate).toISOString();
      // let time = datePicked.split('T')[1];
      // let finalDate = moment(dateStartPicked + 'T' + time).toDate();
      // let diff = moment(finalDate).isAfter(currentDateTime);

      if (
        selectedStartDate === currentStartDate &&
        new Date().getTime() >= new Date(pickedDate).getTime() &&
        !isTimeNotRestricted
      ) {
        const pickedTime = moment().format();
        helpers.setValue(pickedTime);
        onPress!(new Date());
        showToast('Time should not be past time.');
      } else {
        const pickedTime = moment(pickedDate).format();
        helpers.setValue(pickedTime);
        onPress!(pickedDate);
      }
    } else {
      const datePicked = moment(pickedDate).format('YYYY-MM-DD');
      helpers.setValue(datePicked);
      onPress!(pickedDate);
    }
  };

  return (
    <>
      <DatePicker
        {...props}
        placeholder={placeholder}
        isError={touched && error !== undefined}
        onDateSelected={handleConfirm}
        isStartDateSelected={isStartDateSelected}
        mode={mode}
        isValidAge={isValidAge}
      />
      {touched && error && (
        <TextView variant={FontSizes.small} style={styles.error}>
          {error}
        </TextView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  error: {
    fontSize: FontSizes.small,
    color: colors.red_002,
    textAlign: 'left',
  },
});
