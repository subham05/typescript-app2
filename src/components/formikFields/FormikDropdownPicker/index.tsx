import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DropdownPicker, DropdownPickerProps} from 'components/DropdownPicker';
import {TextView} from 'components/TextView';
import {useField} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {DropDownModel} from 'screens/AddTask';
import {Stack} from 'stack-container';
type FormikDropdownPickerProps = DropdownPickerProps & {
  name: string;
  onSelect?: (value: DropDownModel) => void;
  activeHelper?: boolean;
};

export const FormikDropdownPicker: React.FC<FormikDropdownPickerProps> = ({
  name,
  onSelect,
  activeHelper = true,
  ...props
}) => {
  const [field, meta, helpers] = useField<string | undefined | null>(name);
  const {error, touched} = {...meta};
  const {value} = field;
  //   const [isTouched, setIsTouched] = useState<boolean>(touched);

  return (
    <Stack
      childrenGap={5}
      //   style={isTouched && error ? styles.errorView : undefined}
    >
      <DropdownPicker
        {...props}
        value={value}
        onChange={(item: DropDownModel) => {
          if (activeHelper) {
            helpers.setValue(item.value);
          }
          onSelect?.(item);
        }}
        // onFocus={() => setIsTouched(true)}
        isError={touched && error !== undefined}
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
    textAlign: 'left',
  },
  errorView: {top: 11},
});
