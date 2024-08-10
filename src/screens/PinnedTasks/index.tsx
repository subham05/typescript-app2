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
import {usePinnedTaskMutation} from 'request/ManageTask';
// import {pinnedTaskData} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'PinnedTask'>;
export const PinnedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [
    trigger,

    {
      data: pinnedTaskList,
      isSuccess: isSuccessPinnedList,
      isLoading: isLoadingPinnedTaskList,
      isUninitialized: isUninitializedPinnedTaskList,
    },
  ] = usePinnedTaskMutation();

  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [pinnedListState, setPinnedListState] = useState<TaskInterface[]>([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setPinnedListState([]);
      console.log('calling lazy');
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (pinnedTaskList?.data?.nodes?.length) {
      setPinnedListState(prev => prev.concat(pinnedTaskList?.data?.nodes));
    }
    setOnRefresh(false);
  }, [pinnedTaskList]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:pinned')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={pinnedListState}
          onScrollHandler={scrollHandler}
          dataLength={pinnedTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingPinnedTaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (pinnedTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessPinnedList}
          isUninitialized={isUninitializedPinnedTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isLoadingPinnedTaskList && pageNo === 1 && <Loader />}
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
