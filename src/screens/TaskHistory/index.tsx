import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {History, TaskHistory, useTaskHistoryMutation} from 'request/ManageTask';
import {Stack} from 'stack-container';
import {TaskHistoryStatus} from './components/Status';
import {taskHistoryModel} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'TaskHistory'>;

export const TaskHistoryScreen = (props: Props) => {
  const {t} = useTranslation();

  const {route} = props;
  const {taskProps} = route.params;

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [pageNo, setPageNo] = useState(1);
  const [currentDataState, setCurrentDataState] = useState<History[]>([]);
  const [formattedData, setFormattedData] = useState<taskHistoryModel[]>([]);
  const [taskUserDetails, setTaskUserDetails] = useState<TaskHistory>();
  const {netStatus} = React.useContext(NetworkContext);
  const [onRefresh, setOnRefresh] = useState(false);

  const [trigger, {data: currentData, isSuccess, isLoading}] =
    useTaskHistoryMutation();
  console.log('=====>', currentData?.data?.record?.history);
  useEffect(() => {
    if (taskProps) {
      let params = {
        taskId: taskProps?._id,
        pageNo: pageNo,
      };
      trigger(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskProps, pageNo]);

  useEffect(() => {
    if (onRefresh && taskProps) {
      let params = {
        taskId: taskProps?._id,
        pageNo: pageNo,
      };
      setCurrentDataState([]);
      trigger(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  useEffect(() => {
    if (currentData?.data?.record?.history?.length) {
      setCurrentDataState(prev =>
        prev.concat(currentData?.data?.record?.history),
      );
      if (pageNo === 1) {
        setTaskUserDetails(currentData);
      }
    }
    setOnRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentData]);

  useEffect(() => {
    if (currentDataState.length) {
      let recordData = [...currentDataState];
      let taskHistoryList: taskHistoryModel[] = [];
      recordData?.map(item => {
        if (taskHistoryList.length) {
          taskHistoryList?.map((ele, eleIndex) => {
            if (ele?.day === item?.formattedStartDate) {
              let dataObj = {time: item?.formattedTime, status: item?.title};
              taskHistoryList[eleIndex]?.data.push(dataObj);
            } else if (
              ele?.day !== item?.formattedStartDate &&
              eleIndex === taskHistoryList.length - 1
            ) {
              let obj = {
                day: item?.formattedStartDate,
                data: [{time: item?.formattedTime, status: item?.title}],
              };
              taskHistoryList.push(obj);
            }
          });
        } else {
          let obj = {
            day: item?.formattedStartDate,
            data: [{time: item?.formattedTime, status: item?.title}],
          };
          taskHistoryList.push(obj);
        }
      });
      setFormattedData(taskHistoryList);
    }
  }, [currentDataState]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('taskDetails:taskHistory')}
        translateY={translateY}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack childrenGap={26}>
        {/* <TaskHistoryCard taskProps={currentData!} /> */}
        <TaskHistoryStatus
          onScrollHandler={scrollHandler}
          taskHistoryData={formattedData}
          currentData={taskUserDetails}
          dataLength={currentData?.data?.record?.history?.length}
          pageNo={() => {
            if (currentData?.data?.pageInfo?.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccess}
          onRefresh={() => {
            if (netStatus) {
              setOnRefresh(true);
              setPageNo(1);
            }
          }}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isLoading && pageNo === 1 && <Loader />}
    </Container>
  );
};
