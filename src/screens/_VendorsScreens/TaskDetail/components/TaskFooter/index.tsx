import {PrimaryButton} from 'components/Buttons';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';

export const TaskFooter = () => {
  const {t} = useTranslation();

  return (
    <Stack spacing={16} spaceBelow={16}>
      <PrimaryButton
        disabled
        title={t('taskDetails:pendingApproval')}
        onPress={() => {}}
      />
    </Stack>
  );
};
