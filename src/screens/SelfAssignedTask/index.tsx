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
import {useSelfAssignedTaskMutation} from 'request/ManageTask';
// import {selfAssignedTaskData} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'SelfAssignedTask'>;
export const SelfAssignedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    trigger,

    {
      data: selfAssignedTaskList,
      isSuccess: isSuccessSelfAssignedList,
      isLoading: isLoadingSelfAssignedTaskList,
      isUninitialized: isUninitializedSelfAssignedTaskList,
    },
  ] = useSelfAssignedTaskMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [selfTaskListState, setSelfTaskListState] = useState<TaskInterface[]>(
    [],
  );

  console.log('the data self assigned-->', selfAssignedTaskList?.data?.nodes);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setSelfTaskListState([]);
      console.log('calling lazy');
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (selfAssignedTaskList?.data?.nodes?.length) {
      setSelfTaskListState(prev =>
        prev.concat(selfAssignedTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [selfAssignedTaskList]);

  useEffect(() => {}, [selfTaskListState]);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:selfAssignedTask')}
        translateY={translateY}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={selfTaskListState}
          onScrollHandler={scrollHandler}
          dataLength={selfAssignedTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingSelfAssignedTaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (selfAssignedTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessSelfAssignedList}
          isUninitialized={isUninitializedSelfAssignedTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isLoadingSelfAssignedTaskList && pageNo === 1 && <Loader />}
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
