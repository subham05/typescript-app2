import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const VendorsTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('vendors:tasks')}
        translateY={translateY}
        isCloseNavigation
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <View>
            <TaskListView
              data={taskData}
              {...props}
              vendors={true}
              onPress={value =>
                props.navigation.navigate('TaskDetails', {
                  taskProps: value,
                  vendors: true,
                  hideButtons: true,
                })
              }
            />
          </View>
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
