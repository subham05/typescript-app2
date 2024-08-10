import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Modal from 'react-native-modal';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {TaskBody} from './components/TaskBody';
import {TaskFooter} from './components/TaskFooter';
import {TaskHead} from './components/TaskHead';
import {Styles} from './index.styles';
import {Divider} from 'components/Divider';

export type TaskDetailsProps = NativeStackScreenProps<
  SignedInStackParamList,
  'TaskDetails'
>;

export const TaskDetailScreen = (props: TaskDetailsProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {taskProps, vendors, pending, hideButtons, reallocation} = {
    ...route.params,
  };

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const [markAsCompletedModal, setMarkAsCompletedModal] =
    useState<boolean>(false);

  const [isKeyboardOpen, setIsKeyboardOpen] = useState<boolean>(false);

  const renderLeftContainer = () => {
    return (
      <>
        {!vendors &&
          taskProps?.self &&
          !reallocation &&
          (taskProps?.status === 'In-progress' ||
            taskProps?.self ||
            taskProps?.name !== 'Subtask') && (
            <Menu>
              <MenuTrigger>
                <Icon name="more" size={24} color={colors.black} />
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.menuContainer}>
                <MenuOption
                  onSelect={() => {
                    props.navigation.navigate('LinkedTask');
                  }}>
                  <Stack horizontal>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles.linkedSubtask}>
                      {t('manageTask:viewLinkedTask')}
                    </TextView>
                  </Stack>
                </MenuOption>
                <Stack spacing={16}>
                  <Divider size={2} />
                </Stack>
                <MenuOption
                  onSelect={() => {
                    props.navigation.navigate('RelatedTask');
                  }}>
                  <Stack horizontal>
                    <TextView
                      weight="medium"
                      variant={FontSizes.regular}
                      style={styles.linkedSubtask}>
                      {t('inboxPage:related')}
                    </TextView>
                  </Stack>
                </MenuOption>
              </MenuOptions>
            </Menu>
          )}
      </>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={
          isEditable ? t('taskDetails:editTaskDetails') : t('taskDetails:head')
        }
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        isCloseNavigation
      />
      <KeyboardAwareScrollView
        bounces={false}
        overScrollMode={'never'}
        onKeyboardWillShow={() => setIsKeyboardOpen(true)}
        onKeyboardWillHide={() => setIsKeyboardOpen(false)}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}>
          {!isKeyboardOpen && (
            <TaskHead
              taskProps={taskProps}
              vendors={vendors}
              onPress={val => {
                setIsEditable(val);
              }}
              isEditable={isEditable}
              hideButtons={hideButtons}
              isReallocation={reallocation}
              props={props}
            />
          )}
          <TaskBody
            tasksProps={taskProps}
            isEditable={isEditable}
            isreallocation={reallocation}
            // isSelf={taskProps?.self}
          />
        </Animated.ScrollView>
        {!isKeyboardOpen && isEditable && !hideButtons && (
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('saveChanges')}
              onPress={() => {
                setIsEditable(false);
              }}
            />
          </Stack>
        )}
      </KeyboardAwareScrollView>
      {taskProps?.status === 'Assigned' &&
        !taskProps?.self &&
        !isEditable &&
        !vendors &&
        !hideButtons &&
        reallocation && <TaskFooter status={taskProps?.status} />}
      {taskProps?.status === 'Resolved' &&
        !taskProps?.self &&
        !isEditable &&
        // pending &&
        !vendors &&
        !hideButtons && <TaskFooter status={taskProps?.status} />}
      {taskProps?.self &&
        !pending &&
        !isEditable &&
        !vendors &&
        !hideButtons && (
          <Stack spacing={16} spaceBelow={16}>
            {taskProps?.status !== 'Assigned' && !taskProps?.self && (
              <PrimaryButton
                disabled={taskProps?.status === 'Resolved' ? false : true}
                title={t('taskDetails:markAsCompleted')}
                onPress={() => {
                  setMarkAsCompletedModal(true);
                }}
              />
            )}
          </Stack>
        )}
      {taskProps?.self &&
        !pending &&
        !isEditable &&
        !vendors &&
        !hideButtons && (
          <Stack spacing={16} spaceBelow={16}>
            {taskProps?.status !== 'Completed' && !taskProps?.self && (
              <PrimaryButton
                disabled={taskProps?.status === 'Resolved' ? false : true}
                title={t('taskDetails:markAsCompleted')}
                onPress={() => {
                  setMarkAsCompletedModal(true);
                }}
              />
            )}
          </Stack>
        )}
      {markAsCompletedModal && (
        <Modal isVisible={markAsCompletedModal}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('taskDetails:alertMarkAsCompleted')}
              </TextView>
              <Stack horizontal style={styles.modal}>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => setMarkAsCompletedModal(false)}>
                  {t('cancel')}
                </TextView>
                <TextView
                  weight="bold"
                  variant={FontSizes.regular}
                  style={styles.reopenModal}
                  onPress={() => {
                    setMarkAsCompletedModal(false);
                  }}>
                  {t('yes')}
                </TextView>
              </Stack>
            </View>
          </View>
        </Modal>
      )}
    </Container>
  );
};
