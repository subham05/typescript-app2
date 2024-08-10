import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components/TextView';
import React from 'react';
import {StyleSheet} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {DropdownProps} from 'react-native-element-dropdown/src/Dropdown/type';

export type DropDownProps = Pick<
  DropdownProps,
  | 'data'
  | 'value'
  | 'labelField'
  | 'valueField'
  | 'placeholder'
  | 'onChange'
  | 'maxHeight'
  | 'renderItem'
  | 'placeholderStyle'
  | 'selectedTextStyle'
  | 'onBlur'
> & {
  label?: string;
  accounts?: boolean;
  disabledColor?: boolean;
  isError?: boolean;
};

export const DropDownView: React.FC<DropDownProps> = ({
  label,
  onBlur,
  data,
  accounts,
  value,
  disabledColor,
  isError,
  ...props
}) => {
  const calculateHeight = () => {
    let height;
    if (data.length * 60 > 300) {
      height = 300;
    } else {
      height = data.length * 60;
    }
    return height;
  };
  return (
    <>
      {label !== undefined && label?.length > 0 && (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles(value, disabledColor, isError).label}>
          {label}
        </TextView>
      )}
      <Dropdown
        style={
          accounts
            ? styles(value, disabledColor, isError).dropdownAccount
            : styles(value, disabledColor, isError).dropdown
        }
        placeholderStyle={styles(value, disabledColor, isError).text}
        selectedTextStyle={styles(value, disabledColor, isError).text}
        data={data}
        onBlur={onBlur}
        maxHeight={calculateHeight()}
        containerStyle={styles(value, disabledColor, isError).containerStyle}
        value={value}
        {...props}
      />
    </>
  );
};

export const styles = (
  value: string | undefined,
  disabledColor: boolean | undefined,
  isError: boolean | undefined,
) => {
  const mergeStyles = StyleSheet.create({
    label: {
      marginTop: 15,
      color: colors.primary_003,
    },
    dropdown: {
      padding: 10,
      borderWidth: 1,
      marginTop: 5,
      height: 40,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.medium,
      borderColor: value
        ? colors.grey_008
        : disabledColor
        ? colors.grey_012
        : isError
        ? colors.red
        : colors.white,
      backgroundColor: disabledColor ? colors.grey_012 : colors.white,
      borderRadius: 3,
      color: colors.grey_004,
    },
    dropdownAccount: {
      padding: 10,
      borderWidth: 1,
      marginTop: 5,
      height: 40,
      fontSize: 15,
      borderColor: colors.grey_002,
      backgroundColor: colors.white,
      borderRadius: 3,
      color: colors.grey_004,
    },
    text: {
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.medium,
      color: colors.black,
    },
    containerStyle: {borderRadius: 3},
  });
  return mergeStyles;
};
