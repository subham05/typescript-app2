import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {PerformanceReportList} from 'components/Report/PerformanceReport/ReportList';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  PerfReportNode,
  useGetPerformanceListMutation,
} from 'request/PerformanceReport';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {PerformanceReportBottomPanelModal} from './components/BottomPanelModal';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'PerformanceReport'
>;
export const PerformanceReportScreen = (props: Props) => {
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

  const [selectedTitles, setSelectedTitles] = useState<masterCollectionType[]>(
    [],
  );

  const [selectedStaff, setSelectedStaff] = useState<masterCollectionType[]>(
    [],
  );
  const [selectedSortby, setSelectedSortby] = useState<masterCollectionType[]>([
    {id: 1, name: t('filter:ascending')},
  ]);
  const [perfList, setPerfList] = useState<PerfReportNode[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchText, setSearchText] = useState('');
  const [refresh, setRefresh] = useState(false);

  const [
    perfReportList,
    {data: perfListData, isSuccess: taskListSuccess, isLoading: isListLoading},
  ] = useGetPerformanceListMutation();
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const [pageNumber, setPageNumber] = useState<number>(1);

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
    if (companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    if (userData?.masterData?.typeOfTask.length) {
      const {masterData} = userData!;
      let titleArray: masterCollectionType[] = [];
      masterData?.typeOfTask.map((item, index) => {
        titleArray.push({id: index + 1, name: item});
      });
      setSelectedTitles(titleArray);
    }
  }, [userData]);

  const listBody = useMemo(() => {
    return {
      companyId: [...selectedCompanies],
      role: selectedStaff?.map(item => item?.name?.toUpperCase()) || [],
      type: selectedTitles?.map(item => item?.name) || [],
      searchText: searchText,
      pageNo: pageNumber,
      sortingOrder: selectedSortby[0]?.id,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCompanies,
    selectedSortby,
    selectedStaff,
    pageNumber,
    searchText,
  ]);

  useEffect(() => {
    if (listBody?.companyId?.length) {
      perfReportList(listBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listBody]);

  useEffect(() => {
    if (perfListData && taskListSuccess) {
      setPerfList(prev => prev.concat(perfListData?.data?.nodes));
    }
    setRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskListSuccess]);

  useEffect(() => {
    if (refresh) {
      setPerfList([]);
      perfReportList(listBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, listBody]);

  const onEndReached = () => {
    if (perfListData?.data?.pageInfo?.hasNextPage && !isListLoading) {
      setPageNumber(prev => prev + 1);
    }
  };

  const clearPerfList = () => {
    setPerfList([]);
    setPageNumber(1);
  };

  useEffect(() => {
    if (searchText?.length) {
      setPerfList([]);
      setPageNumber(1);
    }
  }, [searchText]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('performanceReport:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={searchPattern1}
          pattern2={searchPattern2}
        />
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <PerformanceReportList
          onScrollHandler={scrollHandler}
          data={perfList}
          dataLength={perfListData?.data?.nodes?.length}
          isSuccess={taskListSuccess}
          onPress={item =>
            props.navigation.navigate('DetailPerformanceReport', {
              userId: item?._id,
              companyId: Array.from(selectedCompanies),
            })
          }
          pageNo={onEndReached}
          onRefresh={() => {
            setRefresh(true);
            setPageNumber(1);
          }}
          isLoading={pageNumber > 1 && isListLoading}
        />
      </Stack>
      {isPanelActive && (
        <PerformanceReportBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          onApply={val => {
            clearPerfList();
            setSelectedCompanies(val);
          }}
          selectedCompany={selectedCompanies}
          onSelectTitle={val => {
            clearPerfList();
            setSelectedTitles(val);
          }}
          selectedTitle={selectedTitles}
          onSelectStaff={val => {
            clearPerfList();
            setSelectedStaff(val);
          }}
          selectedStaffs={selectedStaff}
          onSelectSort={val => {
            clearPerfList();
            setSelectedSortby(val);
          }}
          selectedSort={selectedSortby}
        />
      )}
      {isListLoading && pageNumber === 1 && !searchText?.length && <Loader />}
    </Container>
  );
};
