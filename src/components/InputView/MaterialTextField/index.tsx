import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components/TextView';
import React from 'react';
import {StyleSheet, TextInput} from 'react-native';
import {InputTextFieldProps} from '../InputTextField';

export const MaterialTextField: React.FC<InputTextFieldProps> = ({
  label,
  ...props
}) => {
  return (
    <>
      {label !== undefined && label?.length > 0 && (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {label}
        </TextView>
      )}
      <TextInput style={styles.inputBottomBorder} {...props} />
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
  inputBottomBorder: {
    height: 40,
    borderWidth: 2,
    padding: 10,
    marginTop: 5,
    // backgroundColor: colors.white,
    borderColor: colors.grey_001,
    borderBottomColor: colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.small,
    width: '100%',
  },
});
