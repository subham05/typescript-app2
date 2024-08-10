import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components/TextView';
import {TouchableField, TouchableFieldProps} from 'components/TouchableField';
import {useField} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Stack} from 'stack-container';
type FormikTouchableFieldProps = TouchableFieldProps & {
  name: string;
};

export const FormikTouchableField: React.FC<FormikTouchableFieldProps> = ({
  name,
  ...props
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [field, meta, helpers] = useField<string | undefined | null>(name);
  const {error, touched} = {...meta};

  return (
    <Stack childrenGap={5}>
      <TouchableField {...props} isError={touched && error !== undefined} />
      {touched && error && !props.isDropdownOpen && (
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
