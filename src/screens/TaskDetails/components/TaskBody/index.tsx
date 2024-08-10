import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {attachmentMockData} from 'screens/TaskDetail/components/TaskBody/attachmentMockData';
import {AttachmentTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Attachment';
import {TasksTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Task';
import {Styles} from './index.styles';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [task, setTask] = useState<boolean>(true);
  const [attachment, setAttachment] = useState<boolean>(true);

  const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
          <TouchableOpacity onPress={() => setTask(!task)}>
            <Stack horizontal horizontalAlign="space-between">
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.label}>
                {t('taskDetails:taskName')}
              </TextView>
              {task ? (
                <Icon
                  name="arrow_drop_up"
                  size={24}
                  color={colors.black}
                  style={styles.dropIcon}
                />
              ) : (
                <Icon
                  name="arrow_drop_down"
                  size={24}
                  color={colors.black}
                  style={styles.dropIcon}
                />
              )}
            </Stack>
          </TouchableOpacity>
          {task && <TasksTaskBody taskProps={taskProps} />}

          <TouchableOpacity onPress={() => setAttachment(!attachment)}>
            <Stack horizontal horizontalAlign="space-between">
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.label}>
                {t('taskDetails:attachment')}
              </TextView>
              {attachment ? (
                <Icon
                  name="arrow_drop_up"
                  size={24}
                  color={colors.black}
                  style={styles.dropIcon}
                />
              ) : (
                <Icon
                  name="arrow_drop_down"
                  size={24}
                  color={colors.black}
                  style={styles.dropIcon}
                />
              )}
            </Stack>
          </TouchableOpacity>
          {attachment && <AttachmentTaskBody data={attachmentMockData} />}
        </KeyboardAwareScrollView>
      </Stack>
    </>
  );
};
