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
import {useReportedByMeTaskMutation} from 'request/ManageTask';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ReportedByMeTask'>;
export const ReportedByMeTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    trigger,

    {
      data: reportedByMeTaskList,
      isSuccess: isSuccessReportedByMeList,
      isLoading: isLoadingReportedByMeTaskList,
      isUninitialized: isUninitializedReportedByMeTaskList,
    },
  ] = useReportedByMeTaskMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [reportedByMeTaskListState, setReportedByMeTaskListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setReportedByMeTaskListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (reportedByMeTaskList?.data?.nodes?.length) {
      setReportedByMeTaskListState(prev =>
        prev.concat(reportedByMeTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [reportedByMeTaskList]);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:reportedByMe')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={reportedByMeTaskListState}
          onScrollHandler={scrollHandler}
          dataLength={reportedByMeTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingReportedByMeTaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (reportedByMeTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessReportedByMeList}
          isUninitialized={isUninitializedReportedByMeTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isLoadingReportedByMeTaskList && pageNo === 1 && <Loader />}
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
