import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import {RippleIconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import {TaskListView} from 'components/Task/TaskListView';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {taskData} from 'screens/Home/mockData';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'ManageTask'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;
export const SearchManageTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [search, setSearch] = useState<string>('');

  return (
    <Container noSpacing>
      {/* <Header
        translateY={translateY}
        RenderMainContainer={renderMainContainer}
        RenderLeftContainer={renderLeftContainer}
      /> */}
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles().attachmentView}>
        <Stack style={styles().attachmentIcon}>
          <RippleIconButton
            name="arrow_back"
            size={22}
            color={colors.black}
            onPress={() => props.navigation.goBack()}
          />
        </Stack>
        <SearchTextField
          placeholder={t('manageTask:searchPlaceholder')}
          onChangeText={setSearch}
          value={search}
          isSearchIconRemove
          backIcon
        />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={100}>
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
    </Container>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    attachmentView: {
      backgroundColor: colors.white,
      marginBottom: 16,
      marginRight: 16,
      marginTop: 20,
      borderRadius: 3,
    },
    attachmentIcon: {
      justifyContent: 'center',
      marginLeft: 10,
    },
  });
  return mergeStyles;
};
