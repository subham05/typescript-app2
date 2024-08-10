import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
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

export type ManagerTaskDetailsProps = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'TaskDetails'
>;

export const ManagerTaskDetailScreen = (props: ManagerTaskDetailsProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {taskProps, vendors} = {...route.params};

  const [isEditable, setIsEditable] = useState<boolean>(false);

  const renderLeftContainer = () => {
    return (
      <>
        {/* {!vendors && taskProps?.status === 'Assigned' && (
          <Menu>
            <MenuTrigger>
              <Icon name="more" size={24} color={colors.black} />
            </MenuTrigger>
            <MenuOptions>
              <MenuOption
                onSelect={() => {
                  props.navigation.navigate('ReallocateTo');
                }}>
                <Stack horizontal>
                  <TextView
                    weight="medium"
                    variant={FontSizes.regular}
                    style={styles.linkedSubtask}>
                    {t('manageTask:reallocate')}
                  </TextView>
                </Stack>
              </MenuOption>
            </MenuOptions>
          </Menu>
        )} */}
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
        label={
          isEditable ? t('taskDetails:editTaskDetails') : t('taskDetails:head')
        }
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
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
