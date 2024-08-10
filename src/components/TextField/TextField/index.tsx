import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {TextView} from 'components/TextView';
import React, {useRef, useState} from 'react';
import {
  Dimensions,
  I18nManager,
  LayoutChangeEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';
import {Stack} from 'stack-container';

const ICON_WIDTH_SPACE = 40;
export type TextFieldProps = TextInputProps & {
  label?: string;
  icon?: string;
  autoComplete?: string;
  keyboardType?: string;
  isError?: boolean;
  RenderRightContainer?: React.FC | undefined;
  showBorder?: boolean;
  removeIcon?: boolean;
  enableBackground?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  innerRef?: any;
};

export const TextField: React.FC<TextFieldProps> = ({
  label,
  icon,
  isError,
  autoComplete,
  RenderRightContainer,
  style,
  multiline,
  keyboardType,
  showBorder,
  removeIcon,
  containerStyles,
  editable = true,
  enableBackground = false,
  innerRef,
  ...props
}) => {
  const renderRef = useRef<boolean>(true);
  const [layoutData, setLayoutData] = useState<
    {height: number; width: number} | undefined
  >();
  const [inFocus, setInFocus] = useState<boolean>(false);
  const borderStyle: StyleProp<ViewStyle> | undefined = {
    borderWidth: 1,
    borderColor: removeIcon
      ? colors.white
      : inFocus
      ? colors.grey_003
      : showBorder
      ? colors.grey_008
      : isError
      ? colors.red
      : !editable && !enableBackground
      ? colors.grey_012
      : colors.white,
    borderRadius: 3,
  };

  const onFocus = () => setInFocus(true);
  const onBlur = () => setInFocus(false);

  const onLayout = (event: LayoutChangeEvent) => {
    var {width, height} = event.nativeEvent.layout;
    if (renderRef.current) {
      setLayoutData({width, height});
    }
    renderRef.current = false;
  };

  const TextFieldWidth =
    (layoutData?.width || Dimensions.get('screen').width - 32) -
    ICON_WIDTH_SPACE;
  const TextInputStyles: StyleProp<TextStyle> | undefined = {
    width: RenderRightContainer ? TextFieldWidth : layoutData?.width,
  };
  const iconContainerStyles: ViewStyle = {
    width: ICON_WIDTH_SPACE,
    height: 50,
  };
  const multilineStyle: StyleProp<TextStyle> | undefined = {
    textAlignVertical: 'top',
  };

  const textInputContainer: StyleProp<ViewStyle> | undefined = {
    backgroundColor:
      !editable && !enableBackground ? colors.grey_012 : colors.white,
  };

  const textInputText: StyleProp<TextStyle> | undefined = {
    color: editable || enableBackground ? colors.black : colors.primary_003,
  };

  return (
    <Stack childrenGap={5}>
      {label !== undefined && label?.length > 0 && (
        <TextView variant={FontSizes.regular} style={styles.label}>
          {label}
        </TextView>
      )}

      <Stack
        onLayout={onLayout}
        horizontal
        verticalAlign="center"
        style={[borderStyle, textInputContainer, containerStyles]}>
        {icon && (
          <Stack
            verticalAlign="flex-end"
            horizontalAlign="center"
            style={[styles.iconContainer, iconContainerStyles]}>
            <Icon name={icon} size={18} color={colors.primary_003} />
          </Stack>
        )}

        <TextInput
          ref={innerRef}
          onFocus={onFocus}
          onBlur={onBlur}
          {...props}
          multiline={multiline}
          editable={editable}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          placeholderTextColor={colors.grey_003}
          style={[
            TextInputStyles,
            styles.textInput,
            multiline && multilineStyle,
            textInputText,
            style,
          ]}
        />

        {RenderRightContainer && <RenderRightContainer />}
      </Stack>
      {/* <Stack horizontal verticalAlign="center" style={[borderStyle, {flex: 1}]}>
        {icon && (
          <Stack>
            <Icon
              name={icon ? icon : ''}
              size={18}
              color={colors.primary_003}
            />
          </Stack>
        )}
        <TextInput
          // style={
          //   multiline
          //     ? styles(value, isError).inputDescription
          //     : taskDetails
          //     ? styles(value, isError).inputTaskDetails
          //     : taskDetailsDescription
          //     ? styles(value, isError).inputTaskDetailsDescription
          //     : halfScreen
          //     ? styles(value, isError).inputHalfScreen
          //     : styles(value, isError).input
          // }
          // autoCorrect={false}
          // autoFocus={company ? true : false}
          // numberOfLines={multiline ? 3 : 1}
          style={[styles.input]}
          {...props}
        />
      </Stack> */}
    </Stack>
  );
};

export const styles = StyleSheet.create({
  label: {
    color: colors.primary_003,
    textAlign: 'left',
  },
  textInputContainer: {
    backgroundColor: 'white',
  },
  textInput: {
    // backgroundColor: 'aqua',
    paddingHorizontal: 15,
    // color: colors.black,
    fontSize: FontSizes.medium,
    fontFamily: AppFonts.regular,
    borderRadius: 3,
    paddingVertical: Platform.OS === 'ios' ? 9 : undefined,
    color: colors.black,
    maxHeight: 102,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    // overflow: 'hidden',
  },
  iconContainer: {
    // backgroundColor: 'wheat',
  },
  input: {
    flexGrow: 1,
    backgroundColor: colors.white,
    fontFamily: AppFonts.regular,
    fontSize: FontSizes.medium,
    color: colors.black,
    borderRadius: 3,
  },
  // inputHalfScreen: {
  //   // flex: 1,
  //   height: 40,
  //   borderWidth: 1,
  //   padding: 10,
  //   marginTop: 5,
  //   backgroundColor: colors.white,
  //   borderColor:
  //     value!.length === 0
  //       ? isError
  //         ? colors.red
  //         : colors.white
  //       : colors.grey_008,
  //   fontFamily: AppFonts.regular,
  //   fontSize: FontSizes.medium,
  //   // flexGrow: 1,
  //   color: colors.black,
  //   width: Dimensions.get('screen').width - 225,
  //   borderRadius: 3,
  // },
  // inputTaskDetails: {
  //   height: 40,
  //   borderWidth: 1,
  //   backgroundColor: colors.white,
  //   borderColor:
  //     value!.length === 0
  //       ? isError
  //         ? colors.red
  //         : colors.white
  //       : colors.grey_008,
  //   fontFamily: AppFonts.regular,
  //   fontSize: FontSizes.small,
  //   width: Dimensions.get('screen').width - 65,
  //   padding: 10,
  //   borderRadius: 3,
  //   marginBottom: 10,
  // },
  // inputDescription: {
  //   // height: 100,
  //   borderWidth: 1,
  //   paddingTop: 10,
  //   padding: 10,
  //   marginTop: 5,
  //   backgroundColor: colors.white,
  //   borderColor:
  //     value!.length === 0
  //       ? isError
  //         ? colors.red
  //         : colors.white
  //       : colors.grey_008,
  //   fontFamily: AppFonts.regular,
  //   fontSize: FontSizes.medium,
  //   textAlignVertical: 'top',
  //   width: Dimensions.get('screen').width - 32,
  //   borderRadius: 3,
  // },
  // inputTaskDetailsDescription: {
  //   // height: 100,
  //   borderWidth: 1,
  //   paddingTop: 10,
  //   padding: 10,
  //   marginTop: 5,
  //   backgroundColor: colors.white,
  //   borderColor:
  //     value!.length === 0
  //       ? isError
  //         ? colors.red
  //         : colors.white
  //       : colors.grey_008,
  //   fontFamily: AppFonts.regular,
  //   fontSize: FontSizes.small,
  //   textAlignVertical: 'top',
  //   width: Dimensions.get('screen').width - 64,
  //   borderRadius: 3,
  //   marginBottom: 10,
  // },
});
