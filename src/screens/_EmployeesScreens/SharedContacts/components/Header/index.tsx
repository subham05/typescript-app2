import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {SearchTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Styles} from './index.styles';

interface ContactRepositoryHeaderProps {
  selectedValue: string;
  onPress: (value: string) => void;
}

export const ContactRepositoryHeader: React.FC<
  ContactRepositoryHeaderProps
> = ({selectedValue, onPress}) => {
  const {t} = useTranslation();

  const [selectedContact, setSelectedContact] = useState<string>(selectedValue);

  const onSelect = (value: string) => {
    setSelectedContact(value);
    onPress(value);
  };

  const styles = Styles();
  return (
    <>
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField />
      </Stack>
      <Stack
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.contactView}>
        <TouchableOpacity
          style={
            selectedContact === 'Shared with me'
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            onSelect('Shared with me');
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('contacts:sharedWithMe')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            selectedContact === 'Shared by me'
              ? styles.contactSelected
              : styles.contactNotSelected
          }
          onPress={() => {
            onSelect('Shared by me');
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles.contactText}>
            {t('contacts:sharedByMe')}
          </TextView>
        </TouchableOpacity>
      </Stack>
    </>
  );
};
