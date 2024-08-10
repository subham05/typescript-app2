import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  useGetTaskGraphMutation,
  useTaskReportListMutation,
} from 'request/TaskReport';
import {graphData} from 'request/TaskReport/types';
import {pageInfo} from 'screens/Contacts';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {TaskReportBottomPanelModal} from './components/BottomPanelModal';
import {ChartTaskReportScreen} from './components/Chart';
import Loader from 'components/Loader';
import {getFilterName} from 'screens/AttendanceSummery/utils';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'TaskReport'>;
export const TaskReportScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [countFilter, setCountFilter] = useState<number>(3);

  const [isPanelActive, setIsPanelActive] = useState(false);

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );

  const [selectedPriority, setSelectedPriority] = useState<
    masterCollectionType[]
  >([{id: 1, name: 'ALL', value: 'ALL'}]);
  const [selectedStaff, setSelectedStaff] = useState<masterCollectionType[]>([
    {id: 1, name: 'ALL', value: 'ALL'},
  ]);
  const [selectedSortby, setSelectedSortby] = useState<masterCollectionType[]>(
    [],
  );

  const [getGraphData, {data, isSuccess, isLoading}] =
    useGetTaskGraphMutation();
  const [
    taskReportList,
    {data: taskListData, isSuccess: taskListSuccess, isLoading: listLoader},
  ] = useTaskReportListMutation();
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const isFocused = useIsFocused();

  const [chartData, setChartData] = useState<graphData[]>([]);
  const [chartColor, setChartColor] = useState<string[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [taskList, setTaskList] = useState<TaskInterface[]>([]);
  const [staffArray, setStaffArray] = useState<masterCollectionType[]>([]);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const renderLeftContainer = () => {
    return <FilterIcon count={countFilter} onPress={() => openPanel()} />;
  };

  useEffect(() => {
    setChartData([]);
    setChartColor([]);
    setTaskList([]);
    setPages(undefined);
    setPageNumber(1);
  }, [selectedCompanies, selectedPriority, selectedSortby, selectedStaff]);

  useEffect(() => {
    if (isFocused && companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isFocused]);

  const graphBody = useMemo(() => {
    return {
      companyId: [...selectedCompanies],
      priority: selectedPriority[0]?.name ?? 'ALL',
      sortBy: selectedSortby[0]?.value ?? 'ALL',
      staff: selectedStaff[0]?.value ?? 'ALL',
    };
  }, [selectedCompanies, selectedPriority, selectedSortby, selectedStaff]);

  const listBody = useMemo(() => {
    return {
      companyId: [...selectedCompanies],
      priority: selectedPriority[0]?.name ?? 'ALL',
      sortBy: selectedSortby[0]?.value ?? 'ALL',
      staff: selectedStaff[0]?.value ?? 'ALL',
      pageNo: pageNumber,
    };
  }, [
    selectedCompanies,
    selectedPriority,
    selectedSortby,
    selectedStaff,
    pageNumber,
  ]);

  useEffect(() => {
    if (isFocused && graphBody.companyId.length) {
      getGraphData(graphBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphBody, isFocused]);

  useEffect(() => {
    if (isFocused && listBody.companyId.length) {
      taskReportList(listBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listBody, isFocused]);

  useEffect(() => {
    if (!isFocused) {
      setChartData([]);
      setChartColor([]);
      setTaskList([]);
      setPages(undefined);
      setPageNumber(1);
      selectedCompanies.clear();
      setSelectedPriority([]);
      setSelectedStaff([]);
      setSelectedSortby([]);
      setCountFilter(1);
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (data && isSuccess) {
      setChartData(data.data[0].graphData);
      let colors: string[] = [];
      Object.entries(data.data[0].legendsColor).map(element => {
        colors.push(element[1]);
      });
      setChartColor(colors);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  useEffect(() => {
    if (taskListData && taskListSuccess) {
      setTaskList(prev => prev.concat(taskListData.data.nodes));
      setPages(taskListData.data.pageInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListSuccess]);

  const onEndReached = () => {
    if (pages?.hasNextPage && !listLoader) {
      setPageNumber(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (userData) {
      let filter: masterCollectionType[] = [];
      filter.push({id: 1, name: t('filter:all'), value: 'ALL'});
      userData?.taskReportFilter?.map((item, index) => {
        filter.push({id: index + 2, name: getFilterName(item), value: item});
      });
      setStaffArray(filter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  return (
    <Container noSpacing>
      <Header
        label={t('taskReport:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {isLoading && <Loader />}
      <ChartTaskReportScreen
        data={chartData}
        colorScale={chartColor}
        isGraphEmpty={chartData?.every(val => val.y === 0)}
      />
      <Stack spacing={16}>
        <TaskListView
          data={taskList}
          notShowAssignee
          onScrollHandler={scrollHandler}
          isLoading={listLoader}
          pageNumber={pageNumber}
          pageNo={onEndReached}
          onPress={value => {
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            });
          }}
          customFooterStyle={Styles().spacing}
        />
      </Stack>
      {isPanelActive && (
        <TaskReportBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          onApply={val => setSelectedCompanies(val)}
          selectedCompany={selectedCompanies}
          onSelectPriorities={val => setSelectedPriority(val)}
          selectedPriorities={selectedPriority}
          onSelectStaff={val => setSelectedStaff(val)}
          selectedStaffs={selectedStaff}
          onSelectSort={val => setSelectedSortby(val)}
          selectedSort={selectedSortby}
          staffArray={staffArray}
        />
      )}
    </Container>
  );
};
