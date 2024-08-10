import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {TaskBody} from './components/TaskBody';
import {TaskFooter} from './components/TaskFooter';
import {TaskHead} from './components/TaskHead';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'TaskDetails'>;

export const TaskDetailScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {taskProps, vendors} = {...route.params};

  const renderLeftContainer = () => {
    return (
      <>
        {!vendors && taskProps?.status === 'In-progress' && (
          <Menu>
            <MenuTrigger>
              <Icon name="more" size={24} color={colors.black} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  props.navigation.navigate('LinkedTask');
                }}>
                <Stack horizontal>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.linkedSubtask}>
                    {t('manageTask:viewLinkedTask')}
                  </TextView>
                </Stack>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )}
      </>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('taskDetails:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        isCloseNavigation
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <TaskHead tasksProps={taskProps} />
        <TaskBody tasksProps={taskProps} />
      </Animated.ScrollView>
      {taskProps?.status === 'Resolve' && <TaskFooter />}
    </Container>
  );
};
