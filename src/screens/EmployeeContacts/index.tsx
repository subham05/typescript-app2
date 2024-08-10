import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container, TextView} from 'components';
import {SearchTextField} from 'components/TextField';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {ContactMembersList} from 'screens/OwnerContacts/components/ContactMembersList';
import {Styles} from './index.styles';
import {TouchableOpacity} from 'react-native';
import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {colors} from 'common/theme/colors';
// import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {managerListNode} from 'request/AddManager/constant';
import {NetworkContext} from 'components/NetworkProvider';
import {showToast} from 'common/utils/ToastMessage';
// import {useGetCompanyCollectionQuery} from 'request/AddTask';
import {useFocusEffect} from '@react-navigation/native';
// import {CompanyListResponseProps} from 'request/CompanyList';
import {useAppSelector} from 'store/hooks';
import Header from 'components/Header';
import {useLazyGetEmployeeQuery} from 'request/AddEmployee';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const EmployeeContactScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);
  const {netStatus} = useContext(NetworkContext);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isUnMounting, setIsUnmounting] = useState<boolean>(false);
  const {companyId} = useAppSelector(state => state?.formanagement);
  const [employeeList, setEmployeeList] = useState<managerListNode[]>([]);
  const lastPageNumber = useRef<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [
    getEmployee,
    {
      data: employeeListData,
      isLoading: employeeListLoading,
      isSuccess: employeeListSuccess,
      isFetching: employeeListFetching,
    },
  ] = useLazyGetEmployeeQuery();

  const styles = Styles();
  useFocusEffect(
    useCallback(() => {
      setIsUnmounting(false);
      setIsRefreshing(false);
      return () => {
        setIsUnmounting(true);
        setSearchText('');
        setLoader(false);
        setPageNumber(1);
      };
    }, []),
  );
  useFocusEffect(
    useCallback(() => {
      if (netStatus) {
        if (companyId) {
          !isUnMounting &&
            ((pageNumber === 1 && employeeList.length <= 10) ||
              searchText.trim()) &&
            setLoader(true);
          const companyIdList: string[] = [];
          companyId.map(company => companyIdList.push(`${company._id}`));
          getEmployee({
            companies: companyIdList,
            searchValue: searchText.trim(),
            pageNo: pageNumber,
          });
        }
      } else {
        showToast('No Network, please try again');
        setLoader(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, searchText, netStatus, companyId, isUnMounting]),
  );
  useEffect(() => {
    if (employeeListData && employeeListSuccess) {
      const {nodes, pageInfo} = employeeListData;
      const employeeTemp =
        pageNumber !== 1 ? employeeList.concat(nodes) : nodes;
      setEmployeeList(employeeTemp);
      lastPageNumber.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
      pageNumber === 1 && setLoader(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employeeListData]);

  const getRefresh = (value = false) => {
    if (value) {
      setPageNumber(1);
      setIsRefreshing(true);
      pageNumber === 1 && setIsRefreshing(false);
    } else {
      lastPageNumber.current > pageNumber &&
        !employeeListFetching &&
        employeeList.length >= 10 &&
        setPageNumber(pageNumber + 1);
    }
  };

  const renderLeftContainer = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('SelectCompany', {
            // companyList: companyResponse,
            // selectedCompanyItem: selectedCompany,
            onGoBack: () => {
              setIsRefreshing(false);
              setIsUnmounting(false);
              // setSelectedCompany(companyId);
              setPageNumber(1);
            },
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
    );
  };
  return (
    <Container
      noSpacing
      onRetry={() => {
        setPageNumber(1);
      }}>
      <Header
        label={t('drawer:employee')}
        translateY={translateY}
        // navigationType="STACK"
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          pattern1={/[]/}
          pattern2={
            /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
          }
          onSearchChange={value => {
            setPageNumber(1);
            setSearchText(value);
          }}
        />
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <ContactMembersList
          data={employeeList}
          searchText={searchText.length}
          isLoading={employeeListLoading || loader}
          isFetching={employeeListFetching}
          pageNo={pageNumber}
          refreshing={isRefreshing}
          getRefresh={value => getRefresh(value)}
          onPress={data => {
            props.navigation.navigate('ManagerContactDetails', {
              data: data,
              userType: 'employee',
            });
          }}
        />
      </Stack>
    </Container>
  );
};
