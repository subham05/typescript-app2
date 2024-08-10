import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskPriority} from 'components/Task/TaskPriority';
import {TaskStatus} from 'components/Task/TaskStatus';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {Styles} from './index.styles';

export const TaskHead = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();
  const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <TextView weight="bold" variant={18}>
          #1234: {taskProps.tasksProps.name}
        </TextView>
      </Stack>
      <View style={styles.view}>
        <Stack spacing={16} spaceBelow={16}>
          <StackItem childrenGap={20} horizontal>
            <StackItem
              childrenGap={10}
              horizontal
              style={{width: Dimensions.get('screen').width / 2.4}}>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.smallLabel}>
                {t('taskDetails:dueDate')}:
              </TextView>
              <Stack horizontal>
                <Icon name="calendar" size={18} style={styles.smallIcon} />
                <TextView
                  weight="bold"
                  variant={FontSizes.xSmall}
                  style={styles.date}>
                  {taskProps.tasksProps.date}
                </TextView>
              </Stack>
            </StackItem>
            <StackItem childrenGap={10} horizontal style={{}}>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.smallLabel}>
                {t('taskDetails:dueTime')}:
              </TextView>
              <Stack horizontal>
                <Icon name="time" size={22} style={styles.smallIcon} />
                <TextView
                  weight="bold"
                  variant={FontSizes.xSmall}
                  style={styles.date}>
                  {taskProps.tasksProps.time}
                </TextView>
              </Stack>
            </StackItem>
          </StackItem>
        </Stack>
      </View>

      <Stack spacing={16} spaceBelow={16}>
        <StackItem childrenGap={20} horizontal>
          <StackItem
            childrenGap={10}
            horizontal
            style={{width: Dimensions.get('screen').width / 2.4}}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.smallLabel}>
              {t('taskDetails:status')}:
            </TextView>
            <TaskStatus status={taskProps.tasksProps.status} />
          </StackItem>
          <StackItem childrenGap={10} horizontal style={{}}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.smallLabel}>
              {t('taskDetails:priority')}:
            </TextView>
            <Stack style={styles.priority}>
              <TaskPriority
                priority={taskProps.tasksProps.priority}
                outlined={true}
              />
            </Stack>
          </StackItem>
        </StackItem>
      </Stack>
    </>
  );
};
