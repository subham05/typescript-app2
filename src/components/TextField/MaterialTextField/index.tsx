import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import React from 'react';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import {TextField, TextFieldProps} from '../TextField';

type MaterialTextFieldProps = TextFieldProps & {
  materialContainerStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderColor?: string;
};

export const MaterialTextField: React.FC<MaterialTextFieldProps> = ({
  materialContainerStyle,
  backgroundColor = colors.grey_001,
  borderColor = colors.primary,
  ...props
}) => {
  // const TextFieldWidth = noBackground
  //   ? Dimensions.get('screen').width - 32
  //   : Dimensions.get('screen').width - 100;

  const TextInputStyles: StyleProp<ViewStyle> | undefined = {
    // width: TextFieldWidth,
    backgroundColor: backgroundColor,
    borderColor: backgroundColor,
    borderBottomColor: borderColor,
  };
  const containerStyles: StyleProp<ViewStyle> | undefined = {
    borderColor: backgroundColor,
  };
  // const borderInputStyles: StyleProp<ViewStyle> | undefined = {
  //   // width: TextFieldWidth,
  //   // backgroundColor: noBackground ? colors.grey_001 : colors.white,
  //   borderColor: colors.grey_001,
  // };

  return (
    <>
      {/* {label !== undefined && label?.length > 0 && (
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {label}
        </TextView>
      )} */}
      <TextField
        style={[
          styles.inputBottomBorder,
          TextInputStyles,
          materialContainerStyle,
        ]}
        containerStyles={containerStyles}
        {...props}
      />
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
  inputBottomBorder: {
    // height: 50,
    borderBottomWidth: 2,
    // padding: 10,
    marginTop: -2,
    // backgroundColor: colors.white,
    // borderColor: colors.white,
    // borderBottomColor: colors.primary,
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.small,
    // width: Dimensions.get('screen').width - 100,
  },
});
