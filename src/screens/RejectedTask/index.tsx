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
import {useRejectedTaskListMutation} from 'request/ManageTask';
// import {selfAssignedTaskData} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'RejectedTask'>;
export const RejectedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    trigger,

    {
      data: rejectedTaskList,
      isSuccess: isSuccessRejectedTaskList,
      isLoading: isLoadingRejectedTaskList,
      isUninitialized: isUninitializedRejectedTaskList,
    },
  ] = useRejectedTaskListMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [rejectedTaskListState, setRejectedTaskListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setRejectedTaskListState([]);
      console.log('calling lazy');
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (rejectedTaskList?.data?.nodes?.length) {
      setRejectedTaskListState(prev =>
        prev.concat(rejectedTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [rejectedTaskList]);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:rejectedTask')}
        translateY={translateY}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={rejectedTaskListState}
          onScrollHandler={scrollHandler}
          dataLength={rejectedTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingRejectedTaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (rejectedTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessRejectedTaskList}
          isUninitialized={isUninitializedRejectedTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isLoadingRejectedTaskList && pageNo === 1 && <Loader />}
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
