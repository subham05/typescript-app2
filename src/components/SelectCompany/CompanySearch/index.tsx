import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import React from 'react';
import {Styles} from '../index.styles';

interface CompanySearchProps {
  initial?: boolean;
  searchText?: (text: string) => void;
}
export const CompanySearch: React.FC<CompanySearchProps> = ({
  initial,
  searchText,
}) => {
  const styles = Styles();
  return (
    <Stack
      horizontal
      spacing={16}
      spaceBelow={16}
      style={styles.attachmentView}>
      <SearchTextField
        setSearchValue={val => {
          searchText?.(val.trim());
        }}
        autoFocus={initial ? true : false}
        // pattern1={/[~`!@#$%^&*+=[\]\\;,_©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?]/}
        // pattern2={/^[ A-Za-z0-9.'-]*$/}
        // eslint-disable-next-line no-empty-character-class
        pattern1={/[]/}
        pattern2={
          /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
        }
        // onFocus={() => onCloseKeyboard!(true)}
        // onBlur={() => onCloseKeyboard!(false)}
      />
    </Stack>
  );
};
