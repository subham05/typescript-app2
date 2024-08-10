import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {SearchTextField} from 'components/TextField';
import moment from 'moment';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useGetAttendanceListMutation} from 'request/AttendanceReport';
import {
  attendanceListData,
  attendanceRequestData,
  dateNavFlags,
} from 'request/AttendanceReport/types';
import {pageInfo} from 'screens/Contacts';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {AttendanceList} from './components/AttendanceList';
import Filter, {filterData} from './components/Filter';
import {Styles} from './index.styles';
import {getFilterName} from './utils';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const AttendanceSummeryScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const [hrManager, setHRManager] = useState(false);

  const [attendanceList, setAttendanceList] = useState<attendanceListData[]>(
    [],
  );

  const [selectedDate, setSelectedDate] = useState<string>(
    moment().toISOString(),
  );
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [filterOptions, setFilterOptions] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string[]>([]);
  const [navigationArrows, setNavigationArrows] = useState<dateNavFlags>();
  const [searchText, setSearchText] = useState<string>('');
  const [pages, setPages] = useState<pageInfo>();
  const [refresh, setRefresh] = useState<boolean>(false);
  const timeout = useRef<number>(0);

  const [getAttendanceListing, {isSuccess, data, isLoading}] =
    useGetAttendanceListMutation();

  const reqBody = useMemo(() => {
    let selectedCompanies: string[] = [];
    companyId.map(({_id}) => selectedCompanies.push(_id));
    return {
      companyId: selectedCompanies,
      year: moment(selectedDate).format('YYYY'),
      month: moment(selectedDate).format('MMMM'),
      date: selectedDate,
      role: selectedRole,
      searchText: searchText,
      pageNo: pageNumber,
    };
  }, [companyId, pageNumber, selectedDate, selectedRole, searchText]);

  useEffect(() => {
    if (!refresh) {
      clearTimeout(timeout.current!);
      timeout.current = setTimeout(() => {
        getAttendanceListing(reqBody);
      }, 500);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqBody]);

  useEffect(() => {
    if (refresh) {
      getAttendanceListing(reqBody);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);

  useEffect(() => {
    setAttendanceList([]);
    setPageNumber(1);
  }, [searchText, companyId]);

  useEffect(() => {
    if (userData?.attendanceFilter) {
      setFilterOptions(userData.attendanceFilter);
    }
  }, [userData]);

  const setFilter = (user: string) => {
    let tempRoles: string[] = [];
    const isPresent = selectedRole.includes(user);
    if (!isPresent) {
      tempRoles.push(user);
    }
    setPageNumber(1);
    setAttendanceList([]);
    setSelectedRole(tempRoles);
  };

  const filter: filterData[] = filterOptions.map(item => ({
    label: getFilterName(item),
    value: item,
    onClick: (user: string) => setFilter(user),
  }));

  useEffect(() => {
    if (isSuccess && data) {
      setAttendanceList(prev => prev.concat(data.data.nodes));
      setNavigationArrows(data.data.navigationFlags);
      setPages(data.data.pageInfo);
      setRefresh(false);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    getLoginData();
  }, []);

  const getLoginData = async () => {
    let loginData: any = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    loginData = JSON.parse(loginData!);
    const isHRManager = loginData?.isHrManager;
    setHRManager(isHRManager);
  };

  const menuData: MenuModel[] = [
    {
      name: t('attendance:configure'),
      onClick: () => {
        navigation.navigate('AttendanceReportConfiguration');
      },
      icon: 'configure',
    },
  ];

  const prevMonth = () => {
    setPageNumber(1);
    setAttendanceList([]);
    setSelectedDate(moment(selectedDate).subtract(1, 'month').toISOString());
  };
  const nextMonth = () => {
    setPageNumber(1);
    setAttendanceList([]);
    setSelectedDate(moment(selectedDate).add(1, 'month').toISOString());
  };

  const onEndReached = () => {
    if (pages?.hasNextPage) {
      setPageNumber(prev => prev + 1);
    }
  };

  const navigateToDetail = (item: attendanceListData) => {
    let selectedCompanies: string[] = [];
    companyId.map(({_id}) => selectedCompanies.push(_id));
    const obj: attendanceRequestData = {
      companyId: selectedCompanies,
      date: selectedDate,
    };
    navigation.navigate('AttendanceReport', {
      data: item,
      requestData: obj,
    });
  };

  const renderLeftContainer = () => {
    return (
      <Stack horizontal childrenGap={10} center style={styles.leftContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SelectCompany', {
              allSelect: true,
              onGoBack: () => {},
            })
          }>
          <Stack horizontal verticalAlign="center">
            <TextView
              weight="medium"
              variant={FontSizes.medium}
              numberOfLines={1}
              style={styles.companyName}>
              {companyId?.length > 1
                ? t('addManager:allSelectedCompany')
                : companyId![0]?.name}
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        <Filter
          icon={'filter'}
          data={filter}
          selectedRole={selectedRole}
          showLeaveRequest={hrManager}
          onClickLeaveRequest={() => {
            navigation.navigate('LeaveRequest');
          }}
        />
        {hrManager && <PopupMenu data={menuData} height={74} width={140} />}
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        hideLabel
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      {isLoading && pageNumber === 1 && <Loader />}
      <Stack
        spacing={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.head}
        center>
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {t('attendance:head')}
        </TextView>
        <Stack horizontal childrenGap={10} center>
          {navigationArrows?.previous && (
            <Stack center style={styles.icon}>
              <IconButton
                name="arrow_left"
                size={16}
                color={colors.black}
                onPress={prevMonth}
              />
            </Stack>
          )}
          <TextView weight="semibold" variant={FontSizes.regular}>
            {moment(selectedDate).format(DateTimeFormats.monthYear)}
          </TextView>
          {navigationArrows?.next && (
            <Stack center style={styles.icon}>
              <IconButton
                name="arrow_right"
                size={16}
                color={colors.black}
                onPress={nextMonth}
              />
            </Stack>
          )}
        </Stack>
      </Stack>
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={searchPattern1}
          pattern2={searchPattern2}
        />
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <AttendanceList
          data={attendanceList}
          onPress={navigateToDetail}
          scrollHandler={scrollHandler}
          onEndReached={onEndReached}
          isLoading={isLoading}
          pageNumber={pageNumber}
          onRefresh={() => {
            setPageNumber(1);
            setAttendanceList([]);
            setRefresh(true);
          }}
        />
      </Stack>
    </Container>
  );
};
