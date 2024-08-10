import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {resolvedTaskData} from 'screens/Home/mockData';
import {pendingTaskData} from 'screens/PendingTask/mockData';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'ReportedByMe'
>;
export const ManagerPendingTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [taskType, setTaskType] = useState<string>('Task');

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:pendingApprovals')}
        translateY={translateY}
        // RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles().contactView}>
        <TouchableOpacity
          style={
            taskType === 'Task'
              ? styles().contactSelected
              : styles().contactNotSelected
          }
          onPress={() => {
            setTaskType('Task');
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles().contactText}>
            {t('homePage:task')}
          </TextView>
        </TouchableOpacity>
        <TouchableOpacity
          style={
            taskType === 'Subtask'
              ? styles().contactSelected
              : styles().contactNotSelected
          }
          onPress={() => {
            setTaskType('Subtask');
          }}>
          <TextView
            weight="bold"
            variant={FontSizes.regular}
            style={styles().contactText}>
            {t('homePage:subTask')}
          </TextView>
        </TouchableOpacity>
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <TaskListView
            data={taskType === 'Subtask' ? pendingTaskData : resolvedTaskData}
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
              })
            }
          />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    pendingTask: {
      textAlign: 'center',
      color: colors.black,
      padding: 6,
      paddingHorizontal: 10,
    },
    contactView: {
      marginLeft: 16,
      marginTop: 10,
      marginBottom: 16,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 3,
      borderBottomColor: colors.primary,
      width: '45%',
      paddingBottom: 10,
    },
    contactNotSelected: {
      marginRight: 20,
      width: '45%',
      paddingBottom: 10,
    },
    contactText: {
      textAlign: 'center',
    },
  });
  return mergeStyles;
};
