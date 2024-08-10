import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React, {useEffect, useRef} from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import {PhoneInputProps} from 'react-native-phone-number-input/lib/index';
import {useAppSelector} from 'store/hooks';

export type PhoneTextFieldProps = PhoneInputProps & {
  label?: string;
  isError?: boolean;
  resetValues?: boolean;
};

export const PhoneTextField: React.FC<PhoneTextFieldProps> = ({
  label,
  containerStyle,
  isError,
  resetValues = false,
  ...props
}) => {
  // const phoneInput = useRef<PhoneInput>(null);
  const borderStyle: StyleProp<ViewStyle> | undefined = {
    borderWidth: 1,
    borderColor: isError ? colors.red : colors.white,
    borderRadius: 3,
  };
  const {validations} = useAppSelector(state => state?.formanagement);

  const phoneInput = useRef(null);
  useEffect(() => {
    if (resetValues) {
      cleanTextFields();
    }
  }, [resetValues]);
  const cleanTextFields = () => {
    phoneInput?.current?.setState({number: ''});
  };
  return (
    <>
      {label !== undefined && label?.length > 0 && (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.labelStyles}>
          {label}
        </TextView>
      )}
      <Stack style={borderStyle}>
        <PhoneInput
          ref={phoneInput}
          // textInputProps={{maxLength: 15}}
          textInputProps={{
            value: props.value,
            maxLength: validations?.contactPhoneLength.MAX,
            placeholderTextColor: colors.grey_003,
            selectionColor: colors.selection,
          }}
          containerStyle={containerStyle}
          textContainerStyle={styles.contactTextInputStyles}
          defaultValue={props.value}
          {...props}
        />
      </Stack>
    </>
  );
};

const styles = StyleSheet.create({
  labelStyles: {color: colors.primary_003, textAlign: 'left'},
  contactTextInputStyles: {
    paddingVertical: 0,
    backgroundColor: colors.white,
  },
});
