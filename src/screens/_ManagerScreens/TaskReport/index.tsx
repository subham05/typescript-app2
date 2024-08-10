import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';
import {ChartTaskReportScreen} from 'screens/TaskReport/components/Chart';
import {TaskReportBottomPanel} from './components/BottomPanel';

// const widthAndHeight = Dimensions.get('screen').width / 2;
// const series = [100, 40, 50, 20, 10, 20];
// const sliceColor = [
//   colors.grey_008,
//   colors.green_001,
//   colors.blue_002,
//   colors.primary,
//   colors.orange,
//   colors.primary_002,
// ];

type Props = NativeStackScreenProps<ManagerSignedInStackParamList>;
export const ManagerTaskReportScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [countFilter, setCountFilter] = useState<number>(0);

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

  // const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        label={t('taskReport:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <ChartTaskReportScreen />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16}>
          <TaskListView
            data={taskData}
            notShowAssignee
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
                vendors: true,
              })
            }
          />
        </Stack>
      </Animated.ScrollView>
      {isPanelActive && (
        <TaskReportBottomPanel
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
        />
      )}
    </Container>
  );
};
