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
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useAssignedByPATaskMutation} from 'request/ManageTask';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AssignedByPATask'>;
export const AssignedByPATaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [
    trigger,

    {
      data: assignedByPATaskList,
      isSuccess: isSuccessAssignedByPAList,
      isLoading: isLoadingAssignedByPATaskList,
      isUninitialized: isUninitializedAssignedByPATaskList,
    },
  ] = useAssignedByPATaskMutation();

  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [assignedByPAListState, setAssignedByPAListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setAssignedByPAListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (assignedByPATaskList?.data?.nodes?.length) {
      setAssignedByPAListState(prev =>
        prev.concat(assignedByPATaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [assignedByPATaskList]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:assignByPA')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={assignedByPAListState}
          onScrollHandler={scrollHandler}
          dataLength={assignedByPATaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingAssignedByPATaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (assignedByPATaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessAssignedByPAList}
          isUninitialized={isUninitializedAssignedByPATaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isLoadingAssignedByPATaskList && pageNo === 1 && <Loader />}
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
