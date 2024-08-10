import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';

type Props = NativeStackScreenProps<
  EmployeesSignedInStackParamList,
  'UpcomingDeadlines'
>;
export const UpcomingDeadlinesScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const renderMainContainer = () => {
    return (
      <TextView weight="bold" variant={FontSizes.regular}>
        {t('managersHomePage:upcomingDeadlines')}
      </TextView>
    );
  };

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <TaskListView
            inProgress
            data={taskData}
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
              })
            }
          />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    eventsContainer: {
      paddingHorizontal: 20,
      paddingBottom: 40,
    },
  });
  return mergeStyles;
};
