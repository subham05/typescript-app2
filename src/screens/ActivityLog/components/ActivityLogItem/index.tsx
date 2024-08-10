import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet, View} from 'react-native';
import {activityLogsObjModal} from 'request/ActivityLogs';

interface ActivityLogItemProps {
  data: activityLogsObjModal;
}

export interface ActivityLogProps {
  name: string;
  company: string;
  date: string;
  activity: string;
}

export const ActivityLogItem: React.FC<ActivityLogItemProps> = ({data}) => {
  const {t} = useTranslation();
  const {name, company, documentDescription, time, date} = data;
  return (
    <Stack>
      <StackItem childrenGap={10} style={styles.container}>
        <Stack horizontal horizontalAlign="space-between" center>
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {name || ''}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {date || ''};{'  '}
            {time}
          </TextView>
        </Stack>
        <TextView weight="regular" variant={FontSizes.small} truncate>
          {company || ''}
        </TextView>
        <Stack horizontal>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {t('activityLogs:activity')} :{'  '}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{
              color: colors.primary,
              width: Dimensions.get('screen').width - 120,
            }}>
            {documentDescription || ''}
          </TextView>
        </Stack>
        <View style={styles.bottom} />
      </StackItem>
    </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 3,
    backgroundColor: colors.white,
  },
  bottom: {
    marginBottom: 15,
  },
});
