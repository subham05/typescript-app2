import {useFocusEffect} from '@react-navigation/native';
import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {TextField, TextFieldProps} from 'components/TextField';
import {TextView} from 'components/TextView';
import React, {useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {respWidth} from 'screens/Calendar/utils/responsive';
import {Stack} from 'stack-container';

type SearchTextFieldProps = TextFieldProps & {
  modal?: boolean;
  onSearchChange?: (value: string) => void;
  selectedContact?: string;
  pattern1?: RegExp;
  pattern2?: RegExp;
  setSearchValue?: (val: string) => void;
  closeIconStyle?: ViewStyle;
  isForCreateGroup?: boolean;
};
let timeId = 0;
export const SearchTextField: React.FC<SearchTextFieldProps> = ({
  modal,
  removeIcon,
  pattern1 = /[~`!@#$%^&*+=\-[\]\\';,._©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?\s]/,
  pattern2,
  onSearchChange,
  selectedContact,
  setSearchValue,
  placeholder = 'search',
  autoFocus = false,
  closeIconStyle,
  isForCreateGroup,
  ...props
}) => {
  const {t} = useTranslation();
  const [searchText, setSearchText] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    setSearchValue?.(searchText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);
  useFocusEffect(
    useCallback(() => {
      return () => {
        setSearchText('');
        setIsError(false);
      };
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      if (props.value?.length) {
        setSearchText(props.value);
      }
    }, [props.value]),
  );
  useEffect(() => {
    setSearchText('');
    onSearchChange ? onSearchChange('') : null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedContact]);
  const RenderRightContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSearchText('');
          setIsError(false);
          onSearchChange ? onSearchChange('') : null;
        }}
        style={closeIconStyle ? closeIconStyle : styles.closeIcon}>
        <Icon name="close" size={18} color={colors.primary_003} />
      </TouchableOpacity>
    );
  };

  const EmptyContainer = () => {
    return <View style={styles.emptyContainer} />;
  };

  const stackStyle: StyleProp<ViewStyle> | undefined = {
    width: modal ? Dimensions.get('screen').width / 1.8 : undefined,
    // borderWidth: 0.5,
    // borderRadius: 2,
    marginHorizontal: isForCreateGroup ? respWidth(9) : 0,
  };

  const inputStyle: StyleProp<ViewStyle> | undefined = {
    width: modal
      ? Dimensions.get('screen').width / 2.5
      : Dimensions.get('screen').width - 90,
  };
  const onChangeText = (value: string) => {
    setSearchText(value);
    clearTimeout(timeId);
    value.trim().match(pattern1!) ? setIsError(true) : setIsError(false);
    timeId = setTimeout(() => {
      value.match(pattern2!) && onSearchChange?.(value);
    }, 500);
  };
  return (
    <Stack>
      <Stack style={stackStyle}>
        <TextField
          {...props}
          value={searchText}
          onChangeText={onChangeText}
          placeholder={t(placeholder)}
          placeholderTextColor={colors.grey_005}
          style={[styles.searchInput, inputStyle]}
          icon={removeIcon ? undefined : 'search'}
          removeIcon={removeIcon}
          RenderRightContainer={
            searchText ? RenderRightContainer : EmptyContainer
          }
          containerStyles={[
            styles.textFieldHeight,
            stackStyle,
            isError && styles.titleError,
          ]}
          autoFocus={autoFocus}
        />
      </Stack>
      {isError && (
        <TextView style={styles.errorMsg} variant={14} weight="regular">
          {t('voiceNotes:searchError')}
        </TextView>
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    // borderWidth: 1,
    padding: 10,
    borderColor: colors.white,
    fontFamily: AppFonts.regular,
    fontSize: FontSizes.medium,
    color: colors.black,
    flexGrow: 1,
    marginBottom: 1,
    borderRadius: 3,
    // width: Dimensions.get('screen').width - 90,
  },
  errorMsg: {
    color: colors.red_001,
    marginHorizontal: 28,
  },
  titleError: {borderColor: colors.red_001, borderWidth: 0.5},
  closeIcon: {left: -15},
  emptyContainer: {width: 18},
  textFieldHeight: {height: 46},
});
