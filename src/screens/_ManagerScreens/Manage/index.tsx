import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {ManagersBottomNavParamList} from 'navigation/Stacks/ManagersStack/ManagersMainTabNavigation';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
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
import {taskData} from 'screens/Home/mockData';
import {TaskBottomPanel} from 'screens/Manage/components/BottomPanel';
import {Styles} from './index.styles';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ManagersBottomNavParamList, 'ManageTask'>,
  NativeStackScreenProps<ManagerSignedInStackParamList, 'DrawerNavigation'>
>;
export const ManagerManageTaskScreen = (props: Props) => {
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
    props.navigation.setOptions({
      tabBarStyle: {
        height: 60,
        paddingBottom: 10,
      },
    });
  };

  const renderMainContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('SelectCompany')}>
        <Stack horizontal>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            numberOfLines={1}
            style={styles.companyNameHead}>
            The walt disney company
          </TextView>
          <Icon name="arrow_selection" size={28} color={colors.black} />
        </Stack>
      </TouchableOpacity>
    );
  };

  const renderLeftContainer = () => {
    return (
      <StackItem horizontal childrenGap={10}>
        {/* <FilterIcon
          count={countFilter}
          onPress={() => {
            openPanel();
            props.navigation.setOptions({
              tabBarStyle: {
                height: 0,
              },
            });
          }}
        /> */}
        <IconButton
          name="search"
          color={colors.black}
          size={24}
          style={styles.searchIcon}
          onPress={() => props.navigation.navigate('SearchManageTask')}
        />
        <Menu>
          <MenuTrigger>
            <Icon
              name="more"
              size={20}
              color={colors.black}
              style={styles.moreIcon}
            />
          </MenuTrigger>
          <MenuOptions>
            <MenuOption
              onSelect={() => {
                props.navigation.navigate('SelfAssignedTask');
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('manageTask:selfAssigned')}
                </TextView>
              </Stack>
            </MenuOption>
            <Stack spacing={16}>
              <Divider />
            </Stack>
            <MenuOption
              onSelect={() => {
                props.navigation.navigate('AssignedToMe');
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('manageTask:assignedToMe')}
                </TextView>
              </Stack>
            </MenuOption>
            <Stack spacing={16}>
              <Divider />
            </Stack>
            <MenuOption
              onSelect={() => {
                props.navigation.navigate('ReportedByMe');
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('manageTask:reportedByMe')}
                </TextView>
              </Stack>
            </MenuOption>
            <Stack spacing={16}>
              <Divider />
            </Stack>
            <MenuOption
              onSelect={() => {
                props.navigation.navigate('ManagerPendingTask');
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('manageTask:pendingApprovals')}
                </TextView>
              </Stack>
            </MenuOption>
            <Stack spacing={16}>
              <Divider />
            </Stack>
            <MenuOption
              onSelect={() => {
                props.navigation.navigate('ReallocationTask');
              }}>
              <Stack horizontal>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={styles.pendingTask}>
                  {t('manageTask:reallocationRequest')}
                </TextView>
              </Stack>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack
          spacing={16}
          // spaceBelow={10}
          horizontal
          horizontalAlign="space-between">
          <TextView weight="bold" variant={FontSizes.xlarge}>
            {t('manageTask:head')}
          </TextView>
          <Stack style={countFilter > 0 && styles.filterIcon}>
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
        </Stack>
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
