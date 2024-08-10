/* eslint-disable react-hooks/rules-of-hooks */
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import {TaskInterface} from 'components/Task/TaskItem';
import {TaskListView} from 'components/Task/TaskListView';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useWorkloadDetailMutation} from 'request/WorkloadReport';
import {Styles} from './index.styles';
import Loader from 'components/Loader';
import {pageInfo} from 'screens/Contacts';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {debounce} from 'lodash';
import {useStaffDetailMutation} from 'request/StaffReport';

type Props = NativeStackScreenProps<SignedInStackParamList, 'StaffReportTask'>;
export const StaffReportTaskScreen = (props: Props) => {
  const {t} = useTranslation();

  const {route, navigation} = {...props};
  const {userInfo, type, onGoBack, selectedStaff} = {
    ...route.params,
  };

  const [searchOption, setSearchOption] = useState<boolean>(false);
  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [taskData, setTaskData] = useState<TaskInterface[]>([]);
  const [onRefresh, setOnRefresh] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [searchText, setSearchText] = useState<string>('');

  const [getTaskData, {data, isSuccess, isLoading}] =
    type === 'Workload'
      ? useWorkloadDetailMutation()
      : useStaffDetailMutation();

  const bodyObj = useMemo(() => {
    return {
      userId: userInfo?._id!,
      searchText: searchText,
      pageNo: pageNumber,
    };
  }, [userInfo, pageNumber, searchText]);

  useEffect(() => {
    getTaskData(bodyObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj]);

  const resetValues = () => {
    setTaskData([]);
    setPageNumber(1);
  };

  useEffect(() => {
    if (onRefresh) {
      resetValues();
      getTaskData(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefresh]);

  useEffect(() => {
    resetValues();
  }, [searchText]);

  useEffect(() => {
    if (data && isSuccess) {
      setTaskData(prev => prev.concat(data.data.nodes));
      setPages(data.data.pageInfo);
      setOnRefresh(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderLeftContainer = () => {
    return (
      <IconButton
        name="search"
        size={24}
        color={colors.black}
        onPress={() => setSearchOption(!searchOption)}
      />
    );
  };

  const onEndReached = () => {
    if (pages?.hasNextPage && !isLoading) {
      setPageNumber(prev => prev + 1);
    }
  };

  const styles = Styles();

  const setSearchValue = (val: string) => {
    setSearchText(val.trim());
  };

  const debounceOnChange = debounce(setSearchValue, 600);

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        hideLabel
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
        preventDefault
        onBackPress={() => {
          onGoBack?.(selectedStaff!);
          navigation.goBack();
        }}
      />
      {isLoading && pageNumber === 1 && <Loader />}
      <StackItem childrenGap={5} spacing={16} horizontal verticalAlign="center">
        <TextView weight="medium" variant={FontSizes.large}>
          {type === 'Workload'
            ? t('reports:workloadReport')
            : t('reports:staffReport')}
        </TextView>
        <Icon size={28} name="arrow_right" color={colors.black} />
        <TextView
          weight="semibold"
          variant={FontSizes.xMedium}
          truncate
          style={{width: globalScreenWidth / 2.1}}>
          {userInfo?.name}
        </TextView>
      </StackItem>
      {searchOption && (
        <Stack spacing={16} style={styles.attachmentView}>
          <SearchTextField
            setSearchValue={debounceOnChange}
            pattern1={searchPattern1}
            pattern2={searchPattern2}
          />
        </Stack>
      )}

      <Stack style={styles.eventsContainer}>
        <TaskListView
          data={taskData}
          manage
          onPress={value =>
            props.navigation.navigate('TaskDetails', {
              taskId: value,
              hideButtons: true,
              vendors: true,
            })
          }
          onScrollHandler={scrollHandler}
          pageNo={onEndReached}
          isLoading={isLoading}
          pageNumber={pageNumber}
          onRefresh={() => {
            setOnRefresh(true);
            setPageNumber(1);
          }}
        />
      </Stack>
    </Container>
  );
};
