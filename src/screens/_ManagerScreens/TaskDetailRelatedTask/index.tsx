import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {TaskBody} from './components/TaskBody';
import {TaskFooter} from './components/TaskFooter';
import {TaskHead} from './components/TaskHead';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'TaskDetails'
>;

export const ManagerTaskDetailRelatedTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const {route} = {...props};
  const {taskProps, vendors} = {...route.params};

  //const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={
          isEditable ? t('taskDetails:editTaskDetails') : t('taskDetails:head')
        }
        translateY={translateY}
        isCloseNavigation
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <TaskHead
          taskProps={taskProps}
          vendors={vendors}
          onPress={val => {
            setIsEditable(val);
          }}
          isEditable={isEditable}
          props={props}
        />
        <TaskBody tasksProps={taskProps} isEditable={isEditable} />
      </Animated.ScrollView>
      {isEditable && (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton
            title={t('saveChanges')}
            onPress={() => {
              setIsEditable(false);
            }}
          />
        </Stack>
      )}
      {!vendors &&
        (taskProps?.status === 'Resolved' ||
          taskProps?.status === 'Assigned') && (
          <TaskFooter status={taskProps.status} self={taskProps?.self} />
        )}
    </Container>
  );
};
