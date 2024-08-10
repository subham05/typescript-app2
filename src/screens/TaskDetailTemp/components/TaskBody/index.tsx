import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from './index.styles';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [comment, setComment] = useState<string>('');

  const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:companyName')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          {taskProps.tasksProps.taskName}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:taskName')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          {taskProps.tasksProps.name}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:description')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.inputDescription}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fringilla
          pellentesque quam lorem in hendrerit.
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:assignee')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          {taskProps.tasksProps.assigneeName}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:designation')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.input}>
          Manager
        </TextView>
        {taskProps.tasksProps.status === 'Completed' && (
          <Stack>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('taskDetails:addComment')}
            </TextView>
            <Stack style={styles.attachmentView}>
              <Stack horizontal style={styles.attachment}>
                <Icon name="mic" size={18} style={styles.commentIcon} />
                <InputTextField
                  style={styles.inputComment}
                  placeholder="Task name"
                  onChangeText={text => setComment(text)}
                  value={comment}
                />
                <Icon name="attach_file" size={18} style={styles.commentIcon} />
                <Icon name="smily" size={18} style={styles.commentIcon} />
                <Icon name="send" size={18} style={styles.commentIcon} />
              </Stack>
            </Stack>
          </Stack>
        )}
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('taskDetails:attachment')}
        </TextView>
        <Stack horizontal style={styles.attachmentView}>
          <Stack horizontal style={styles.attachment}>
            <Icon
              name="photo_gallary"
              size={18}
              style={styles.attachmentIcon}
            />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.attachmentName}>
              Project_details.png
            </TextView>
          </Stack>
          <Icon name="download" size={18} style={styles.downloadIcon} />
        </Stack>
      </Stack>
    </>
  );
};
