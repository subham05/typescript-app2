import {
  Dimensions,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components/TextView';
import {Stack} from 'stack-container';
import {Icon} from 'components/Icon';

export type InputTextFieldProps = Pick<
  TextInputProps,
  | 'placeholder'
  | 'onChangeText'
  | 'value'
  | 'onBlur'
  | 'numberOfLines'
  | 'multiline'
  | 'style'
  | 'onFocus'
> & {
  label?: string;
  password?: boolean;
  company?: boolean;
  taskDetails?: boolean;
  taskDetailsDescription?: boolean;
  number?: boolean;
  filter?: boolean;
  searchIcon?: boolean;
  icon?: string;
  backIcon?: boolean;
  isSearchIconRemove?: boolean;
  isError?: boolean;
  viewGroup?: boolean;
  halfScreen?: boolean;
  hideButton?: boolean;
  maxLength?: number;
  onCloseKeyboard?: (val: boolean) => void;
  iconRightName?: string;
  keypadType?: KeyboardTypeOptions;
};

export const InputTextField: React.FC<InputTextFieldProps> = ({
  label,
  multiline,
  password,
  company,
  taskDetails,
  isSearchIconRemove,
  icon,
  number,
  maxLength,
  value,
  taskDetailsDescription,
  isError,
  halfScreen,
  iconRightName,
  keypadType,
  ...props
}) => {
  return (
    <>
      {label !== undefined && label?.length > 0 && (
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles(value, isError).label}>
          {label}
        </TextView>
      )}
      <Stack horizontal verticalAlign="center">
        {icon && !isSearchIconRemove && (
          <Stack style={styles(value, isError).searchIcon}>
            <Icon
              name={icon ? icon : ''}
              size={18}
              color={colors.primary_003}
            />
          </Stack>
        )}
        <TextInput
          style={
            multiline
              ? styles(value, isError).inputDescription
              : taskDetails
              ? styles(value, isError).inputTaskDetails
              : taskDetailsDescription
              ? styles(value, isError).inputTaskDetailsDescription
              : halfScreen
              ? styles(value, isError).inputHalfScreen
              : styles(value, isError).input
          }
          secureTextEntry={password ? true : false}
          autoCorrect={false}
          autoComplete={'off'}
          autoFocus={company ? true : false}
          multiline={multiline || taskDetailsDescription}
          numberOfLines={multiline ? 3 : 1}
          keyboardType={number ? 'number-pad' : keypadType}
          value={value}
          maxLength={maxLength ? maxLength : 200}
          {...props}
          placeholderTextColor={colors.grey_005}
        />
        {iconRightName && (
          <TouchableOpacity
            style={
              multiline
                ? styles(value, isError).micIconMultiline
                : styles(value, isError).micIcon
            }>
            <Icon
              name={iconRightName ? iconRightName : ''}
              size={18}
              color={colors.primary_003}
            />
          </TouchableOpacity>
        )}
      </Stack>
    </>
  );
};

export const styles = (
  value: string | undefined,
  isError: boolean | undefined,
) => {
  const mergeStyles = StyleSheet.create({
    label: {
      marginTop: 15,
      marginBottom: 5,
      color: colors.primary_003,
    },
    searchIcon: {
      marginLeft: 10,
    },
    micIcon: {
      right: 32,
    },
    micIconMultiline: {
      right: 32,
      top: -30,
    },
    input: {
      // flex: 1,
      height: 40,
      borderWidth: 1,
      padding: 10,
      paddingTop: 5,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor:
        value!.length === 0
          ? isError
            ? colors.red
            : colors.white
          : colors.grey_008,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.medium,
      // flexGrow: 1,
      color: colors.black,
      width: Dimensions.get('screen').width - 32,
      borderRadius: 3,
    },
    inputHalfScreen: {
      // flex: 1,
      height: 40,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor:
        value!.length === 0
          ? isError
            ? colors.red
            : colors.white
          : colors.grey_008,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.medium,
      // flexGrow: 1,
      color: colors.black,
      width: Dimensions.get('screen').width - 225,
      borderRadius: 3,
    },
    inputTaskDetails: {
      height: 40,
      borderWidth: 1,
      backgroundColor: colors.white,
      borderColor:
        value!.length === 0
          ? isError
            ? colors.red
            : colors.white
          : colors.grey_008,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.small,
      width: Dimensions.get('screen').width - 65,
      padding: 10,
      borderRadius: 3,
      marginBottom: 10,
    },
    inputDescription: {
      // height: 100,
      borderWidth: 1,
      paddingTop: 10,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor:
        value!.length === 0
          ? isError
            ? colors.red
            : colors.white
          : colors.grey_008,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.medium,
      textAlignVertical: 'top',
      width: Dimensions.get('screen').width - 32,
      borderRadius: 3,
    },
    inputTaskDetailsDescription: {
      // height: 100,
      borderWidth: 1,
      paddingTop: 10,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor:
        value!.length === 0
          ? isError
            ? colors.red
            : colors.white
          : colors.grey_008,
      fontFamily: AppFonts.regular,
      fontSize: FontSizes.small,
      textAlignVertical: 'top',
      width: Dimensions.get('screen').width - 64,
      borderRadius: 3,
      marginBottom: 10,
    },
  });
  return mergeStyles;
};
