import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {EventListView} from 'components/Events/EventsListView';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {t} from 'i18next';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {TodaysEvent, useTodaysEventMutation} from 'request/Dashboard';
import {useAppSelector} from 'store/hooks';

type Props = NativeStackScreenProps<SignedInStackParamList, 'Events'>;
export const EventsScreen = (props: Props) => {
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const renderMainContainer = () => {
  //   return (
  //     <TextView weight="medium" variant={FontSizes.medium}>
  //       Events
  //     </TextView>
  //   );
  // };

  const {companyId} = useAppSelector(state => state?.formanagement);

  const [todaysEventsPageNo, setTodaysEventsPageNo] = useState<number>(1);
  const [todaysEvents, setTodaysEvents] = useState<TodaysEvent[] | undefined>();
  const [isRefreshed, setIsRefreshed] = useState<boolean>(false);

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
    if (isRefreshed) {
      getTodaysEvents(todaysEventsRequestObj);
    }
  }, [getTodaysEvents, isRefreshed, todaysEventsRequestObj]);

  useEffect(() => {
    if (isSuccessTodaysEvents && todaysEventsData) {
      setIsRefreshed(false);
      setTodaysEvents(todaysEventsData.data.todaysEvent);
    } else if (isErrorTodaysEvents) {
    }
  }, [
    isErrorTodaysEvents,
    isSuccessTodaysEvents,
    todaysEventsData,
    todaysEventsError,
  ]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        label={t('homePage:events')}
      />
      <Stack spacing={16} spaceBelow={100}>
        <EventListView
          data={todaysEvents}
          scrollHandler={scrollHandler}
          onPress={
            value => {
              value?.type === 'TASK'
                ? props.navigation.navigate('TaskDetail', {hideButton: true})
                : props.navigation.navigate('EventDetails', {
                    eventId: value?._id!,
                  });
            }
            // props.navigation.navigate('EventDetails', {eventData: value!})
          }
          isLoading={isLoadingTodaysEvents}
          pageNo={todaysEventsPageNo}
          onReachEnd={() => {
            if (todaysEventsData?.data.pageInfo.hasNextPage) {
              setTodaysEventsPageNo(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            setTodaysEventsPageNo(1);
            setIsRefreshed(true);
          }}
        />
      </Stack>
      {isLoadingTodaysEvents && <Loader message="Loading events..." />}
    </Container>
  );
};
