import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {ReAllocateTaskBody} from 'screens/_EmployeesScreens/TaskDetail/components/TaskBody/components/ReAllocate';
import {attachmentMockData} from './attachmentMockData';
import {commentsMockData} from './commentsMockData';
import {AssigneeTaskBody} from './components/Assignee';
import {AttachmentTaskBody} from './components/Attachment';
import {CommentTaskBody} from './components/Comments';
import {CompanyTaskBody} from './components/Company';
import {TaskBodyHead} from './components/Header';
import {ReporterTaskBody} from './components/Reporter';
import {TasksTaskBody} from './components/Task';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [company, setCompany] = useState<boolean>(true);
  const [task, setTask] = useState<boolean>(true);
  const [assignee, setAsignee] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reporter, setReporter] = useState<boolean>(true);
  const [reAllocate, setReAllocate] = useState<boolean>(true);

  // const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
          <TaskBodyHead
            header={t('taskDetails:company')}
            value={company}
            onPress={val => setCompany(val)}
          />
          {company && <CompanyTaskBody taskProps={taskProps} />}

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

          {taskProps.tasksProps.status === 'Assigned' &&
            taskProps.isreallocation && (
              <>
                <TaskBodyHead
                  header={t('taskDetails:reAllocateTo')}
                  value={reAllocate}
                  onPress={val => setReAllocate(val)}
                />
                {reAllocate && <ReAllocateTaskBody taskProps={taskProps} />}
              </>
            )}

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
        </KeyboardAwareScrollView>
      </Stack>
    </>
  );
};
