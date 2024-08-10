import {FormikDropdownPicker} from 'components/formikFields';
import {useFormikContext} from 'formik';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {EventFormModel} from 'screens/CreateEvent/types';

export const RepeatEvent = ({
  navigation,
  repeatEventEdit,
  editCustomModalOpen,
}: any) => {
  const {t} = useTranslation();

  const {values} = useFormikContext<EventFormModel>();

  useEffect(() => {
    if (values.repeatEvent === 'CUSTOM') {
      if (!editCustomModalOpen) {
        navigation.navigate('CustomRecurrence', {data: values});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.repeatEvent, repeatEventEdit]);

  const [repeatEvent, setRepeatEvent] = useState<string>(
    repeatEventEdit ? repeatEventEdit : 'DO_NOT_REPEAT',
  );
  const allEvents = [
    {label: 'Does not repeat', value: 'DO_NOT_REPEAT'},
    {label: 'Every day', value: 'DAY'},
    {label: 'Every week', value: 'WEEK'},
    {label: 'Every month', value: 'MONTH'},
    {label: 'Every year', value: 'YEAR'},
    {label: 'Custom', value: 'CUSTOM'},
  ];

  return (
    <FormikDropdownPicker
      label={t('createEvent:repeatEvent')}
      options={allEvents}
      value={repeatEvent}
      name="repeatEvent"
      onSelect={item => {
        setRepeatEvent(item.value);
        if (item.value === 'CUSTOM') {
          navigation.navigate('CustomRecurrence', {data: values});
        }
      }}
      placeholder={t('createEvent:dropdownPlaceholder_1')}
      radioOptions
    />
  );
};
