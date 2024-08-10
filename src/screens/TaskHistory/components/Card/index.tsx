import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TaskHistory} from 'request/ManageTask';
import {Stack} from 'stack-container';
import {Styles} from '../../index.styles';

interface TaskHistoryCardProps {
  taskProps: TaskHistory;
}
export const TaskHistoryCard: React.FC<TaskHistoryCardProps> = ({
  taskProps,
}) => {
  const {t} = useTranslation();

  // const {taskTitle, assigneeName, reporterName} = taskProps?.data?.record;

  const styles = Styles();
  return (
    <Stack
      spacing={16}
      horizontal
      horizontalAlign="space-between"
      style={styles.card}>
      <Stack childrenGap={5}>
        <TextView
          weight="medium"
          variant={FontSizes.regular}
          style={styles.taskName}>
          {taskProps?.data?.record?.taskTitle || '--'}
        </TextView>
        <Stack horizontal childrenGap={5}>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {t('taskDetails:assignee')} :{' '}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {taskProps?.data?.record?.assigneeName || '--'}
          </TextView>
        </Stack>
        <Stack horizontal childrenGap={5}>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {t('taskDetails:reporter')} :{' '}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.xSmall}
            style={{color: colors.primary_003}}>
            {taskProps?.data?.record?.reporterName || '--'}
          </TextView>
        </Stack>
      </Stack>
      {/* <Stack childrenGap={5} style={styles.dueDate}>
        <TextView
          weight="regular"
          variant={FontSizes.xSmall}
          style={{color: colors.primary_003}}>
          {t('taskDetails:dueDate')} :
        </TextView>
        <Stack horizontal childrenGap={5} verticalAlign="center">
          <Icon name="calendar" size={12} color={colors.primary_003} />
          <TextView weight="medium" variant={FontSizes.xxSmall}>
            {date || '--'}
          </TextView>
        </Stack>
      </Stack> */}
    </Stack>
  );
};
