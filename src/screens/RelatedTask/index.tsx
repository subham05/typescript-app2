import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  getTaskListCollection,
  useMailRelatedTaskListMutation,
} from 'request/Inbox';
import {
  useChatRelatedTaskMutation,
  useGroupRelatedTaskMutation,
  useRelatedTaskListMutation,
} from 'request/ManageTask';
import {CHAT_TYPE} from 'screens/ChattingScreenFooter';
import {debounce} from 'lodash';
import {respHeight} from 'screens/Calendar/utils/responsive';

type Props = NativeStackScreenProps<SignedInStackParamList, 'RelatedTask'>;

export const RelatedTaskScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {params} = props.route;
  const {taskIds, isMail = false, isChat = false, chatType} = {...params};
  const [
    trigger,

    {
      data: relatedTaskList,
      isSuccess: isSuccessRelatedList,
      isLoading: isLoadingRelatedTaskList,
      isUninitialized: isUninitializedRelatedTaskList,
    },
  ] = useRelatedTaskListMutation();
  const [
    getRelatedTask,
    {
      data: relatedTaskData,
      isSuccess: isRelatedTaskSuccess,
      isLoading: isRelatedTaskLoading,
    },
  ] = useMailRelatedTaskListMutation();
  const [
    getChatTasks,
    {
      data: chatTaskData,
      isSuccess: isSuccessChatTask,
      isLoading: isLoadingChatTask,
    },
  ] = useChatRelatedTaskMutation();

  const [
    getGroupTasks,
    {
      data: groupTaskData,
      isSuccess: isSuccessGroupTask,
      isLoading: isLoadingGroupTask,
    },
  ] = useGroupRelatedTaskMutation();

  const isChatLoading = isLoadingChatTask || isLoadingGroupTask;
  const commonSuccess =
    isSuccessRelatedList ||
    isRelatedTaskSuccess ||
    isSuccessChatTask ||
    isSuccessGroupTask;

  const [pageNo, setPageNo] = useState<number>(1);
  const [onRefresh, setOnRefresh] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const hasNextPage = useRef<boolean>(false);
  const [relatedListState, setRelatedListState] = useState<TaskInterface[]>([]);
  const requestObj = useMemo(() => {
    return {
      pageNo: pageNo,
      taskId: taskIds!,
      searchText: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNo, taskIds, onRefresh, searchText]);
  const requestObjTask = useMemo(
    () => pageNo,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageNo, onRefresh],
  );

  const requestObjChat = useMemo(() => {
    return {
      pageNo: pageNo,
      chatId: taskIds?.[0] ?? '',
      searchText: searchText,
    };
  }, [pageNo, taskIds, searchText]);

  const requestObjGroup = useMemo(() => {
    return {
      pageNo: pageNo,
      groupId: taskIds?.[0] ?? '',
      searchText: searchText,
    };
  }, [pageNo, taskIds, searchText]);

  useEffect(() => {
    if (!isChat) {
      isMail ? getRelatedTask(requestObj) : trigger(requestObjTask);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj, requestObjTask]);

  useEffect(() => {
    if (isChat) {
      if (chatType === CHAT_TYPE.CHAT || chatType === CHAT_TYPE.PEOPLE) {
        getChatTasks(requestObjChat);
      } else {
        getGroupTasks(requestObjGroup);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObjChat, requestObjGroup]);

  useEffect(() => {
    if (!isMail && !isChat) {
      if (relatedTaskList?.data?.nodes?.length) {
        const {nodes, pageInfo} = relatedTaskList?.data;
        setRelatedListState(prev => prev.concat(nodes));
        hasNextPage.current = pageInfo?.hasNextPage;
      }
    } else if (relatedTaskData && isRelatedTaskSuccess) {
      setListingState(relatedTaskData);
    } else if (chatTaskData && isSuccessChatTask) {
      setListingState(chatTaskData);
    } else if (groupTaskData && isSuccessGroupTask) {
      setListingState(groupTaskData);
    }
    setOnRefresh(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    relatedTaskList,
    isRelatedTaskSuccess,
    chatTaskData,
    isSuccessChatTask,
    groupTaskData,
    isSuccessGroupTask,
  ]);

  const setListingState = (response: getTaskListCollection) => {
    const {data} = response;
    pageNo === 1
      ? setRelatedListState(data?.nodes!)
      : setRelatedListState(prev => prev.concat(data?.nodes!));
    hasNextPage.current = data?.pageInfo.hasNextPage!;
  };

  const onChange = (e: string) => {
    // just won't work, this callback is debounced
    setSearchText(e.trim());
    setPageNo(1);
  };

  const debouncedOnChange = debounce(onChange, 500);
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:relatedTask')}
        translateY={translateY}
      />
      {(isMail || isChat) && (
        <Stack horizontal spacing={16} style={styles().attachmentView}>
          <SearchTextField
            pattern1={searchPattern1}
            pattern2={searchPattern2}
            onSearchChange={debouncedOnChange}
            value={searchText}
          />
        </Stack>
      )}
      <Stack style={styles().eventsContainer}>
        <TaskListView
          data={relatedListState}
          onScrollHandler={scrollHandler}
          dataLength={
            relatedTaskList?.data?.nodes?.length ||
            relatedTaskData?.data?.nodes?.length! ||
            relatedListState.length
          }
          isLoading={
            pageNo > 1 && (isLoadingRelatedTaskList || isRelatedTaskLoading)
          }
          fromMail={isMail}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
            })
          }
          pageNo={() => {
            if (hasNextPage.current) {
              setPageNo(pageNo + 1);
            }
          }}
          isSuccess={commonSuccess}
          isUninitialized={isUninitializedRelatedTaskList}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNo(1);
          }}
          pageNumber={pageNo}
          customFooterStyle={styles().spacing}
        />
      </Stack>
      {(isLoadingRelatedTaskList || isRelatedTaskLoading || isChatLoading) &&
        pageNo === 1 &&
        searchText.length === 0 && <Loader />}
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
    spacing: {
      paddingBottom: respHeight(80),
    },
  });
  return mergeStyles;
};
