import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useLazyGetSubTaskListQuery} from 'request/AddTask';

type Props = NativeStackScreenProps<SignedInStackParamList, 'LinkedTask'>;
export const LinkedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const {route} = props;
  const {taskProps, deleted_Id, parentId} = route?.params;
  const translateY = useSharedValue(0);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [subTaskList, setSubTaskList] = useState<[]>([]);
  const lastPageNumber = useRef<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);
  const {netStatus} = React.useContext(NetworkContext);

  const [
    getSubTaskList,
    {
      data: subTaskListData,
      isSuccess: subTaskListSuccess,
      isFetching: isFetchingSubtask,
    },
  ] = useLazyGetSubTaskListQuery();

  const bodyObj = useMemo(() => {
    return {
      parentTaskId: taskProps?.taskId || parentId,
      pageNo: pageNumber,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskProps?.taskId, pageNumber, parentId, deleted_Id]);

  useEffect(() => {
    getSubTaskList(bodyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj]);

  useEffect(() => {
    if (onRefresh) {
      getSubTaskList(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh, bodyObj]);

  useEffect(() => {
    if (subTaskListData && subTaskListSuccess) {
      const {nodes, pageInfo} = subTaskListData?.data;
      const subTaskTemp = pageNumber === 1 ? nodes : subTaskList.concat(nodes);
      setSubTaskList(subTaskTemp);
      lastPageNumber.current = pageInfo?.lastPageNo;
      setOnRefresh(false);
      // pageNumber === 1;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTaskListData]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:linkedTask')}
        translateY={translateY}
      />
      {/* <ScrollView> */}
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={subTaskList}
          onScrollHandler={scrollHandler}
          dataLength={subTaskListData?.nodes?.length}
          manage
          onPress={value =>
            props.navigation.push('TaskDetails', {
              taskProps: value,
              linkedSubTask: true,
              parentId: taskProps?.taskNumber,
              parentTaskId: parentId,
            })
          }
          pageNo={() => {
            if (subTaskListData?.data?.pageInfo?.hasNextPage) {
              setPageNumber(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            if (netStatus) {
              setOnRefresh(true);
              setPageNumber(1);
            }
          }}
          isSuccess={subTaskListSuccess}
          isLoading={isFetchingSubtask}
          pageNumber={pageNumber}
        />
      </Stack>
      {/* </ScrollView> */}
      {isFetchingSubtask && pageNumber === 1 && <Loader />}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      // paddingBottom: Dimensions.get('screen').height / 4,
      // marginBottom: 150,
    },
    companyName: {
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
