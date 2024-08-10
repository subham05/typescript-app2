import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {
  PhoneTextField,
  PhoneTextFieldProps,
} from 'components/TextField/PhoneTextField';
import {TextView} from 'components/TextView';
import {useField} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Stack} from 'stack-container';
type FormikPhoneFieldProps = PhoneTextFieldProps & {
  name: string;
  onChangeInput?: (value: string) => void;
};

export const FormikPhoneField: React.FC<FormikPhoneFieldProps> = ({
  name,
  onChangeInput,
  ...props
}) => {
  const [field, meta, helpers] = useField<string | undefined | null>(name);
  const {error, touched} = {...meta};
  const {value} = field;

  return (
    <Stack childrenGap={5}>
      <PhoneTextField
        {...props}
        isError={touched && error !== undefined}
        value={value!}
        onChangeText={textValue => {
          onChangeInput?.(textValue);
          helpers.setValue(textValue);
        }}
      />
      {touched && error && (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.error}>
          {error}
        </TextView>
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  error: {
    fontSize: FontSizes.small,
    color: colors.red_002,
  },
  errorView: {top: 11},
});
