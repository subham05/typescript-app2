import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {attachmentMockData} from 'screens/TaskDetail/components/TaskBody/attachmentMockData';
import {commentsMockData} from 'screens/TaskDetail/components/TaskBody/commentsMockData';
import {AttachmentTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Attachment';
import {CommentTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Comments';
import {CompanyTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Company';
import {TaskBodyHead} from 'screens/TaskDetail/components/TaskBody/components/Header';
import {ReporterTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Reporter';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [company, setCompany] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reporter, setReporter] = useState<boolean>(true);

  // const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <TaskBodyHead
          header={t('taskDetails:companyName')}
          value={company}
          onPress={val => setCompany(val)}
        />
        {company && <CompanyTaskBody taskProps={taskProps} />}

        <TaskBodyHead
          header={t('taskDetails:reporter')}
          value={reporter}
          onPress={val => setReporter(val)}
        />
        {reporter && <ReporterTaskBody taskProps={taskProps} />}

        <TaskBodyHead
          header={t('taskDetails:attachment')}
          value={attachment}
          onPress={val => setAttachment(val)}
        />
        {attachment && <AttachmentTaskBody data={attachmentMockData} />}

        {taskProps.tasksProps.status !== 'Assigned' && (
          <>
            <TaskBodyHead
              header={t('taskDetails:commentHead')}
              value={addComment}
              onPress={val => setAddComment(val)}
            />
            {addComment && <CommentTaskBody data={commentsMockData} />}
          </>
        )}
      </Stack>
    </>
  );
};
