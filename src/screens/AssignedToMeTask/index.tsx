import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  // Animated,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useAssignedToMeTaskMutation} from 'request/ManageTask';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AssignedToMeTask'>;
export const AssignedToMeTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    trigger,

    {
      data: AssignedToMeTaskList,
      isSuccess: isSuccessAssignedToMeList,
      isLoading: isLoadingAssignedToMeTaskList,
      isUninitialized: isUninitializedAssignedToMeTaskList,
    },
  ] = useAssignedToMeTaskMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [assignedToMeTaskListState, setAssignedToMeTaskListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setAssignedToMeTaskListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (AssignedToMeTaskList?.data?.nodes?.length) {
      setAssignedToMeTaskListState(prev =>
        prev.concat(AssignedToMeTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [AssignedToMeTaskList]);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:assignedToMe')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={assignedToMeTaskListState}
          onScrollHandler={scrollHandler}
          dataLength={AssignedToMeTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingAssignedToMeTaskList}
          manage
          onPress={value => {
            props.navigation.navigate('TaskDetails', {
              taskId: value,
              hideButtons:
                value.taskStatus === 'AwaitingApproval' ? true : false,
            });
          }}
          pageNo={() => {
            if (AssignedToMeTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessAssignedToMeList}
          isUninitialized={isUninitializedAssignedToMeTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isLoadingAssignedToMeTaskList && pageNo === 1 && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    companyName: {
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
