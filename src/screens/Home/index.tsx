import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {NotificationActionTypes} from 'common/utils/NotificationActionTypes';
import {AlertPermission} from 'common/utils/permission/Alert';
import {getMicStoragePermission} from 'common/utils/permission/ReadMicStorage';
import {Container, TextView} from 'components';
import AddVoiceNotes from 'components/AddVoiceNote';
import {EventListView} from 'components/Events/EventsListView';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {SectionHeader} from 'components/SectionHeader';
import {Stack, StackItem} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import PushNotification from 'react-native-push-notification';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  InprogressTask,
  RiskFactorData,
  TaskProgressData,
  TodaysEvent,
  useCustomSettingSaveMutation,
  useInProgressDashboardMutation,
  useRiskFactorMutation,
  useTaskProgressFilterMutation,
  useTodaysEventMutation,
} from 'request/Dashboard';
import {StaffSubmenuModal, userDataAction} from 'store/Reducer';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {HomeScreenBottomPanel} from './components/BottomPanel';
import {ChartHomeScreen, chartsType} from './components/Chart';
import {HomeScreenFilterModal} from './components/FilterModal';
import {RiskFactorHomeScreen} from './components/RiskFactor';
import {Styles} from './index.styles';
import {HomeScreenStrings} from './constants';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'Home'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;

enum HomeComponents {
  GRAPH = 1,
  EVENTS = 2,
  TASKS = 3,
}

export const HomeScreen = (props: HomeScreenProps) => {
  const translateY = useSharedValue(0);
  const dispatch = useAppDispatch();
  PushNotification.configure({
    onNotification: function (notification) {
      if (notification.userInteraction) {
        navigationFunction(notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    requestPermissions: true,
  });

  const navigationFunction = async notification => {
    let detailObj = JSON.parse(notification?.data?.detail);

    const {taskId: _id, actionType} = detailObj;
    switch (actionType) {
      case NotificationActionTypes.CreateInvite:
        props.navigation.navigate('EventDetails', {
          eventId: detailObj?.eventId,
        });
        break;

      case NotificationActionTypes.EventReminder:
        props.navigation.navigate('Calender');
        break;

      case NotificationActionTypes.DeleteTask:
        break;
      case NotificationActionTypes.DocumentShare:
        props.navigation.navigate('DocumentRepository', {isShareWithMe: true});
        break;
      case NotificationActionTypes.ContactShare:
        props.navigation.navigate('PublicContactRepository', {
          isShareNotification: true,
        });
        break;

      case NotificationActionTypes.VoiceNoteShare:
        props.navigation.navigate('VoiceNotes', {sharedWithMe: Date.now()});
        break;
      case NotificationActionTypes.CreateExpiry:
        props.navigation.navigate('ViewDocument', {id: detailObj?.eventId});
        break;
      case NotificationActionTypes.SendMessage:
      case NotificationActionTypes.AddMember:
        const isChat = detailObj?.chatId ? true : false;
        props.navigation.navigate('ChattingScreen', {
          type: isChat ? 'Chats' : 'Groups',
          data: {
            _id: isChat ? detailObj.chatId : detailObj.groupId,
            username: detailObj.userName,
            userImage: detailObj.userImage,
            chatWith: detailObj.receiverId[0] || '',
            groupImage: detailObj.groupImage,
            groupName: detailObj.groupName,
          },
        });
        break;
      case NotificationActionTypes.RemoveMember:
        break;
      default:
        props.navigation.navigate('TaskDetails', {
          taskId: {_id},
          fromNotifee: actionType,
        });
        break;
    }
    await AsyncStorage.removeItem('BackgroundNotification');
  };

  // notifee.onForegroundEvent(({type, detail}) => {
  //   if (type === EventType.PRESS && detail?.pressAction?.id) {
  //     navigationFunction(detail?.notification?.data?.detail);
  //   }
  // });

  // notifee.onBackgroundEvent(async ({type, detail}) => {
  //   if (type === EventType.PRESS && detail?.pressAction?.id) {
  //     navigationFunction(detail?.notification?.data?.detail);
  //   }
  // });

  const notificationFunction = async () => {
    let notification = await AsyncStorage.getItem('BackgroundNotification');

    let notificationData = JSON.parse(notification);

    if (Object.keys(notificationData).length) {
      const {data} = notificationData?.notification;
      navigationFunction(data?.detail ? data?.detail : data?.item);
    }
  };
  const [addList, setAddList] = useState<StaffSubmenuModal[] | []>([]);

  useEffect(() => {
    setAddFabLis();
    notificationFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setAddFabLis = async () => {
    let addListTemp = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    addListTemp = JSON.parse(addListTemp);
    addListTemp = addListTemp.add;
    setAddList(addListTemp);
  };
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPanelActive, setIsPanelActive] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [chartType, setChartType] = useState<string>(chartsType.Bar);
  const [selectedGraph, setSelectedGraph] = useState<string>(chartsType.Bar);
  const [chartFilterTaskData, setChartFilterTaskData] =
    useState<TaskProgressData>();
  const [riskFactorData, setRiskFactorData] = useState<RiskFactorData>();
  const [todaysEvents, setTodaysEvents] = useState<TodaysEvent[] | undefined>();
  const [inprogressTask, setInprogressTask] = useState<
    InprogressTask[] | undefined
  >();
  const [selectedFilterGraph, setSelectedFilterGraph] = useState<string>(
    HomeScreenStrings.MONTH,
  );
  const [selectedFilterGraphRisk, setSelectedFilterGraphRisk] =
    useState<string>(HomeScreenStrings.MONTH);
  const [filterSelectedDate, setFilterSelectedDate] = useState<string>('');
  const [filterSelectDateRF, setFilterSelectDateRF] = useState<string>('');
  const [chartIndex, setChartIndex] = useState<number>(0);
  const [todaysEventsPageNo] = useState<number>(1);
  const [inprogressTaskPageNo] = useState<number>(1);

  const {companyId, userData} = useAppSelector(state => state?.formanagement);

  const [
    getTaskChartFilter,
    {
      data: taskChartFilterData,
      isLoading: isLoadingTaskChartFilter,
      isError: isErrorTaskChartFilter,
      isSuccess: isSuccessTaskChartFilter,
      error: taskChartFilterError,
    },
  ] = useTaskProgressFilterMutation();
  const [
    setCustomSetting,
    {
      data: graphCustomData,
      isLoading: isCustomDataLoading,
      isSuccess: isSuccessCustomData,
    },
  ] = useCustomSettingSaveMutation();

  const requestObj = useMemo(() => {
    return {
      companyId: companyId.map(ids => ids._id),
      duration: selectedFilterGraph,
      customDate: filterSelectedDate ? filterSelectedDate : '',
    };
  }, [companyId, filterSelectedDate, selectedFilterGraph]);

  useFocusEffect(
    useCallback(() => {
      getTaskChartFilter(requestObj);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getTaskChartFilter, requestObj, graphCustomData]),
  );

  useEffect(() => {
    if (isSuccessTaskChartFilter && taskChartFilterData) {
      setChartFilterTaskData(taskChartFilterData.data);
    } else if (isErrorTaskChartFilter) {
    }
  }, [
    isErrorTaskChartFilter,
    isSuccessTaskChartFilter,
    taskChartFilterData,
    taskChartFilterError,
  ]);
  useEffect(() => {
    if (graphCustomData && isSuccessCustomData) {
      const obj = {
        ...userData!,
        dashboardCustomSettings: graphCustomData?.data.dashboardCustomSettings,
      };
      dispatch(userDataAction(obj));
      AsyncStorage.setItem(STR_KEYS.LOGINUSERDATA, JSON.stringify(obj));
      setChartType(selectedGraph);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccessCustomData]);
  const [
    getRiskFactorFilter,
    {
      data: riskFactorFilterData,
      isLoading: isLoadingRiskFactorFilter,
      isError: isErrorRiskFactorFilter,
      isSuccess: isSuccessRiskFactorFilter,
      error: riskFactorFilterError,
    },
  ] = useRiskFactorMutation();

  const riskFactorRequestObj = useMemo(() => {
    return {
      companyId: companyId.map(ids => ids._id),
      duration: selectedFilterGraphRisk,
      customDate: filterSelectDateRF ? filterSelectDateRF : '',
    };
  }, [companyId, filterSelectDateRF, selectedFilterGraphRisk]);

  useFocusEffect(
    useCallback(() => {
      getRiskFactorFilter(riskFactorRequestObj);
    }, [getRiskFactorFilter, riskFactorRequestObj]),
  );

  useEffect(() => {
    if (isSuccessRiskFactorFilter && riskFactorFilterData) {
      setRiskFactorData(riskFactorFilterData.data[0]);
    } else if (isErrorRiskFactorFilter) {
    }
  }, [
    isErrorRiskFactorFilter,
    isSuccessRiskFactorFilter,
    riskFactorFilterData,
    riskFactorFilterError,
  ]);

  const [
    getTodaysEvents,
    {
      data: todaysEventsData,
      isLoading: isLoadingTodaysEvents,
      isError: isErrorTodaysEvents,
      isSuccess: isSuccessTodaysEvents,
      error: todaysEventsError,
    },
  ] = useTodaysEventMutation();

  const todaysEventsRequestObj = useMemo(() => {
    return {
      companyId: companyId.map(ids => ids._id),
      selectedDate: new Date().toString(),
      pageNo: todaysEventsPageNo,
    };
  }, [companyId, todaysEventsPageNo]);

  useFocusEffect(
    useCallback(() => {
      getTodaysEvents(todaysEventsRequestObj);
    }, [getTodaysEvents, todaysEventsRequestObj]),
  );

  useEffect(() => {
    if (isSuccessTodaysEvents && todaysEventsData) {
      setTodaysEvents(todaysEventsData.data.todaysEvent);
    } else if (isErrorTodaysEvents) {
    }
  }, [
    isErrorTodaysEvents,
    isSuccessTodaysEvents,
    todaysEventsData,
    todaysEventsError,
  ]);

  const [
    getInprogressTask,
    {
      data: inprogressTaskData,
      isLoading: isLoadingInprogressTask,
      isError: isErrorInprogressTask,
      isSuccess: isSuccessInprogressTask,
      error: inprogressTaskError,
    },
  ] = useInProgressDashboardMutation();

  const InprogressTaskRequestObj = useMemo(() => {
    return {
      companyId: companyId.map(ids => ids._id),
      pageNo: inprogressTaskPageNo,
    };
  }, [companyId, inprogressTaskPageNo]);

  useFocusEffect(
    useCallback(() => {
      getInprogressTask(InprogressTaskRequestObj);
    }, [getInprogressTask, InprogressTaskRequestObj]),
  );

  useEffect(() => {
    if (isSuccessInprogressTask && inprogressTaskData) {
      setInprogressTask(inprogressTaskData.data.nodes);
    } else if (isErrorInprogressTask) {
    }
  }, [
    isErrorInprogressTask,
    isSuccessInprogressTask,
    inprogressTaskData,
    inprogressTaskError,
  ]);

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
  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
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
            style={styles.companyName}>
            {companyId?.length > 1
              ? t('addManager:allSelectedCompany')
              : companyId![0]?.name}
          </TextView>
          <Icon name="arrow_selection" size={24} color={colors.black} />
        </Stack>
      </TouchableOpacity>
    );
  };

  const getMicPermission = () =>
    getMicStoragePermission().then(res => {
      if (res.isPermissionGranted) {
        setShowVoiceModal(true);
      } else {
        AlertPermission(t('permissions:microphone_storage'));
      }
    });

  const onCloseVoiceModal = () => setShowVoiceModal(false);

  const renderLeftContainer = () => {
    return (
      <StackItem childrenGap={10} horizontal>
        <IconButton
          name="mic"
          size={24}
          color={colors.black}
          onPress={async () => {
            getMicPermission();
          }}
          style={styles.mic}
        />
        <></>
        <TouchableOpacity
          onPress={() => props.navigation.navigate('Notification')}>
          <TextView
            weight="semibold"
            variant={FontSizes.xxSmall}
            style={styles.count}>
            12
          </TextView>
          <Icon name="notifications" size={24} color={colors.black} />
        </TouchableOpacity>
      </StackItem>
    );
  };

  const styles = Styles();

  const {t} = useTranslation();

  const componentArray = [
    <ChartHomeScreen
      data={chartFilterTaskData!}
      onClickCustom={() => setIsFilterModalOpen(prevState => !prevState)}
      typeChart={chartType!}
      onFilterChange={setSelectedFilterGraph}
      onDateSelect={setFilterSelectedDate}
    />,
    <RiskFactorHomeScreen
      data={riskFactorData!}
      isGraphEmpty={riskFactorData?.graphData?.every(val => val.y === 0)!}
      onClickCustom={() => setIsFilterModalOpen(prevState => !prevState)}
      typeChart={chartType!}
      onFilterChange={setSelectedFilterGraphRisk}
      onDateSelect={setFilterSelectDateRF}
    />,
  ];

  const _onViewableItemsChanged = React.useRef((viewableItems: any) => {
    var viewItem = viewableItems?.viewableItems;
    setChartIndex(viewItem[0]?.index);
  });

  const _viewabilityConfig = React.useRef({
    viewAreaCoveragePercentThreshold: 51,
  });

  return (
    <Container noSpacing>
      <Header
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
        isCount
        hideLabel
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        {userData?.dashboardCustomSettings?.SequenceDataOrder.map(order => {
          return (
            <View style={styles.eventsContainer}>
              {order === HomeComponents.GRAPH && (
                <View>
                  <SectionHeader
                    title={
                      chartIndex === 0
                        ? t('homePage:taskProgress')
                        : t('homePage:riskFactor')
                    }
                  />
                  <FlatList
                    data={componentArray}
                    horizontal
                    renderItem={({item, index}) => {
                      return (
                        <Stack spaceBelow={16} key={index.toString()}>
                          {item}
                        </Stack>
                      );
                    }}
                    onViewableItemsChanged={_onViewableItemsChanged?.current}
                    showsHorizontalScrollIndicator={false}
                    viewabilityConfig={_viewabilityConfig?.current}
                    ItemSeparatorComponent={() => (
                      <View style={styles.chartSeparator} />
                    )}
                  />
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    // style={styles().bottomView}
                  >
                    <Stack horizontal verticalAlign="center" style={styles.dot}>
                      <View
                        style={
                          chartIndex === 0
                            ? styles.selected
                            : styles.notSelected
                        }
                      />
                      <View
                        style={
                          chartIndex === 1
                            ? styles.selected
                            : styles.notSelected
                        }
                      />
                    </Stack>
                  </Stack>
                </View>
              )}
              {order === HomeComponents.EVENTS && (
                <View>
                  <Stack horizontal horizontalAlign="space-between">
                    <SectionHeader title={t('homePage:todaysEvents')} />
                    <IconButton
                      name="arrow_right"
                      size={24}
                      color={colors.black}
                      style={styles.icon}
                      onPress={() => props.navigation.navigate('Events')}
                    />
                  </Stack>
                  <EventListView
                    data={todaysEvents}
                    horizontal
                    disableRefresh
                    onPress={
                      value => {
                        value?.type === 'TASK'
                          ? props.navigation.navigate('TaskDetail', {
                              hideButton: true,
                            })
                          : props.navigation.navigate('EventDetails', {
                              eventId: value?._id!,
                            });
                      }
                      // props.navigation.navigate('EventDetails', {eventData: value!})
                    }
                    isLoading={isLoadingTodaysEvents}
                  />
                </View>
              )}
              {order === HomeComponents.TASKS && (
                <View>
                  <Stack horizontal horizontalAlign="space-between">
                    <SectionHeader title={t('homePage:inProgressTasks')} />
                    <IconButton
                      name="arrow_right"
                      size={24}
                      color={colors.black}
                      style={styles.icon}
                      onPress={() =>
                        props.navigation.navigate('InprogressTask')
                      }
                    />
                  </Stack>
                  <TaskListView
                    data={inprogressTask}
                    {...props}
                    onPress={value =>
                      props.navigation.navigate('TaskDetails', {
                        taskId: value,
                      })
                    }
                    inProgress
                    dashboard
                  />
                </View>
              )}
            </View>
          );
        })}
      </Animated.ScrollView>

      {userData?.role.type !== 'EMPLOYEE' && (
        <FloatingButton
          name="add_floating"
          onPress={() => {
            props.navigation.setOptions({
              tabBarStyle: {
                height: 0,
              },
            });
            openPanel();
          }}
        />
      )}
      {isPanelActive && addList.length > 0 && (
        <HomeScreenBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          addList={addList}
        />
      )}
      {isFilterModalOpen && (
        <HomeScreenFilterModal
          panelState={isFilterModalOpen}
          onPressClose={() => closeFilterModal()}
          onSetChartType={value => setSelectedGraph(value)}
          onPressApply={(colorState, sequenceObject) => {
            const obj = {
              chartsType: chartType,
              SequenceData: sequenceObject,
              SequenceDataOrder: sequenceObject?.map(item => item?.id),
              ColorStatusData: colorState,
            };
            closeFilterModal();
            setCustomSetting(obj);
          }}
          selectedChart={selectedGraph}
        />
      )}
      <AddVoiceNotes
        navigation={props.navigation}
        showModal={showVoiceModal}
        onClose={() => onCloseVoiceModal()}
      />

      {(isLoadingTaskChartFilter ||
        isLoadingRiskFactorFilter ||
        isLoadingTodaysEvents ||
        isLoadingInprogressTask ||
        isCustomDataLoading) && <Loader />}
    </Container>
  );
};
