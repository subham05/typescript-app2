import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {PriorityComponent, PriorityPickerFieldProps} from 'components/Priority';
import {TextView} from 'components/TextView';
import {useField} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Stack} from 'stack-container';
type FormikPriorityPickerFieldProps = PriorityPickerFieldProps & {
  name: string;
};

export const FormikPriorityPickerField: React.FC<
  FormikPriorityPickerFieldProps
> = ({name, ...props}) => {
  const [field, meta, helpers] = useField<string | undefined | null>(name);
  const {error, touched} = {...meta};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {value} = field;

  return (
    <Stack childrenGap={5}>
      <PriorityComponent
        {...props}
        isError={touched && error !== undefined}
        onSelect={helpers.setValue}
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
