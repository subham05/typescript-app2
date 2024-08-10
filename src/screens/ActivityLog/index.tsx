import {DrawerScreenProps} from '@react-navigation/drawer';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import {MarkedDatesModel} from 'components/FilterModal/FilterSubMenu/CalendarRangePicker';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
// import {TopTabBar} from 'components/TopTabScroll';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  // useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  activityLogsObjModal,
  useGetEmployeeActivityLogMutation,
  useGetGMActivityLogMutation,
  useGetManagerActivityLogMutation,
  useGetOwnerActivityLogMutation,
  useGetPAActivityLogMutation,
  useGetVendorActivityLogMutation,
} from 'request/ActivityLogs';
import {useAppSelector} from 'store/hooks';
import {ActivityLogList} from './components/ActivityLogList';
import {ActivityLogBottomPanelModal} from './components/BottomPanelModal';

export type ActivityLogsProps = CompositeScreenProps<
  DrawerScreenProps<DrawerNavParamList, 'ActivityLogs'>,
  NativeStackScreenProps<SignedInStackParamList>
>;
export const ActivityLogsScreen = (props: ActivityLogsProps) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  // const scrollHandler = useAnimatedScrollHandler(event => {
  //   translateY.value = event.contentOffset.y;
  // });

  const {route} = props;
  const {type} = {
    ...route.params,
  };
  const [countFilter, setCountFilter] = useState<number>(0);
  const [isPanelActive, setIsPanelActive] = useState(false);
  // const [selectedTab, setSelectedTab] = useState<string | undefined>(type);
  const [searchText, setSearchText] = useState<string>('');
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [logsList, setLogsList] = useState<activityLogsObjModal[]>([]);
  const hasNextPage = useRef<boolean>(false);
  const [companyList, setCompanyList] = useState<Set<string>>(
    new Set<string>(),
  );
  const [toDate, setToDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [markedDates, setMarkedDates] = useState<MarkedDatesModel>();
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const {companyId} = useAppSelector(state => state?.formanagement);

  const [
    getOwnerActivityLogs,
    {
      data: ownerActivityData,
      isLoading: isOwnerActivityLoading,
      isSuccess: isOwnerActivitySuccess,
    },
  ] = useGetOwnerActivityLogMutation();
  const [
    getManagerActivityLogs,
    {
      data: managerActivityData,
      isLoading: isManagerActivityLoading,
      isSuccess: isManagerActivitySuccess,
    },
  ] = useGetManagerActivityLogMutation();
  const [
    getEmployeeActivityLogs,
    {
      data: employeeActivityData,
      isLoading: isEmployeeActivityLoading,
      isSuccess: isEmployeeActivitySuccess,
    },
  ] = useGetEmployeeActivityLogMutation();
  const [
    getGMActivityLogs,
    {
      data: gmActivityData,
      isLoading: isGMActivityLoading,
      isSuccess: isGMActivitySuccess,
    },
  ] = useGetGMActivityLogMutation();
  const [
    getPAActivityLogs,
    {
      data: paActivityData,
      isLoading: isPAActivityLoading,
      isSuccess: isPAActivitySuccess,
    },
  ] = useGetPAActivityLogMutation();

  const [
    getVendorActivityLogs,
    {
      data: vendorActivityData,
      isLoading: isVendorActivityLoading,
      isSuccess: isVendorActivitySuccess,
    },
  ] = useGetVendorActivityLogMutation();

  const requestObj = useMemo(() => {
    const ids: string[] = [];
    companyList.forEach(company => ids.push(company));
    return {
      pageNo: pageNumber,
      companyId: ids,
      searchText: searchText,
      from: fromDate,
      to: toDate,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, companyList, pageNumber, fromDate]);
  const getSelecteTabCall = (tabName: string, isCall: boolean) => {
    switch (tabName) {
      case t('staffReport:owner'): {
        if (isCall) {
          getOwnerActivityLogs(requestObj);
          break;
        } else {
          return ownerActivityData;
        }
      }
      case t('staffReport:manager'): {
        if (isCall) {
          getManagerActivityLogs(requestObj);
          break;
        } else {
          return managerActivityData;
        }
      }
      case t('staffReport:employees'): {
        if (isCall) {
          getEmployeeActivityLogs(requestObj);
          break;
        } else {
          return employeeActivityData;
        }
      }
      case t('staffReport:generalManager'): {
        if (isCall) {
          getGMActivityLogs(requestObj);
          break;
        } else {
          return gmActivityData;
        }
      }
      case t('staffReport:personalAssistant'): {
        if (isCall) {
          getPAActivityLogs(requestObj);
          break;
        } else {
          return paActivityData;
        }
      }
      case t('staffReport:Vendor'): {
        if (isCall) {
          getVendorActivityLogs(requestObj);
          break;
        } else {
          return vendorActivityData;
        }
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (type) {
        getSelecteTabCall(type, true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type, requestObj]),
  );
  useFocusEffect(
    useCallback(() => {
      if (companyId) {
        companyId.map(({_id}) => setCompanyList(new Set(companyList.add(_id))));
      }
      return () => {
        setLogsList([]);
        setPageNumber(1);
        setToDate('');
        setFromDate('');
        setCountFilter(0);
        setMarkedDates(undefined);
        setIsRefresh(false);
        setSearchText('');
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  useEffect(() => {
    if (
      (isOwnerActivitySuccess && ownerActivityData) ||
      (isManagerActivitySuccess && managerActivityData) ||
      (isEmployeeActivitySuccess && employeeActivityData) ||
      (isGMActivitySuccess && gmActivityData) ||
      (isPAActivitySuccess && paActivityData) ||
      (isVendorActivitySuccess && vendorActivityData)
    ) {
      const data = getSelecteTabCall(type!, false);
      if (data) {
        const {nodes, pageInfo} = data!;
        hasNextPage.current = pageInfo.hasNextPage;
        pageNumber === 1
          ? setLogsList(nodes)
          : setLogsList(prev => prev.concat(nodes));
        setIsRefresh(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOwnerActivitySuccess,
    isManagerActivitySuccess,
    isEmployeeActivitySuccess,
    isGMActivitySuccess,
    isPAActivitySuccess,
    isVendorActivitySuccess,
  ]);
  const openPanel = () => setIsPanelActive(true);
  const closePanel = () => setIsPanelActive(false);

  const renderLeftContainer = () => {
    return (
      <Stack style={countFilter > 0 && styles().filterIcon} center>
        <FilterIcon
          count={countFilter}
          onPress={() => {
            openPanel();
          }}
        />
      </Stack>
    );
  };

  return (
    <Container noSpacing>
      <Header
        label={t('activityLogs:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        navigationType="DRAWER"
      />
      {/* <Stack spaceBelow={16} style={styles().staffView}>
        <TopTabBar
          data={SelectedStaffArray}
          props={props}
          onPress={value => {
            setPageNumber(1);
            setSelectedTab(value);
          }}
          defaultValue={selectedTab}
        />
      </Stack> */}
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles().attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setPageNumber(1);
            setSearchText(val.trim());
          }}
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
        />
      </Stack>
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spacing={16} spaceBelow={160}>
        <ActivityLogList
          data={logsList}
          onEndReach={() =>
            hasNextPage.current &&
            !isOwnerActivityLoading &&
            !isManagerActivityLoading &&
            !isEmployeeActivityLoading &&
            !isGMActivityLoading &&
            !isPAActivityLoading &&
            !isVendorActivityLoading &&
            setPageNumber(pageNumber + 1)
          }
          loading={
            isOwnerActivityLoading ||
            isManagerActivityLoading ||
            isEmployeeActivityLoading ||
            isGMActivityLoading ||
            isPAActivityLoading ||
            isVendorActivityLoading
          }
          pageNo={pageNumber}
          searchText={searchText.length}
          refresh={isRefresh}
          getRefresh={() => {
            setPageNumber(1);
            setIsRefresh(true);
            getSelecteTabCall(type!, true);
          }}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isPanelActive && (
        <ActivityLogBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          companylist={companyList}
          selectedToDate={toDate}
          selectedFromDate={fromDate}
          markedDate={markedDates}
          setSelectedCompanyList={(
            values,
            toDates,
            FromDates,
            MarkedDates = undefined,
          ) => {
            setPageNumber(1);
            setToDate(toDates!);
            setFromDate(FromDates!);
            setMarkedDates(MarkedDates!);
            setCompanyList(new Set(values));
          }}
        />
      )}
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    heading: {
      marginTop: 15,
    },
    staffView: {
      marginLeft: 16,
    },
    companyNameHead: {
      width: 160,
    },
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    filterIcon: {bottom: 4},
  });
  return mergeStyles;
};
