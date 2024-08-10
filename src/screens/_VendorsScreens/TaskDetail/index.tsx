import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import {VendorsSignedInStackParamList} from 'navigation/Stacks/VendorsStack/VendorsSignedInStack';
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
  VendorsSignedInStackParamList,
  'TaskDetails'
>;

export const VendorTaskDetailScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {taskProps, vendors} = {...route.params};

  const [isEditable, setIsEditable] = useState<boolean>(false);

  // const renderLeftContainer = () => {
  //   return (
  //     <>
  //       {!vendors && taskProps?.status === 'Assigned' && (
  //         <Menu>
  //           <MenuTrigger>
  //             <Icon name="more" size={24} color={colors.black} />
  //           </MenuTrigger>
  //           <MenuOptions>
  //             <MenuOption
  //               onSelect={() => {
  //                 props.navigation.navigate('ReallocateTo');
  //               }}>
  //               <Stack horizontal>
  //                 <TextView
  //                   weight="medium"
  //                   variant={FontSizes.regular}
  //                   style={styles.linkedSubtask}>
  //                   {t('manageTask:reallocate')}
  //                 </TextView>
  //               </Stack>
  //             </MenuOption>
  //           </MenuOptions>
  //         </Menu>
  //       )}
  //     </>
  //   );
  // };

  // const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('taskDetails:head')}
        translateY={translateY}
        // RenderLeftContainer={renderLeftContainer}
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
        />
        <TaskBody tasksProps={taskProps} isEditable={isEditable} />
      </Animated.ScrollView>
      {isEditable && (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton title={t('saveChanges')} onPress={() => {}} />
        </Stack>
      )}
      {taskProps?.status === 'Resolved' && <TaskFooter />}
    </Container>
  );
};
