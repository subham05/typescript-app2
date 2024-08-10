import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {attachmentMockData} from 'screens/TaskDetail/components/TaskBody/attachmentMockData';
import {commentsMockData} from 'screens/TaskDetail/components/TaskBody/commentsMockData';
import {AssigneeTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Assignee';
import {AttachmentTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Attachment';
import {CommentTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Comments';
import {TaskBodyHead} from 'screens/TaskDetail/components/TaskBody/components/Header';
import {ReporterTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Reporter';
import {TasksTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Task';
import {Stack} from 'stack-container';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [task, setTask] = useState<boolean>(true);
  const [assignee, setAsignee] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reporter, setReporter] = useState<boolean>(true);

  // const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <TaskBodyHead
          header={t('taskDetails:task')}
          value={task}
          onPress={val => setTask(val)}
        />
        {task && <TasksTaskBody taskProps={taskProps} />}

        <TaskBodyHead
          header={t('taskDetails:assignee')}
          value={assignee}
          onPress={val => setAsignee(val)}
        />
        {assignee && <AssigneeTaskBody taskProps={taskProps} />}

        <TaskBodyHead
          header={t('taskDetails:reporter')}
          value={reporter}
          onPress={val => setReporter(val)}
        />
        {reporter && <ReporterTaskBody taskProps={taskProps} />}

        {taskProps.tasksProps.status !== 'In-progress' && (
          <>
            <TaskBodyHead
              header={t('taskDetails:attachment')}
              value={attachment}
              onPress={val => setAttachment(val)}
            />
            {attachment && <AttachmentTaskBody data={attachmentMockData} />}
          </>
        )}
        {taskProps.tasksProps.status !== 'Assigned' && (
          <Stack>
            <TaskBodyHead
              header={t('taskDetails:commentHead')}
              value={addComment}
              onPress={val => setAddComment(val)}
            />
            {addComment && <CommentTaskBody data={commentsMockData} />}
          </Stack>
        )}
      </Stack>
    </>
  );
};
