import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {TaskListView} from 'components/Task/TaskListView';
import {VendorsBottomNavParamList} from 'navigation/Stacks/VendorsStack/VendorsMainTabNavigation';
import {VendorsSignedInStackParamList} from 'navigation/Stacks/VendorsStack/VendorsSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';
import {TaskBottomPanel} from 'screens/Manage/components/BottomPanel';
import {Stack} from 'stack-container';
import {Styles} from './index.styles';

type Props = CompositeScreenProps<
  BottomTabScreenProps<VendorsBottomNavParamList, 'Inbox'>,
  NativeStackScreenProps<VendorsSignedInStackParamList, 'DrawerNavigation'>
>;
export const VendorManageTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

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

  const [countFilter, setCountFilter] = useState<number>(0);

  const renderLeftContainer = () => {
    return (
      <Stack horizontal>
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
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('manageTask:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        isCount={countFilter > 0 ? true : false}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles.eventsContainer}>
          <TaskListView
            data={taskData}
            manage
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
              })
            }
          />
        </Stack>
      </Animated.ScrollView>
      {isPanelActive && (
        <TaskBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
        />
      )}
    </Container>
  );
};
