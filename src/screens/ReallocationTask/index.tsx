import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useReallocatedTaskMutation} from 'request/ManageTask';
import {ReallocationTaskListView} from './components/TaskListView';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ReallocationTask'>;
export const ReallocationTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [
    trigger,

    {
      data: ReallocatedTaskList,
      isSuccess: isSuccessReallocatedList,
      isLoading: isLoadingReallocatedTaskList,
      isUninitialized: isUninitializedReallocatedTaskList,
    },
  ] = useReallocatedTaskMutation();

  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [reallocatedListState, setReallocatedListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setReallocatedListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (ReallocatedTaskList?.data?.nodes?.length) {
      setReallocatedListState(prev =>
        prev.concat(ReallocatedTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [ReallocatedTaskList]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:reallocationRequest')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <ReallocationTaskListView
          data={reallocatedListState}
          onScrollHandler={scrollHandler}
          dataLength={ReallocatedTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingReallocatedTaskList}
          // manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (ReallocatedTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessReallocatedList}
          isUninitialized={isUninitializedReallocatedTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
        />
      </Stack>
      {isLoadingReallocatedTaskList && pageNo === 1 && <Loader />}
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
