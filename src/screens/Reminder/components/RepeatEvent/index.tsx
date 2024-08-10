import {DropdownPicker} from 'components/DropdownPicker';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export const ReminderRepeatEvent = ({navigation}: any) => {
  const {t} = useTranslation();

  const [repeatEvent, setRepeatEvent] = useState<string>('');
  const allEvents = [
    {label: 'Does not repeat', value: 'Does not repeat'},
    {label: 'Every day', value: 'Every day'},
    {label: 'Every week', value: 'Every week'},
    {label: 'Every month', value: 'Every month'},
    {label: 'Every year', value: 'Every year'},
    {label: 'Custom', value: 'Custom'},
  ];
  useEffect(() => {
    if (repeatEvent === 'Custom') {
      navigation.navigate('CustomRecurrence');
    }
  }, [navigation, repeatEvent]);

  return (
    <DropdownPicker
      label={t('createEvent:repeatEvent')}
      options={allEvents}
      value={repeatEvent}
      onChange={item => {
        setRepeatEvent(item.value);
      }}
      placeholder={t('createEvent:dropdownPlaceholder_1')}
      radioOptions
    />
  );
};
