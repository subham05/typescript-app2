import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {
  getTaskProgressPercentage,
  getTaskStatusCode,
} from 'common/utils/TaskStatusCode';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {AssigneeImage} from 'components/Persona';
import {Progress} from 'components/Progress';
// import {AssigneeImage} from 'components/Persona';
// import {Progress} from 'components/Progress';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity} from 'react-native';
import {useAppSelector} from 'store/hooks';
// import {AssigneeList} from 'screens/Manage/mockDataAssignee';
// import Overdue from '../../../assets/svgs/Overdue.svg';
import {TaskPriority} from '../TaskPriority';

interface TaskItemProps {
  index: number;
  item: TaskInterface;
  onPress: (item: TaskInterface) => void;
  minimal?: boolean;
  vendors?: boolean;
  inProgress?: boolean;
  manage?: boolean;
  notShowAssignee?: boolean;
  staffTasks?: boolean;
  fromMail?: boolean;
}
type userDetailProp = {_id: string; name: string; profileUrl?: string};
export type TaskInterface = {
  name: string;
  taskName: string;
  date: string;
  time: string;
  status: string;
  self: boolean;
  pinned?: boolean;
  critical?: boolean;

  //New type
  _id: string;
  company: {_id: string; name: string};
  type: string;
  title: string;
  dueDate: string;
  dueTime: string;
  priority: string;
  taskNumber: string;
  pinnedBy: any[];
  users: any[];
  rank: number;
  taskId: string;
  taskProgress: string;
  assigneeName: string;
  assignee: {
    _id: string;
    name: string;
    designation: string;
  };
  companyName: string;
  hasPinned: boolean;
  hasFlagged: boolean;
  taskStatus: string;
  formattedEndDate: string;
  isOverDue?: boolean;
  completedDate?: string;
  completion?: string;
  userDetails: userDetailProp[];
};

export const TaskItem: React.FC<TaskItemProps> = ({
  item,
  onPress,
  minimal,
  vendors,
  inProgress,
  manage,
  notShowAssignee,
  staffTasks,
  fromMail,
}) => {
  const {
    // name,
    // taskName,
    assigneeName,
    // date,
    // time,
    // taskProgress,
    // critical,
    // pinned,
    title,
    type,
    hasPinned,
    hasFlagged,
    company,
    // company,
    // companyName,
    taskNumber,
    // isOverDue,
    // dueDate,
    formattedEndDate,
    dueTime,
    userDetails,
    taskProgress,
  } = {...item};
  const {statusColor} = useAppSelector(state => state?.formanagement);
  // const progressUIValue = 0.5;
  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <StackItem childrenGap={2} style={styles().container}>
        <Stack horizontal horizontalAlign="space-between" style={styles().flex}>
          <StackItem
            horizontal
            // childrenGap={10}
            // horizontalAlign="space-between"
            verticalAlign="center"
            style={styles().flexMargin}>
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              truncate
              // style={{
              //   width: Dimensions.get('screen').width - (hasPinned ? 160 : 140),
              // }}
            >
              {`#${taskNumber}: ${fromMail ? title : type}`}
            </TextView>
            {hasPinned && (
              <Icon
                name="pin_filled"
                color={colors.primary}
                size={18}
                style={styles().pinnedView}
              />
            )}
          </StackItem>
          <StackItem
            horizontal
            verticalAlign="center"
            horizontalAlign="space-between"
            style={{width: 80}}>
            {hasFlagged && (
              <Icon name="outlined_flag" color={colors.red} size={18} />
            )}
            <TaskPriority priority={item.priority} />
          </StackItem>
        </Stack>

        {!minimal && !vendors && (
          <Stack>
            <Stack horizontal horizontalAlign="flex-start">
              {/* {isOverDue && (
                <Stack style={{marginRight: 5}}>
                  <Overdue />
                </Stack>
              )} */}
              {!fromMail && (
                <Stack>
                  {staffTasks && (
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles().text}
                      truncate>
                      {!notShowAssignee ? 'Task name' : title}
                    </TextView>
                  )}
                  {manage && (
                    <TextView
                      weight="regular"
                      variant={FontSizes.regular}
                      style={styles().text}
                      truncate>
                      {title}
                    </TextView>
                  )}
                </Stack>
              )}
            </Stack>
            {!staffTasks && !fromMail && (
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={[
                  styles().text,
                  notShowAssignee ? styles().text1 : undefined,
                ]}
                truncate>
                {company?.name || 'NA'}
              </TextView>
            )}
            {!inProgress && !notShowAssignee && !fromMail && (
              // <Stack spaceBelow={10}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles().text}
                truncate>
                {assigneeName}
              </TextView>
              // </Stack>
            )}
          </Stack>
        )}
        {vendors ? (
          <>
            <Stack horizontal horizontalAlign="space-between">
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles().text}
                truncate>
                {title}
              </TextView>
              <TextView
                weight="regular"
                variant={FontSizes.xSmall}
                style={styles().text}>
                Due date
              </TextView>
            </Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              style={styles().vendorsMargin}>
              <TextView
                weight="regular"
                variant={FontSizes.small}
                style={styles().text}
                truncate>
                {assigneeName}
              </TextView>
              <StackItem childrenGap={3} horizontal>
                <Icon name="calendar" size={18} />
                <TextView weight="regular" variant={FontSizes.xSmall}>
                  Dec 02, 2021
                </TextView>
              </StackItem>
            </Stack>
            {item.status === 'Overdue' && (
              <TextView
                weight="regular"
                variant={FontSizes.xSmall}
                style={styles().delayedText}>
                5 hrs delayed
              </TextView>
            )}
          </>
        ) : (
          <StackItem childrenGap={5}>
            <Stack horizontal horizontalAlign="space-between">
              <TextView
                weight="medium"
                variant={FontSizes.xSmall}
                style={styles().text}>
                Due date & time:
              </TextView>
              {item.status === 'Overdue' && (
                <TextView
                  weight="regular"
                  variant={FontSizes.xSmall}
                  style={styles().text}>
                  5 hrs delayed
                </TextView>
              )}
            </Stack>
            <Stack horizontal horizontalAlign="space-between">
              <StackItem horizontal childrenGap={10}>
                <StackItem childrenGap={5} horizontal>
                  <Icon name="calendar" size={18} color={colors.grey_003} />
                  <TextView weight="regular" variant={FontSizes.small}>
                    {formattedEndDate || 'NA'}
                    {/* {moment(dueDate).format('ll')} */}
                  </TextView>
                </StackItem>
                <StackItem childrenGap={5} horizontal verticalAlign="center">
                  <Icon name="time" size={18} color={colors.grey_003} />
                  <TextView weight="regular" variant={FontSizes.small}>
                    {/* {moment(dueTime, 'HH:mm').format('hh:mm a')} */}
                    {dueTime || 'NA'}
                  </TextView>
                </StackItem>
              </StackItem>
              {!notShowAssignee && !fromMail && (
                <AssigneeImage data={userDetails} />
              )}
            </Stack>
          </StackItem>
        )}
        <Stack style={notShowAssignee ? styles().progress : undefined}>
          <Progress
            progress={getTaskProgressPercentage(taskProgress)}
            color={getTaskStatusCode(item.taskStatus, statusColor)}
          />
        </Stack>
      </StackItem>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 20,
      borderRadius: 3,
      backgroundColor: colors.white,
      paddingBottom: 10,
    },
    emergency: {
      height: 25,
      borderWidth: 1,
      padding: 4,
      paddingHorizontal: 10,
      backgroundColor: colors.grey_010,
      borderColor: colors.grey_010,
      fontFamily: AppFonts.medium,
      fontSize: FontSizes.xSmall,
      color: colors.emergencyText,
    },
    text: {
      color: colors.grey_003,
    },
    delayedText: {
      color: colors.grey_003,
      textAlign: 'right',
    },
    bottom: {
      marginBottom: 15,
    },
    flexMargin: {
      flex: 1,
      width: Dimensions.get('screen').width - 60,
      // marginRight: 10,
    },
    flex: {
      flex: 1,
    },
    vendorsMargin: {marginBottom: 10},
    text1: {paddingBottom: 8},
    progress: {paddingVertical: 10, marginBottom: 10},
    pinnedView: {width: 20, marginLeft: 5},
  });
  return mergeStyles;
};
