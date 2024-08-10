import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  InprogressTask,
  useInProgressDashboardMutation,
} from 'request/Dashboard';
import {useAppSelector} from 'store/hooks';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const InprogressTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const {companyId} = useAppSelector(state => state?.formanagement);

  const [inprogressTask, setInprogressTask] = useState<
    InprogressTask[] | undefined
  >([]);
  const [inprogressTaskPageNo, setInprogressTaskPageNo] = useState<number>(1);

  const [onRefresh, setOnRefresh] = useState(false);

  const [
    getInprogressTask,
    {
      data: inprogressTaskData,
      isLoading: isLoadingInprogressTask,
      isError: isErrorInprogressTask,
      isSuccess: isSuccessInprogressTask,
      error: inprogressTaskError,
    },
  ] = useInProgressDashboardMutation();

  const InprogressTaskRequestObj = useMemo(() => {
    return {
      companyId: companyId.map(ids => ids._id),
      pageNo: inprogressTaskPageNo,
    };
  }, [companyId, inprogressTaskPageNo]);

  useFocusEffect(
    useCallback(() => {
      getInprogressTask(InprogressTaskRequestObj);
    }, [getInprogressTask, InprogressTaskRequestObj]),
  );

  useEffect(() => {
    if (onRefresh) {
      setInprogressTask([]);
      getInprogressTask(InprogressTaskRequestObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [InprogressTaskRequestObj, onRefresh]);

  useEffect(() => {
    if (isSuccessInprogressTask && inprogressTaskData) {
      setInprogressTask(prev => prev?.concat(inprogressTaskData.data.nodes));
    } else if (isErrorInprogressTask) {
    }
  }, [
    isErrorInprogressTask,
    isSuccessInprogressTask,
    inprogressTaskData,
    inprogressTaskError,
  ]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('homePage:inProgressTasks')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={inprogressTask}
          onScrollHandler={scrollHandler}
          dataLength={inprogressTask?.length}
          isLoading={inprogressTaskPageNo > 1 && isLoadingInprogressTask}
          inProgress
          onPress={value => {
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            });
          }}
          pageNo={() => {
            if (inprogressTaskData?.data.pageInfo.hasNextPage) {
              setInprogressTaskPageNo(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            setOnRefresh(true);
            setInprogressTaskPageNo(1);
          }}
          pageNumber={inprogressTaskPageNo}
        />
      </Stack>
      {isLoadingInprogressTask && inprogressTaskPageNo === 1 && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  });
  return mergeStyles;
};
