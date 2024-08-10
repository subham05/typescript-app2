import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {assignedTaskData} from 'screens/Home/mockData';
import {ReallocationTaskListView} from './components/TaskListView';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'ReallocationTask'
>;
export const ReallocationTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  // const renderLeftContainer = () => {
  //   return (
  //     <Stack horizontal>
  //       <Menu>
  //         <MenuTrigger>
  //           <Icon name="more" size={20} color={colors.black} />
  //         </MenuTrigger>
  //         <MenuOptions>
  //           <MenuOption
  //             onSelect={() => {
  //               props.navigation.navigate('AssignedToMe');
  //             }}>
  //             <Stack horizontal>
  //               <TextView
  //                 weight="medium"
  //                 variant={FontSizes.regular}
  //                 style={styles().pendingTask}>
  //                 {t('manageTask:assignedToMe')}
  //               </TextView>
  //             </Stack>
  //           </MenuOption>
  //           <MenuOption
  //             onSelect={() => {
  //               props.navigation.navigate('ReportedByMe');
  //             }}>
  //             <Stack horizontal>
  //               <TextView
  //                 weight="medium"
  //                 variant={FontSizes.regular}
  //                 style={styles().pendingTask}>
  //                 {t('manageTask:reportedByMe')}
  //               </TextView>
  //             </Stack>
  //           </MenuOption>

  //           <MenuOption
  //             onSelect={() => {
  //               props.navigation.navigate('ManagerPendingTask');
  //             }}>
  //             <Stack horizontal>
  //               <TextView
  //                 weight="medium"
  //                 variant={FontSizes.regular}
  //                 style={styles().pendingTask}>
  //                 {t('manageTask:pendingApprovals')}
  //               </TextView>
  //             </Stack>
  //           </MenuOption>

  //           <MenuOption
  //             onSelect={() => {
  //               props.navigation.navigate('ReallocationTask');
  //             }}>
  //             <Stack horizontal>
  //               <TextView
  //                 weight="medium"
  //                 variant={FontSizes.regular}
  //                 style={styles().pendingTask}>
  //                 {t('manageTask:reallocationRequest')}
  //               </TextView>
  //             </Stack>
  //           </MenuOption>
  //         </MenuOptions>
  //       </Menu>
  //     </Stack>
  //   );
  // };

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        translateY={translateY}
        label={t('manageTask:reallocationRequest')}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack style={styles().eventsContainer}>
          <ReallocationTaskListView
            data={assignedTaskData}
            onPress={value =>
              props.navigation.navigate('TaskDetails', {
                taskProps: value,
                reallocation: true,
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
