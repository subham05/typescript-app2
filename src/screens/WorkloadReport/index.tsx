import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {ReportList} from 'components/Report/ReportList';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useGetWorkloadListMutation} from 'request/WorkloadReport';
import {workloadGraph, workloadListNodes} from 'request/WorkloadReport/types';
import {getFilterName} from 'screens/AttendanceSummery/utils';
import {pageInfo} from 'screens/Contacts';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {WorkloadReportBottomPanelModal} from './components/BottomPanelModal';
import {ChartWorkloadReportScreen} from './components/Chart';

type Props = NativeStackScreenProps<SignedInStackParamList, 'WorkloadReport'>;
export const WorkloadReportScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [countFilter, setCountFilter] = useState<number>(2);
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const isFocused = useIsFocused();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [reportList, setReportList] = useState<workloadListNodes[]>([]);

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );
  const [selectedStaff, setSelectedStaff] = useState<masterCollectionType[]>(
    [],
  );
  const [graphData, setGraphData] = useState<workloadGraph[]>([]);

  const [staffArray, setStaffArray] = useState<masterCollectionType[]>([]);

  const [getReportList, {data, isSuccess, isLoading}] =
    useGetWorkloadListMutation();

  const [isPanelActive, setIsPanelActive] = useState(false);

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
    if (isFocused && companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isFocused]);

  const bodyObj = useMemo(() => {
    if (staffArray.length) {
      const selectAllRoles = userData?.workload?.filter(val => val !== 'SELF');

      const checkRole = selectedStaff.length
        ? selectedStaff[0].value === 'ALL'
          ? selectAllRoles!
          : [selectedStaff[0].value!]
        : selectAllRoles!;
      return {
        companyId: [...selectedCompanies],
        pageNo: pageNumber,
        role: checkRole,
        searchText: '',
      };
    }
  }, [selectedCompanies, pageNumber, staffArray, userData, selectedStaff]);

  useEffect(() => {
    if (isFocused && bodyObj && bodyObj.companyId.length) {
      getReportList(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj, isFocused]);

  useEffect(() => {
    if (data && isSuccess) {
      setReportList(data.data.nodes);
      setGraphData(data.data.graphData);
      setPages(data.data.pageInfo);
    }
  }, [data, isSuccess]);

  const onNextClick = () => {
    if (pages?.hasNextPage) {
      setReportList([]);
      setGraphData([]);
      setPageNumber(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (userData) {
      let filter: masterCollectionType[] = [];
      filter.push({id: 1, name: t('filter:all'), value: 'ALL'});
      userData?.workload?.map((item, index) => {
        filter.push({id: index + 2, name: getFilterName(item), value: item});
      });
      setStaffArray(filter);
      setSelectedStaff([{id: 1, name: t('filter:all'), value: 'ALL'}]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  useEffect(() => {
    if (!isFocused) {
      setReportList([]);
      setPages(undefined);
      setPageNumber(1);
      selectedCompanies.clear();
      setSelectedStaff([]);
      setCountFilter(1);
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isFocused]);

  useEffect(() => {
    setReportList([]);
    setPages(undefined);
    setPageNumber(1);
  }, [selectedCompanies, selectedStaff]);

  return (
    <Container noSpacing>
      <Header
        label={t('workloadReport:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {isLoading && <Loader />}
      <ChartWorkloadReportScreen data={graphData} />
      <Stack spacing={16} spaceBelow={16}>
        <ReportList
          data={reportList}
          workload={true}
          onPress={item =>
            props.navigation.navigate('StaffReportTask', {
              userInfo: item,
              type: 'Workload',
            })
          }
          scrollHandler={scrollHandler}
          isLoading={isLoading}
          onNextClick={onNextClick}
          pages={pages}
        />
      </Stack>
      {isPanelActive && (
        <WorkloadReportBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          onApply={val => setSelectedCompanies(val)}
          selectedCompany={selectedCompanies}
          onSelectStaff={val => setSelectedStaff(val)}
          selectedStaffs={selectedStaff}
          staffArray={staffArray}
        />
      )}
    </Container>
  );
};
