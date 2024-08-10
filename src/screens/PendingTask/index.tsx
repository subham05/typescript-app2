import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
// import {FontSizes} from 'common/theme/font';
import {
  Container,
  // , TextView
} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  // , TouchableOpacity
} from 'react-native';
import {
  // Animated,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {usePendingApprovalMutation} from 'request/ManageTask';
// import {resolvedTaskData} from 'screens/Home/mockData';
// import {pendingTaskData} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList>;

export const PendingTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const [
    trigger,

    {
      data: pendingApprovalList,
      isSuccess: isSuccessPendingApprovalList,
      isLoading: isLoadingPendingApprovalList,
      isUninitialized: isUninitializedPendingApprovalList,
    },
  ] = usePendingApprovalMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);

  const [pendingApprovalListState, setPendingApprovalListState] = useState<
    TaskInterface[]
  >([]);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (onRefresh) {
      setPendingApprovalListState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, onRefresh]);

  useEffect(() => {
    if (pendingApprovalList?.data?.nodes?.length) {
      setPendingApprovalListState(prev =>
        prev.concat(pendingApprovalList?.data?.nodes),
      );
    }
    setOnRefresh(false);
  }, [pendingApprovalList]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const [taskType, setTaskType] = useState<string>('Task');

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:pendingApprovals')}
        translateY={translateY}
      />
      {/* <Stack
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
            weight="medium"
            variant={FontSizes.medium}
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
            weight="medium"
            variant={FontSizes.medium}
            style={styles().contactText}>
            {t('homePage:subTask')}
          </TextView>
        </TouchableOpacity>
      </Stack> */}
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={pendingApprovalListState}
          onScrollHandler={scrollHandler}
          dataLength={pendingApprovalList?.data?.nodes?.length}
          isLoading={pageNo > 1 && isLoadingPendingApprovalList}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (pendingApprovalList?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessPendingApprovalList}
          isUninitialized={isUninitializedPendingApprovalList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isLoadingPendingApprovalList && pageNo === 1 && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
    contactView: {
      marginLeft: 16,
      marginTop: 5,
      marginBottom: 16,
    },
    contactSelected: {
      marginRight: 20,
      borderBottomWidth: 4,
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
