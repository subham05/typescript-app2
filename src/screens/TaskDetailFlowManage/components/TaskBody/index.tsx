import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TaskDetails} from 'request/ManageTask';
import {UploadedFileModal} from 'screens/AddTask';
import {ReAllocateTaskBody} from 'screens/_EmployeesScreens/TaskDetail/components/TaskBody/components/ReAllocate';
import {useAppSelector} from 'store/hooks';
// import {attachmentMockData} from './attachmentMockData';
import {commentsMockData} from './commentsMockData';
import {AssigneeTaskBody} from './components/Assignee';
import {AttachmentTaskBody} from './components/Attachment';
import {CommentTaskBody} from './components/Comments';
import {CompanyTaskBody} from './components/Company';
import {TaskBodyHead} from './components/Header';
import {PriorityTaskBody} from './components/Priority';
import {ReporterTaskBody} from './components/Reporter';
import {TaskModel, TasksTaskBody} from './components/Task';
import {VoiceNoteTaskDetails} from './components/VoiceNoteTaskDetails';
// import {Styles} from './index.styles';
interface TaskBodyProps {
  // ref?: any;
  taskProps: TaskDetails | undefined;
  isEditable?: boolean;
  isReallocation?: boolean | undefined;
  isHideButton?: (value: boolean) => void;
  props: any;
  onCompanyChange: (value: string) => void;
  onAssigneeChange: (value: string) => void;
  onReporterChange: (value: string) => void;
  onTaskChange: (values: TaskModel) => void;
  onAttachedFile: (values?: UploadedFileModal[]) => void;
  onRemovedFile: (data?: any[]) => void;
  filesRemoved: (data: any[]) => void;
  onPriorityChange: (value: string) => void;
  onClickComments?: () => void;
  layoutYAxis?: (value: number) => void;
  screenRef?: any;
  deleteLocalPaths: boolean;
  onVoiceRecorded?: (
    value: string,
    bufferData: number[],
    timeMs: number,
  ) => void;
  isDeleted?: (value: boolean) => void;
}
export const TaskBody: React.FC<TaskBodyProps> = ({
  // ref,
  screenRef,
  taskProps,
  isEditable,
  isReallocation,
  isHideButton,
  props,
  onCompanyChange,
  onAssigneeChange,
  onReporterChange,
  onTaskChange,
  onAttachedFile,
  onRemovedFile,
  filesRemoved,
  onPriorityChange,
  onClickComments,
  onVoiceRecorded,
  isDeleted,
  deleteLocalPaths,
  // layoutYAxis,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);

  const [company, setCompany] = useState<boolean>(true);
  const [task, setTask] = useState<boolean>(true);
  const [assignee, setAssignee] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reporter, setReporter] = useState<boolean>(true);
  const [reAllocate, setReAllocate] = useState<boolean>(true);
  const [layoutY, setLayoutY] = useState<number | undefined>();
  const [voiceNote, setVoiceNote] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (addComment && layoutY) {
        // screenRef?.current?.scrollToPosition(0, layoutY, true);
        screenRef?.current?.scrollTo({
          y: layoutY,
          animated: true,
        });
      } else if (!addComment) {
        setLayoutY(0);
      }
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addComment, layoutY]);

  useEffect(() => {
    setAddComment(false);
    if (!isEditable) {
      // screenRef?.current?.scrollToPosition(0, 0, false);
      screenRef?.current?.scrollTo({
        y: 0,
        animated: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable]);
  // const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        {/* <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}> */}
        {!isEditable && (
          <TaskBodyHead
            header={t('taskDetails:company')}
            value={company}
            onPress={val => setCompany(val)}
          />
        )}
        {company && (
          <CompanyTaskBody
            taskProps={taskProps}
            isEditable={isEditable}
            onCompanyChange={onCompanyChange}
          />
        )}

        {!isEditable && (
          <TaskBodyHead
            header={t('taskDetails:task')}
            value={task}
            onPress={val => setTask(val)}
          />
        )}
        {task && (
          <TasksTaskBody
            taskProps={taskProps}
            isEditable={isEditable}
            onTaskChange={onTaskChange}
          />
        )}

        {!isEditable && (
          <TaskBodyHead
            header={t('taskDetails:assignee')}
            value={assignee}
            onPress={val => setAssignee(val)}
          />
        )}
        {assignee && (
          <AssigneeTaskBody
            taskProps={taskProps}
            isEditable={isEditable}
            onAssigneeChange={onAssigneeChange}
          />
        )}

        {taskProps?.taskStatus === 'Assigned' &&
          isReallocation &&
          userData?._id === taskProps?.assignee?._id && (
            <>
              {!isEditable && (
                <TaskBodyHead
                  header={t('taskDetails:reAllocateTo')}
                  value={reAllocate}
                  onPress={val => setReAllocate(val)}
                />
              )}
              {reAllocate && (
                <ReAllocateTaskBody
                  taskProps={taskProps}
                  isEditable={isEditable}
                />
              )}
            </>
          )}

        {!isEditable && (
          <TaskBodyHead
            header={t('taskDetails:reporter')}
            value={reporter}
            onPress={val => setReporter(val)}
          />
        )}
        {reporter && (
          <ReporterTaskBody
            taskProps={taskProps}
            isEditable={isEditable}
            onReporterChange={onReporterChange}
          />
        )}

        {isEditable && (
          <PriorityTaskBody
            taskProps={taskProps!}
            onPress={value => onPriorityChange(value)}
          />
        )}
        {/* {!isEditable ? ( */}
        <TaskBodyHead
          header={t('taskDetails:attachment')}
          value={attachment}
          onPress={val => setAttachment(val)}
        />
        {/* ) : (
          <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.labelHead}>
          {t('taskDetails:attachment')}
          </TextView>
        )} */}
        {attachment && (
          <AttachmentTaskBody
            attachments={taskProps?.attachment}
            isEditable={isEditable}
            props={props}
            onAttachedFile={onAttachedFile}
            onRemovedFile={onRemovedFile}
            filesRemoved={filesRemoved}
            deleteLocalPaths={deleteLocalPaths}
          />
        )}

        <TaskBodyHead
          header={t('taskDetails:voiceNote')}
          value={voiceNote}
          onPress={val => setVoiceNote(val)}
        />

        {voiceNote && (
          <VoiceNoteTaskDetails
            taskProps={taskProps}
            isEditable={isEditable}
            onVoiceRecorded={onVoiceRecorded}
            isDeleted={isDeleted}
          />
        )}

        {taskProps?.taskStatus !== 'Assigned' &&
          userData?._id === taskProps?.assignee?._id && (
            <>
              <TaskBodyHead
                header={t('taskDetails:commentHead')}
                value={addComment}
                onPress={val => {
                  setAddComment(val);
                  onClickComments?.();
                }}
              />
              {addComment && (
                <CommentTaskBody
                  screenRef={screenRef}
                  data={commentsMockData}
                  isHideButton={isHideButton}
                  taskProps={taskProps}
                  props={props}
                  layoutYAxis={setLayoutY}
                />
              )}
            </>
          )}
        {/* </KeyboardAwareScrollView> */}
      </Stack>
    </>
  );
};
