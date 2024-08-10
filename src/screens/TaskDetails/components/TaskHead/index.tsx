import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, View} from 'react-native';
import {Styles} from './index.styles';

interface TaskHeadProps {
  taskProps: TaskInterface | any;
}
export const TaskHead: React.FC<TaskHeadProps> = ({taskProps}) => {
  const {t} = useTranslation();

  const styles = Styles();
  return (
    <>
      <Stack
        horizontal
        horizontalAlign="space-between"
        spacing={16}
        spaceBelow={16}>
        <TextView weight="bold" variant={18}>
          #1234: {taskProps.name}
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
                {t('taskDetails:date')}:
              </TextView>
              <Stack horizontal>
                <Icon name="calendar" size={18} style={styles.smallIcon} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={styles.date}>
                  {taskProps.date}
                </TextView>
              </Stack>
            </StackItem>
            <StackItem childrenGap={10} horizontal style={{}}>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles.smallLabel}>
                {t('taskDetails:time')}:
              </TextView>
              <Stack horizontal>
                <Icon name="time" size={22} style={styles.smallIcon} />
                <TextView
                  weight="medium"
                  variant={FontSizes.xSmall}
                  style={styles.date}>
                  {taskProps.time}
                </TextView>
              </Stack>
            </StackItem>
          </StackItem>
        </Stack>
      </View>
    </>
  );
};
