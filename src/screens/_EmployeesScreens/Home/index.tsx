import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {EventListView} from 'components/Events/EventsListView';
import {FloatingButton} from 'components/FloatingButton';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {SectionHeader} from 'components/SectionHeader';
import {TaskListView} from 'components/Task/TaskListView';
import {EmployeesBottomNavParamList} from 'navigation/Stacks/EmployeesStack/EmployeesMainTabNavigation';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {eventsListData, taskData} from 'screens/Home/mockData';
import {Stack} from 'stack-container';
import {ChartHomeScreen} from './components/Chart';
import {Styles} from './index.styles';

type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<EmployeesBottomNavParamList, 'Home'>,
  NativeStackScreenProps<EmployeesSignedInStackParamList, 'DrawerNavigation'>
>;

export const EmployeesHomeScreen = (props: HomeScreenProps) => {
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [swipeModal, setSwipeModal] = useState<boolean>(false);

  const renderMainContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('SelectCompany')}>
        <Stack horizontal>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            numberOfLines={1}
            style={styles.companyName}>
            The walt disney company
          </TextView>
          <Icon name="arrow_selection" size={28} color={colors.black} />
        </Stack>
      </TouchableOpacity>
    );
  };

  const renderLeftContainer = () => {
    return (
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Notification')}>
        <TextView
          weight="semibold"
          variant={FontSizes.xxSmall}
          style={styles.count}>
          12
        </TextView>
        <Icon name="notifications" size={24} color={colors.black} />
      </TouchableOpacity>
    );
  };

  const styles = Styles();

  const {t} = useTranslation();
  return (
    <Container noSpacing>
      <Header
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
        isCount
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <View style={styles.eventsContainer}>
          <SectionHeader title={t('homePage:taskProgress')} />
          <ChartHomeScreen />
          <Stack horizontal horizontalAlign="space-between">
            <SectionHeader title={t('homePage:todaysEvents')} />
            <IconButton
              name="arrow_right"
              size={24}
              color={colors.black}
              style={styles.icon}
              onPress={() => props.navigation.navigate('Events')}
            />
            {/* <TouchableOpacity
              style={styles.icon}
              onPress={() => props.navigation.navigate('Events')}>
              <Icon name="arrow_right" size={24} color={colors.black} />
            </TouchableOpacity> */}
          </Stack>
          <EventListView
            data={eventsListData}
            horizontal
            onPress={value =>
              props.navigation.navigate('EventDetails', {eventData: value!})
            }
          />
        </View>

        <Stack style={styles.eventsContainer}>
          <Stack horizontal horizontalAlign="space-between">
            <SectionHeader title={t('managersHomePage:upcomingDeadlines')} />
            <IconButton
              name="arrow_right"
              size={24}
              color={colors.black}
              style={styles.icon}
              onPress={() => props.navigation.navigate('UpcomingDeadlines')}
            />
            {/* <TouchableOpacity
              style={styles.icon}
              onPress={() => props.navigation.navigate('UpcomingDeadlines')}>
              <Icon name="arrow_right" size={24} color={colors.black} />
            </TouchableOpacity> */}
          </Stack>
          <TaskListView
            data={taskData}
            {...props}
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
              })
            }
            inProgress
          />
        </Stack>
      </Animated.ScrollView>

      <FloatingButton name="add_floating" onPress={() => setSwipeModal(true)} />

      {swipeModal ? (
        <Modal
          isVisible={swipeModal}
          onBackdropPress={() => setSwipeModal(false)}
          style={styles.bottomModal}>
          <View style={styles.bottomModalView}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('EmployeeAddTask', {subTask: true});
                setSwipeModal(false);
              }}>
              <TextView
                weight="bold"
                variant={FontSizes.medium}
                style={[styles.modalText, styles.modalView]}>
                {t('homePage:addTask')}
              </TextView>
            </TouchableOpacity>
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </Container>
  );
};
