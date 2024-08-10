import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  NotificationNode,
  useGetNotificationMutation,
} from 'request/Notification';
import {NotificationList} from './components/NotificationList';

type Props = NativeStackScreenProps<SignedInStackParamList, 'Notification'>;
export const Notifications = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [trigger, {data, isSuccess, isLoading}] = useGetNotificationMutation();
  const [onRefresh, setOnRefresh] = useState(false);
  const {netStatus} = React.useContext(NetworkContext);

  const [notificationState, setNotificationState] = useState<
    NotificationNode[]
  >([]);

  const [pageNo, setPageNo] = useState(1);

  useEffect(() => {
    trigger(pageNo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo]);

  useEffect(() => {
    if (netStatus) {
      setPageNo(1);
      setNotificationState([]);
      trigger(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netStatus]);

  useEffect(() => {
    if (onRefresh) {
      setNotificationState([]);
      trigger(pageNo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  useEffect(() => {
    if (data?.data?.nodes?.length) {
      setNotificationState(prev => prev.concat(data?.data?.nodes));
    }
    setOnRefresh(false);
  }, [data]);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('notificationPage:notification')}
        translateY={translateY}
      />
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spaceBelow={16}>
        <NotificationList
          onScrollHandler={scrollHandler}
          data={notificationState}
          dataLength={data?.data.nodes.length}
          isLoading={pageNo > 1 && isLoading}
          onPress={() =>
            props.navigation.navigate('NotificationContactRequest')
          }
          pageNo={() => {
            if (data?.data.pageInfo.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          onRefresh={() => {
            if (netStatus) {
              setOnRefresh(true);
              setPageNo(1);
            }
          }}
          isSuccess={isSuccess}
          // onPressTask={item =>
          //   props.navigation.navigate('TaskDetails', {
          //     taskId: item.taskId,
          //   })
          // }
          onPressTask={item =>
            props.navigation.navigate('TaskDetails', {
              taskId: {item, _id: item.taskId},
            })
          }
          // onPressTask={() => {}}
        />
      </Stack>
      {/* </Animated.ScrollView> */}
      {isLoading && pageNo === 1 && <Loader />}
    </Container>
  );
};
