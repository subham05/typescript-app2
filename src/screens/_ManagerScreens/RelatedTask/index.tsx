import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {SearchTextField} from 'components/InputView';
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
  'RelatedTask'
>;
export const ManagerRelatedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('inboxPage:related')}
        translateY={translateY}
        isCloseNavigation
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles().attachmentView}>
        <SearchTextField />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <TaskListView
            minimal={true}
            notShowAssignee
            data={taskData}
            onPress={value =>
              props.navigation.navigate('TaskDetailsManager', {
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
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
    input: {
      height: 35,
      borderWidth: 1,
      padding: 10,
      marginTop: 5,
      backgroundColor: colors.white,
      borderColor: colors.white,
    },
  });
  return mergeStyles;
};
