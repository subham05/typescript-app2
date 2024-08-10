import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {Stack} from 'stack-container';
import {InputTextField, InputTextFieldProps} from '../InputTextField';

export const SearchTextField: React.FC<InputTextFieldProps> = ({
  filter,
  company,
  backIcon,
  isSearchIconRemove,
  style,
  viewGroup,
  hideButton,
  onCloseKeyboard,
}) => {
  const {t} = useTranslation();

  const [searchText, setSearchText] = useState<string>('');

  return (
    <>
      <Stack horizontal verticalAlign="center">
        <InputTextField
          style={
            style
              ? style
              : filter
              ? styles.inputFilter
              : viewGroup
              ? styles.inputFilterGroup
              : styles.inputSearch
          }
          placeholder={t('search')}
          onChangeText={setSearchText}
          value={searchText}
          searchIcon
          icon="search"
          isSearchIconRemove={isSearchIconRemove ? true : false}
          company={company ? true : false}
          onFocus={() => (hideButton ? onCloseKeyboard!(true) : null)}
          onBlur={() => (hideButton ? onCloseKeyboard!(false) : null)}
        />
        {searchText !== '' && (
          <TouchableOpacity
            onPress={() => setSearchText('')}
            style={backIcon && styles.closeIcon}>
            <Icon name="close" size={18} color={colors.primary_003} />
          </TouchableOpacity>
        )}
      </Stack>
    </>
  );
};

const styles = StyleSheet.create({
  label: {
    marginTop: 15,
  },
  inputSearch: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.small,
    flexGrow: 1,
    width: Dimensions.get('screen').width - 85,
    borderRadius: 3,
  },
  inputFilter: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.small,
    marginRight: 65,
    width: Dimensions.get('screen').width - 330,
    borderRadius: 3,
  },
  inputFilterGroup: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    borderColor: colors.white,
    fontFamily: AppFonts.medium,
    fontSize: FontSizes.small,
    marginRight: 65,
    width: Dimensions.get('screen').width - 100,
    borderRadius: 3,
  },
  attachmentIcon: {
    marginLeft: 10,
  },
  closeIcon: {left: -10},
});
