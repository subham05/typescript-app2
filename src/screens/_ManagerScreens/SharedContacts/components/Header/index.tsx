import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {SearchTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Styles} from './index.styles';

interface ContactRepositoryHeaderProps {
  selectedValue: string;
  onPress: (value: string) => void;
  header1?: string;
  header2?: string;
  isHeader?: boolean;
}

export const ContactRepositoryHeader: React.FC<
  ContactRepositoryHeaderProps
> = ({
  selectedValue,
  onPress,
  header1 = 'Shared with me',
  header2 = 'Shared by me',
  isHeader = false,
}) => {
  const {t} = useTranslation();

  const onSelect = (value: string) => {
    onPress(value);
  };

  const styles = Styles();
  return (
    <>
      {!isHeader && (
        <Stack
          horizontal
          spacing={16}
          spaceBelow={16}
          style={styles.attachmentView}>
          <SearchTextField />
        </Stack>
      )}
      <Stack
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.contactView}>
        <TouchableOpacity
          style={
            selectedValue === header1
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            onSelect(header1);
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {isHeader ? header1 : t('contacts:sharedWithMe')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedValue === header2
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            onSelect(header2);
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {isHeader ? header2 : t('contacts:sharedByMe')}
          </TextView>
        </TouchableOpacity>
      </Stack>
    </>
  );
};
