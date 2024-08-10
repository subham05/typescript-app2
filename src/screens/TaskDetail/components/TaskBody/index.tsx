import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
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
import {Styles} from './index.styles';
import {RelatedTaskBody} from './components/RelatedTask';
import {TaskDataModel} from 'components/TaskLists/TaskItem';
import {ReAssigneeTaskBody} from './components/ReAssignee';
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
  recordingVoiceNote?: (value: boolean) => void;
  linkedSubTask?: boolean;
  onRelatedTaskChange: (value: TaskDataModel) => void;
  onReAssigneeChange: (value: string | undefined) => void;
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
  recordingVoiceNote,
  // layoutYAxis,
  linkedSubTask,
  onRelatedTaskChange,
  onReAssigneeChange,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);

  const [company, setCompany] = useState<boolean>(true);
  const [task, setTask] = useState<boolean>(true);
  const [assignee, setAssignee] = useState<boolean>(true);
  const [reAssignee, setReAssignee] = useState<boolean>(true);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [attachment, setAttachment] = useState<boolean>(false);
  const [reporter, setReporter] = useState<boolean>(true);
  const [relatedTask, setRelatedTask] = useState<boolean>(true);
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
    } else {
      setCompany(true);
      setTask(true);
      setAssignee(true);
      setReporter(true);
      setReAllocate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditable]);
  const styles = Styles();
  return (
    <>
      <Stack spacing={16} spaceBelow={16}>
        {/* <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}> */}
        {(taskProps?.taskStatus === 'Rejected' ||
          taskProps?.taskStatus === 'Reopened') &&
          (userData?._id === taskProps?.addedBy ||
            userData?._id === taskProps?.assignee?._id ||
            userData?._id === taskProps?.reassignTo?._id) && (
            <>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.optionNoteLabel}>
                {t('taskDetails:note')}
              </TextView>
              <Stack style={styles.openBox}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.optionLabel}>
                  {taskProps?.taskStatus === 'Rejected'
                    ? t('taskDetails:reasonForRejection')
                    : t('taskDetails:reasonForDisapprove')}
                </TextView>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.value}>
                  {taskProps?.taskStatus === 'Rejected'
                    ? taskProps?.rejectionReason
                    : taskProps?.reopenReason}
                </TextView>
              </Stack>
              {isEditable && <View style={styles.marginNote} />}
            </>
          )}
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
            isEditable={linkedSubTask ? false : isEditable}
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

        {((taskProps?.canReassigned && !isEditable) ||
          (taskProps?.isReassigned && taskProps?.canReassigned) ||
          (taskProps?.isReassigned &&
            !taskProps?.canReassigned &&
            taskProps?.reassignTo)) && (
          <TaskBodyHead
            header={t('taskDetails:ReAssignee')}
            value={reAssignee}
            onPress={val => setReAssignee(val)}
          />
        )}
        {(taskProps?.canReassigned || taskProps?.isReassigned) &&
          reAssignee && (
            <ReAssigneeTaskBody
              taskProps={taskProps}
              isEditable={taskProps?.canReassigned}
              onReAssigneeChange={onReAssigneeChange}
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

        {!isEditable && taskProps?.relatedTaskName?.title && (
          <TaskBodyHead
            header={t('addTask:relatedTask')}
            value={relatedTask}
            onPress={val => setRelatedTask(val)}
          />
        )}
        {relatedTask && (
          <RelatedTaskBody
            taskProps={taskProps}
            isEditable={isEditable}
            onRelatedTaskChange={onRelatedTaskChange}
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
        {attachment && (
          <AttachmentTaskBody
            attachments={taskProps?.attachment}
            isEditable={isEditable}
            props={props}
            onAttachedFile={onAttachedFile}
            onRemovedFile={onRemovedFile}
            filesRemoved={filesRemoved}
            deleteLocalPaths={deleteLocalPaths}
            taskProps={taskProps}
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
            isEditable={
              isEditable && taskProps?.taskStatus === 'Assigned' ? true : false
            }
            onVoiceRecorded={onVoiceRecorded}
            isDeleted={isDeleted}
            recordingVoiceNote={recordingVoiceNote}
          />
        )}
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
        {/* </KeyboardAwareScrollView> */}
      </Stack>
    </>
  );
};
