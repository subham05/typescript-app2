import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'ReportedByMe'
>;
export const ReportedByMeScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Container noSpacing>
      <Stack spaceBelow={6}>
        <Header
          navigationType="STACK"
          label={t('manageTask:reportedByMe')}
          translateY={translateY}
          // RenderLeftContainer={renderLeftContainer}
        />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <TaskListView
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
    companyName: {
      marginLeft: 10,
    },
    pendingTask: {
      textAlign: 'center',
      color: colors.black,
      padding: 6,
      paddingHorizontal: 10,
    },
  });
  return mergeStyles;
};
