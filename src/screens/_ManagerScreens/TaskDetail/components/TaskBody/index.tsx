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
import {TasksTaskBody} from 'screens/TaskDetail/components/TaskBody/components/Task';
import {AssigneeTaskBody} from 'screens/_EmployeesScreens/TaskDetail/components/TaskBody/components/Assignee';
import {ReAllocateTaskBody} from 'screens/_EmployeesScreens/TaskDetail/components/TaskBody/components/ReAllocate';

export const TaskBody = (taskProps: TaskInterface | any) => {
  const {t} = useTranslation();

  const [company, setCompany] = useState<boolean>(true);
  const [task, setTask] = useState<boolean>(true);
  const [assignee, setAsignee] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reAllocate, setReAllocate] = useState<boolean>(true);
  const [reporter, setReporter] = useState<boolean>(true);

  // const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        {taskProps.tasksProps.status !== 'Resolved' && (
          <>
            <TaskBodyHead
              header={t('taskDetails:companyName')}
              value={company}
              onPress={val => setCompany(val)}
            />
            {company && <CompanyTaskBody taskProps={taskProps} />}
          </>
        )}

        <TaskBodyHead
          header={t('taskDetails:task')}
          value={task}
          onPress={val => setTask(val)}
        />
        {task && <TasksTaskBody taskProps={taskProps} />}

        {taskProps.tasksProps.status === 'Assigned' && (
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
          header={t('taskDetails:assignee')}
          value={assignee}
          onPress={val => setAsignee(val)}
        />
        {assignee && <AssigneeTaskBody taskProps={taskProps} />}

        {/* {taskProps.tasksProps.status !== 'Assigned' && (
          <>
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
          </>
        )} */}
        {taskProps.tasksProps.status === 'Resolved' && (
          <>
            <TaskBodyHead
              header={t('taskDetails:companyName')}
              value={company}
              onPress={val => setCompany(val)}
            />
            {company && <CompanyTaskBody taskProps={taskProps} />}
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
      </Stack>
    </>
  );
};
