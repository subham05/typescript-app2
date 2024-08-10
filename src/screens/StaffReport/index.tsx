import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {Container, TextView} from 'components';
import {FilterIcon} from 'components/FilterIcon';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, StyleSheet} from 'react-native';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {useGetStaffListMutation} from 'request/StaffReport';
import {StaffListNode} from 'request/StaffReport/types';
import {getFilterName} from 'screens/AttendanceSummery/utils';
import {pageInfo} from 'screens/Contacts';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
import {useAppSelector} from 'store/hooks';
import {StaffReportBottomPanelModal} from './components/BottomPanelModal';
import {StaffReportList} from './components/StaffReportList';
import {debounce} from 'lodash';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import Loader from 'components/Loader';

export type StaffReportProps = NativeStackScreenProps<SignedInStackParamList>;
export const StaffReportScreen = (props: StaffReportProps) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const [searchOption, setSearchOption] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>('');

  const [selectedTab, setSelectedTab] = useState<string>('Self');

  const [countFilter, setCountFilter] = useState<number>(2);
  const {companyId, userData} = useAppSelector(state => state?.formanagement);
  const isFocused = useIsFocused();

  const [selectedCompanies, setSelectedCompanies] = useState<Set<string>>(
    new Set<string>(),
  );
  const [selectedStaff, setSelectedStaff] = useState<masterCollectionType[]>(
    [],
  );

  const [staffArray, setStaffArray] = useState<masterCollectionType[]>([]);

  const [isPanelActive, setIsPanelActive] = useState(false);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pages, setPages] = useState<pageInfo>();
  const [reportList, setReportList] = useState<StaffListNode[]>([]);

  const openPanel = () => {
    setIsPanelActive(true);
  };

  const closePanel = () => {
    setIsPanelActive(false);
  };

  const [getReportList, {data, isSuccess, isLoading}] =
    useGetStaffListMutation();

  useEffect(() => {
    if (isFocused && companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isFocused]);

  const bodyObj = useMemo(() => {
    if (staffArray.length) {
      return {
        companyId: [...selectedCompanies],
        pageNo: pageNumber,
        staff: selectedStaff[0]?.value!,
        searchText: searchText,
      };
    }
  }, [selectedCompanies, pageNumber, staffArray, selectedStaff, searchText]);

  useEffect(() => {
    if (isFocused && bodyObj && bodyObj.companyId.length) {
      console.log('🚀 ~ file: index.tsx:108 ~ useEffect ~ bodyObj:', bodyObj);
      getReportList(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bodyObj, isFocused]);

  useEffect(() => {
    if (data && isSuccess) {
      if (pageNumber === 1) {
        setReportList(data.data.nodes);
      } else {
        setReportList(prev => prev.concat(data.data.nodes));
      }
      setPages(data.data.pageInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isSuccess]);

  const onEndReached = () => {
    if (pages?.hasNextPage) {
      setPageNumber(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (userData) {
      let filter: masterCollectionType[] = [];
      // filter.push({id: 1, name: t('filter:all'), value: 'ALL'});
      userData?.workload?.map((item, index) => {
        filter.push({id: index, name: getFilterName(item), value: item});
      });
      setStaffArray(filter);
      setSelectedStaff([filter[0]]);
    }
  }, [userData]);

  useEffect(() => {
    if (!isFocused) {
      setReportList([]);
      setPages(undefined);
      setPageNumber(1);
      selectedCompanies.clear();
      setSelectedStaff([]);
      setCountFilter(1);
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  useEffect(() => {
    if (isFocused && companyId) {
      companyId.map(({_id}) =>
        setSelectedCompanies(new Set(selectedCompanies.add(_id))),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isFocused]);

  useEffect(() => {
    setReportList([]);
    setPages(undefined);
    setPageNumber(1);
  }, [selectedCompanies, selectedStaff]);

  const renderLeftContainer = () => {
    return (
      <StackItem childrenGap={16} horizontal>
        <FilterIcon count={countFilter} onPress={() => openPanel()} />
        <IconButton
          name="search"
          size={24}
          color={colors.black}
          onPress={() => setSearchOption(!searchOption)}
          style={countFilter > 0 ? styles().searchIcon : undefined}
        />
      </StackItem>
    );
  };

  const onChange = (e: string) => {
    // just won't work, this callback is debounced
    setPageNumber(1);
    setSearchText(e.trim());
  };
  const debouncedOnChange = debounce(onChange, 2000);

  return (
    <Container noSpacing>
      <Header
        hideLabel
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />

      <Stack spaceBelow={16} style={styles(userType).staffView}>
        <StackItem
          childrenGap={5}
          spacing={16}
          horizontal
          verticalAlign="center">
          <TextView weight="semibold" variant={FontSizes.large}>
            {t('reports:staffReport')}
          </TextView>
          <Icon size={28} name="arrow_right" color={colors.black} />
          <TextView
            weight="semibold"
            variant={FontSizes.xMedium}
            truncate
            style={styles().selectedTab}>
            {selectedTab}
          </TextView>
        </StackItem>
      </Stack>
      {searchOption && (
        <Stack
          horizontal
          spacing={16}
          spaceBelow={16}
          style={styles().attachmentView}>
          <SearchTextField
            value={searchText}
            setSearchValue={val => {
              debouncedOnChange(val);
            }}
            pattern1={searchPattern1}
            pattern2={searchPattern2}
          />
        </Stack>
      )}
      <Stack spacing={16} spaceBelow={120}>
        <StaffReportList
          data={reportList}
          onPress={item =>
            props.navigation.navigate('StaffReportTask', {
              userInfo: item,
              type: 'Staff',
              onGoBack: value => {
                selectedStaff.push(value!);
                setSelectedStaff([value!]);
              },
              selectedStaff: selectedStaff[0],
            })
          }
          onEndReached={() => {
            console.log('end reached');
            onEndReached();
          }}
          scrollHandler={scrollHandler}
          isLoading={isLoading}
          pageNo={pageNumber}
        />
      </Stack>
      {isPanelActive && (
        <StaffReportBottomPanelModal
          panelState={isPanelActive}
          onPressClose={() => closePanel()}
          props={props}
          filterCount={val => setCountFilter(val)}
          onApply={val => setSelectedCompanies(val)}
          selectedCompany={selectedCompanies}
          onSelectStaff={val => {
            setSelectedStaff(val);
            setSelectedTab(val[0]?.name);
          }}
          selectedStaffs={selectedStaff}
          staffArray={staffArray}
        />
      )}
      {isLoading && pageNumber === 1 && <Loader />}
    </Container>
  );
};

const styles = (userType?: string | null) => {
  const mergeStyles = StyleSheet.create({
    heading: {
      marginTop: 15,
    },
    staffView: {
      marginLeft:
        userType === userTypes.Manager
          ? Dimensions.get('screen').width / 3.8
          : 16,
    },
    companyNameHead: {
      width: 160,
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
    searchIcon: {paddingTop: 10},
    selectedTab: {paddingTop: 1},
  });
  return mergeStyles;
};
