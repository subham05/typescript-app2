import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {PopupMenu} from 'components/PopupMenu';
import {Stack, StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useGetManageTaskCollectionMutation} from 'request/ManageTask';
import {useAppSelector} from 'store/hooks';
import {TaskBottomPanelModal} from './components/BottomPanelModal';
import {getMenuDataOwner, getMenuGM, getMenus} from './constants';
import {Styles} from './index.styles';
type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'ManageTask'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;
interface masterCollectionType {
  id: number;
  name: string;
}
export const ManageTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const [
    fetchAllTask,
    {
      data: manageTaskDataList,
      isSuccess: isSuccessTaskList,
      isLoading: isLoadingManageTask,
      isUninitialized: isUninitializedTask,
    },
  ] = useGetManageTaskCollectionMutation();

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });
  const {companyId} = useAppSelector(state => state?.formanagement);
  const [pageNo, setPageNo] = useState<number>(1);
  const [taskListState, setTaskListState] = useState<TaskInterface[]>([]);
  const [type, setType] = useState<masterCollectionType[]>([]);
  const [priority, setPriority] = useState<masterCollectionType[]>([]);
  const [status, setStatus] = useState<masterCollectionType[]>([]);
  const {netStatus} = React.useContext(NetworkContext);
  const [calendarVal, setCalendarVal] = useState({
    from: '',
    to: '',
    markedDates: {},
  });
  const [onRefresh, setOnRefresh] = useState(false);
  const bodyObj = useMemo(() => {
    return {
      companyId: companyId?.map(({_id}) => _id),
      searchText: '',
      type: type.map(item => item.name),
      priority: priority.map(item => item.name),
      status: status.map(item => item.name),
      from: calendarVal.from,
      to: calendarVal.to,
      pageNo: pageNo,
    };
  }, [pageNo, type, priority, status, calendarVal, companyId]);

  useEffect(() => {
    if (companyId?.length) {
      setTaskListState([]);
      setPageNo(1);
    }
  }, [companyId]);

  useEffect(() => {
    if (netStatus) {
      fetchAllTask(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj, netStatus]);

  useEffect(() => {
    if (props.route.params?.deleted_Id) {
      setTaskListState([]);
      setPageNo(1);
      fetchAllTask(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.route.params?.deleted_Id]);

  useEffect(() => {
    if (onRefresh) {
      setTaskListState([]);
      fetchAllTask(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj, onRefresh]);

  useEffect(() => {
    if (manageTaskDataList?.data.nodes.length) {
      setTaskListState(prev => prev.concat(manageTaskDataList?.data.nodes));
    }
    setOnRefresh(false);
  }, [manageTaskDataList]);

  const translateY = useSharedValue(0);
  const [countFilter, setCountFilter] = useState<number>(0);
  const [isPanelActive, setIsPanelActive] = useState(false);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
    props.navigation.setOptions({
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
      },
    });
  };

  const renderMainContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('SelectCompany')}>
        <Stack horizontal verticalAlign="center">
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            numberOfLines={1}
            style={styles.companyNameHead}>
            {companyId?.length > 1
              ? t('addManager:allSelectedCompany')
              : companyId![0]?.name}
          </TextView>
          <Icon name="arrow_selection" size={24} color={colors.black} />
        </Stack>
      </TouchableOpacity>
    );
  };
  const renderLeftContainer = () => {
    return (
      <StackItem horizontal childrenGap={10}>
        <IconButton
          name="search"
          color={colors.black}
          size={24}
          style={styles.searchIcon}
          onPress={() =>
            props.navigation.navigate('SearchManageTask', {
              companyId: companyId,
            })
          }
        />
        <PopupMenu
          data={
            userType === userTypes.Owner
              ? getMenuDataOwner(props)
              : userType === userTypes.GeneralManager
              ? getMenuGM(props)
              : getMenus(props)
          }
          height={
            userType === userTypes.Owner
              ? getMenuDataOwner(props).length * 55
              : userType === userTypes.GeneralManager
              ? getMenuGM(props).length * 55
              : getMenus(props).length * 55
          }
          width={178}
          menuStyle={styles.moreIcon}
        />
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        spacing={16}
        // spaceBelow={10}
        horizontal
        horizontalAlign="space-between"
        verticalAlign="center">
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {t('manageTask:head')}
        </TextView>
        <Stack style={countFilter > 0 && styles.filterIcon}>
          <FilterIcon
            count={countFilter}
            onPress={() => {
              openPanel();
              props.navigation.setOptions({
                tabBarStyle: {
                  height: 0,
                },
              });
            }}
          />
        </Stack>
      </Stack>

      <Stack style={styles.eventsContainer}>
        <TaskListView
          data={taskListState}
          dataLength={manageTaskDataList?.data.nodes.length}
          isLoading={pageNo > 1 && isLoadingManageTask}
          manage
          onPress={value => {
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            });
          }}
          pageNo={() => {
            if (manageTaskDataList?.data.pageInfo.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessTaskList}
          isUninitialized={isUninitializedTask}
          onRefresh={() => {
            if (netStatus) {
              setOnRefresh(true);
              setPageNo(1);
            }
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {isPanelActive && (
        <TaskBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          setFilterValues={{
            Type: type,
            Priority: priority,
            Status: status,
            StartDate: calendarVal.from,
            EndDate: calendarVal.to,
            MarkedDates: calendarVal.markedDates,
          }}
          setTitle={val => {
            setTaskListState([]);
            setPageNo(1);
            setType(val);
          }}
          setPriority={val => {
            setTaskListState([]);
            setPageNo(1);
            setPriority(val);
          }}
          setStatus={val => {
            setTaskListState([]);
            setPageNo(1);
            setStatus(val);
          }}
          setDate={(from, to, markedDates) => {
            setTaskListState([]);
            setPageNo(1);
            setCalendarVal({from: from, to: to, markedDates: markedDates});
          }}
        />
      )}
      {isLoadingManageTask && pageNo === 1 && <Loader />}
    </Container>
  );
};
