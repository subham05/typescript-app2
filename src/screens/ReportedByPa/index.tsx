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
import {useReportedByPaTaskMutation} from 'request/ManageTask';

type Props = NativeStackScreenProps<SignedInStackParamList, 'reportedByPa'>;
export const ReportedByPaTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    trigger,

    {
      data: reportedByPaTaskList,
      isSuccess: isSuccessReportedByPaList,
      isLoading: isLoadingReportedByPaTaskList,
      isUninitialized: isUninitializedReportedByPaTaskList,
    },
  ] = useReportedByPaTaskMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [reportedByPaTaskListState, setReportedByPaTaskListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setReportedByPaTaskListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (reportedByPaTaskList?.data?.nodes?.length) {
      setReportedByPaTaskListState(prev =>
        prev.concat(reportedByPaTaskList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [reportedByPaTaskList]);

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:reportedByPa')}
        translateY={translateY}
      />
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={reportedByPaTaskListState}
          onScrollHandler={scrollHandler}
          dataLength={reportedByPaTaskList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingReportedByPaTaskList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (reportedByPaTaskList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessReportedByPaList}
          isUninitialized={isUninitializedReportedByPaTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isLoadingReportedByPaTaskList && pageNo === 1 && <Loader />}
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
