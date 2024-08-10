import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import {RippleIconButton} from 'components/IconButtons';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SearchTextField} from 'components/TextField';
import {BottomNavParamList} from 'navigation/Stacks/MainTabNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import // useAnimatedScrollHandler,

// useSharedValue,
'react-native-reanimated';
import {useGetManageTaskCollectionMutation} from 'request/ManageTask';

// import {taskData} from 'screens/Home/mockData';

type Props = CompositeScreenProps<
  BottomTabScreenProps<BottomNavParamList, 'ManageTask'>,
  NativeStackScreenProps<SignedInStackParamList, 'DrawerNavigation'>
>;
export const SearchManageTaskScreen = (props: Props) => {
  // const {t} = useTranslation();

  // const translateY = useSharedValue(0);

  // const scrollHandler = useAnimatedScrollHandler(event => {
  //   translateY.value = event.contentOffset.y;
  // });
  const [
    fetchAllTask,
    {
      data: manageTaskDataList,
      isLoading: isLoadingManageTask,
      isSuccess: isSuccessTaskList,
      // error,
    },
  ] = useGetManageTaskCollectionMutation();
  const [pageNo, setPageNo] = useState<number>(1);
  const [taskListState, setTaskListState] = useState<TaskInterface[]>([]);
  const [searchText, setSearchText] = useState('');
  const [onRefresh, setOnRefresh] = useState(false);
  const timeout = useRef<number>(0);

  const bodyObj = useMemo(() => {
    return {
      companyId: props?.route?.params?.companyId?.map(({_id}) => _id),
      searchText: searchText,
      type: [],
      priority: [],
      status: [],
      from: '',
      to: '',
      pageNo: pageNo,
    };
  }, [pageNo, searchText, props]);

  useEffect(() => {
    setTaskListState([]);
    setPageNo(1);
    clearTimeout(timeout.current!);
    if (bodyObj.searchText.length) {
      timeout.current = setTimeout(() => {
        fetchAllTask(bodyObj);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj]);

  useEffect(() => {
    if (onRefresh) {
      setTaskListState([]);
      fetchAllTask(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj, onRefresh]);

  useEffect(() => {
    if (manageTaskDataList?.data.nodes.length) {
      setTaskListState(prev => prev.concat(manageTaskDataList?.data.nodes));
    }
    setOnRefresh(false);
  }, [manageTaskDataList]);

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
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
          placeholder="searchTask"
          removeIcon
          autoFocus={true}
        />
      </Stack>
      {/* <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}> */}
      <Stack spacing={16} spaceBelow={100}>
        <TaskListView
          data={taskListState}
          dataLength={manageTaskDataList?.data.nodes.length}
          isLoading={pageNo > 1 && isLoadingManageTask}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (manageTaskDataList?.data.pageInfo.hasNextPage) {
              setPageNo(prev => prev + 1);
            }
          }}
          isSuccess={isSuccessTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
        />
      </Stack>
      {/* {isLoadingManageTask && pageNo === 1 && !searchText.length && <Loader />} */}
      {/* </Animated.ScrollView> */}
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
