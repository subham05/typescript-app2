import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextField, TextFieldProps} from 'components/TextField';
import {TextView} from 'components/TextView';
import {useField} from 'formik';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Stack} from 'stack-container';
type FormikTextFieldProps = TextFieldProps & {
  name: string;
  keyboardType?: string;
  autoComplete?: string;
  enableBackground?: boolean;
  onChangeInput?: (value: string) => void;
};

export const FormikTextField: React.FC<FormikTextFieldProps> = ({
  name,
  keyboardType,
  autoComplete,
  enableBackground,
  onChangeInput,
  ...props
}) => {
  const [field, meta, helpers] = useField<string | undefined | null>(name);
  const {error, touched} = {...meta};
  const {value} = field;
  // const [isTouched, setIsTouched] = useState<boolean>(touched);

  return (
    <Stack
      childrenGap={5}
      // style={
      //   halfScreenTextInput && isTouched && error ? styles.errorView : undefined
      // }
    >
      <TextField
        {...props}
        isError={touched && error !== undefined}
        value={value!}
        keyboardType={keyboardType}
        autoComplete={autoComplete}
        enableBackground={enableBackground}
        onChangeText={textValue => {
          onChangeInput?.(textValue);
          helpers.setValue(textValue);
        }}
        // onFocus={() => setIsTouched(true)}
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
