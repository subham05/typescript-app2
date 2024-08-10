import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {StackItem} from 'components/Stack';
import {TextView} from 'components/TextView';
import React, {useState} from 'react';
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {DropdownProps} from 'react-native-element-dropdown/src/Dropdown/type';
import {Stack} from 'stack-container';

export interface DropdownPickerOptions {
  label: string;
  value: string;
}

export type DropdownPickerProps = Omit<
  DropdownProps,
  'labelField' | 'valueField' | 'data'
> & {
  label?: string;
  accounts?: boolean;
  disabled?: boolean;
  isError?: boolean;
  options: DropdownPickerOptions[];
  radioOptions?: boolean;
  optionsFontsize?: FontSizes;
  optionsFontFamily?: string;
  fontSize?: FontSizes;
  textPrimaryColor?: boolean;
  optionsIconSize?: number;
  showDataAsPlaceholder?: boolean;
};

export const DropdownPicker: React.FC<DropdownPickerProps> = ({
  label,
  value,
  isError,
  disabled,
  options,
  radioOptions,
  optionsFontsize = FontSizes.regular,
  fontSize = FontSizes.medium,
  textPrimaryColor,
  optionsIconSize = 22,
  showDataAsPlaceholder,
  ...props
}) => {
  const [inFocus, setInFocus] = useState<boolean>(false);
  const onFocus = () => setInFocus(true);
  const onBlur = () => setInFocus(false);

  const calculateHeight = () => {
    let height;
    if (options.length * 60 > 300) {
      height = 300;
    } else {
      height = options.length * 60;
    }
    return height;
  };

  const borderStyle: StyleProp<ViewStyle> | undefined = {
    borderWidth: 1,
    borderColor: inFocus
      ? colors.grey_003
      : isError
      ? colors.red
      : disabled
      ? colors.grey_002
      : colors.white,
  };
  const backgroundColorStyle: StyleProp<ViewStyle> | undefined = {
    backgroundColor: disabled ? colors.grey_012 : colors.white,
  };
  const textColorStyle: StyleProp<TextStyle> | undefined = {
    color: disabled
      ? colors.primary_003
      : textPrimaryColor
      ? colors.primary_007
      : colors.black,
  };
  const textFontStyle: StyleProp<TextStyle> | undefined = {
    fontSize: fontSize,
  };

  const placeholderFontStyle: StyleProp<TextStyle> | undefined = {
    color: showDataAsPlaceholder ? colors.black : colors.grey_003,
  };

  const renderItem = (item: any) => {
    return (
      <StackItem style={styles.item} childrenGap={15}>
        <StackItem horizontal childrenGap={10}>
          {item.label === 'Custom date' ? (
            <Icon
              name="add_floating"
              size={optionsIconSize}
              color={colors.black}
            />
          ) : value === item.value ? (
            <Icon
              name="radio_button_checked"
              size={optionsIconSize}
              color={colors.black}
            />
          ) : (
            <Icon
              name="radio_button_unchecked"
              size={optionsIconSize}
              color={colors.black}
            />
          )}
          <TextView weight="regular" variant={optionsFontsize}>
            {item.label}
          </TextView>
        </StackItem>
        <Divider size={1.5} />
      </StackItem>
    );
  };

  return (
    <Stack childrenGap={5}>
      {label !== undefined && label?.length > 0 && (
        <TextView variant={FontSizes.regular} style={styles.label}>
          {label}
        </TextView>
      )}
      <Dropdown
        autoScroll={false}
        style={[styles.dropdown, borderStyle, backgroundColorStyle]}
        data={options}
        labelField={'label'}
        valueField={'value'}
        placeholderStyle={[
          styles.placeholderText,
          textFontStyle,
          placeholderFontStyle,
        ]}
        selectedTextStyle={[styles.text, textColorStyle, textFontStyle]}
        // maxHeight={300}
        maxHeight={calculateHeight()}
        containerStyle={styles.containerStyle}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        disable={disabled}
        renderItem={radioOptions ? renderItem : undefined}
        flatListProps={{inverted: false}}
        dropdownPosition="bottom"
        {...props}
      />
    </Stack>
  );
};
const styles = StyleSheet.create({
  label: {
    color: colors.primary_003,
    textAlign: 'left',
  },
  dropdown: {
    padding: 10,
    borderWidth: 1,
    height: 50,
    fontFamily: AppFonts.regular,
    fontSize: FontSizes.medium,
    borderRadius: 3,
    color: colors.grey_004,
  },
  text: {
    fontFamily: AppFonts.regular,
    // ellipsizeMode: 'tail',
    // numberOfLines: 4,
    // width: 100,
  },
  placeholderText: {
    fontFamily: AppFonts.regular,
    // color: colors.grey_003,
    textAlign: 'left',
  },
  containerStyle: {borderRadius: 3},
  item: {
    padding: 17,
  },
});
