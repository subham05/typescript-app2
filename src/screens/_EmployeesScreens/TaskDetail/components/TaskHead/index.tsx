import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {Icon} from 'components/Icon';
import {RippleIconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskPriority} from 'components/Task/TaskPriority';
import {TaskStatus} from 'components/Task/TaskStatus';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {Styles} from './index.styles';

interface TaskHeadProps {
  taskProps: TaskInterface | any;
  isEditable?: boolean;
  onPress?: (val: boolean) => void;
  vendors?: boolean;
  hideButtons?: boolean;
  props?: any;
}
export const TaskHead: React.FC<TaskHeadProps> = ({
  taskProps,
  isEditable,
  vendors,
  onPress,
  hideButtons,
  props,
}) => {
  const {t} = useTranslation();

  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [resolveModal, setResolveModal] = useState<boolean>(false);
  const [startModal, setStartModal] = useState<boolean>(false);

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
        {taskProps.status === 'Assigned' &&
          !isEditable &&
          !vendors &&
          !hideButtons && (
            <StackItem horizontal childrenGap={10}>
              <RippleIconButton
                name="edit"
                onPress={() => {
                  onPress!(!isEditable);
                }}
                size={22}
                color={colors.black}
              />
              <RippleIconButton
                name="delete"
                onPress={() => {
                  setDeleteModal(true);
                }}
                size={22}
                color={colors.black}
              />
              {/* <Ripple
              onPress={() => {
                onPress!(!isEditable);
              }}>
              <Icon name="edit" size={22} color={colors.black} />
            </Ripple>
            <Ripple
              onPress={() => {
                setDeleteModal(true);
              }}>
              <Icon name="delete" size={22} color={colors.black} />
            </Ripple> */}
            </StackItem>
          )}
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
                {t('taskDetails:dueDate')}:
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
                {t('taskDetails:dueTime')}:
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
              {t('taskDetails:status')}:
            </TextView>
            <TaskStatus status={taskProps.status} />
          </StackItem>
          <StackItem childrenGap={10} horizontal style={{}}>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.smallLabel}>
              {t('taskDetails:priority')}:
            </TextView>
            <Stack style={styles.priority}>
              <TaskPriority priority={taskProps.priority} outlined={true} />
            </Stack>
          </StackItem>
        </StackItem>
      </Stack>
      {(taskProps.status === 'In-progress' || taskProps.status === 'Overdue') &&
        !vendors &&
        !isEditable &&
        !hideButtons && (
          <Stack spacing={16} spaceBelow={16} style={styles.button}>
            <PrimaryButton
              title={t('taskDetails:resolve')}
              onPress={() => {
                setResolveModal(true);
              }}
              height={38}
            />
          </Stack>
        )}
      {taskProps.status === 'Reopened' &&
        !vendors &&
        !isEditable &&
        !hideButtons && (
          <Stack spacing={16} spaceBelow={16} style={styles.button}>
            <PrimaryButton
              title={t('taskDetails:start')}
              onPress={() => {
                setStartModal(true);
              }}
              height={38}
            />
          </Stack>
        )}
      {taskProps.status === 'Assigned' &&
        !vendors &&
        !isEditable &&
        !hideButtons && (
          <StackItem
            spacing={16}
            horizontal
            style={styles.groupButton}
            childrenGap={10}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('ReallocateTo');
              }}
              style={styles.addMoreButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.addMore}>
                {t('taskDetails:reAllocate')}
              </TextView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setStartModal(true);
              }}
              style={styles.saveButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.save}>
                {t('taskDetails:start')}
              </TextView>
            </TouchableOpacity>
          </StackItem>
        )}
      {taskProps?.status === 'Resolved' &&
        !vendors &&
        !hideButtons &&
        taskProps.self &&
        taskProps?.name !== 'Subtask' && (
          <Stack spacing={16} style={styles.button}>
            <PrimaryButton
              title={t('taskDetails:resolved')}
              onPress={() => {}}
              height={38}
            />
          </Stack>
        )}
      {deleteModal && (
        <Modal isVisible={deleteModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertDelete')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setDeleteModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setDeleteModal(false);
                  }}>
                  {t('delete')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {resolveModal && (
        <Modal isVisible={resolveModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertResolve')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setResolveModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setResolveModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
      {startModal && (
        <Modal isVisible={startModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertStart')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setStartModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setStartModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};
