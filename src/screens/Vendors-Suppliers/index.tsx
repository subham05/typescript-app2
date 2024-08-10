import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {NetworkContext} from 'components/NetworkProvider';
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
import {StyleSheet, TouchableOpacity} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {managerListNode} from 'request/AddManager/constant';
import {useLazyGetVendorsQuery} from 'request/AddVendor';
import {useAppSelector} from 'store/hooks';
import {VendorSuppliersList} from './components/Vendors-SuppliersList';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const VendorsSuppliersScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const {companyId} = useAppSelector(state => state?.formanagement);

  const {netStatus} = useContext(NetworkContext);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loader, setLoader] = useState<boolean>(false);
  const [isUnMounting, setIsUnmounting] = useState<boolean>(false);
  const [managerList, setManagerList] = useState<managerListNode[]>([]);
  const lastPageNumber = useRef<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [
    getManager,
    {
      data: managerListData,
      isLoading: managerListLoading,
      isSuccess: managerListSuccess,
      isFetching: managerListFetching,
    },
  ] = useLazyGetVendorsQuery();

  useFocusEffect(
    useCallback(() => {
      setIsUnmounting(false);
      setIsRefreshing(false);
      return () => {
        setIsUnmounting(true);
        setLoader(false);
        setPageNumber(1);
      };
    }, []),
  );

  useEffect(() => {
    if (netStatus) {
      if (companyId) {
        !isUnMounting &&
          pageNumber === 1 &&
          managerList.length <= 10 &&
          setLoader(true);
        const companyIdList: string[] = [];
        companyId.map(company => companyIdList.push(`${company._id}`));
        getManager({
          companies: companyIdList,
          pageNo: pageNumber,
        });
      }
    } else {
      showToast('No Network, please try again');
      setLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, netStatus, companyId, isUnMounting]);
  useEffect(() => {
    if (managerListData && managerListSuccess) {
      const {nodes, pageInfo} = managerListData;
      const managerListTemp =
        pageNumber !== 1 ? managerList.concat(nodes) : nodes;
      setManagerList(managerListTemp);
      lastPageNumber.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
      pageNumber === 1 && setLoader(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // companyResponse,
    managerListData,
  ]);

  const getRefresh = (value = false) => {
    if (value) {
      setPageNumber(1);
      setIsRefreshing(true);
      pageNumber === 1 && setIsRefreshing(false);
    } else {
      lastPageNumber.current > pageNumber &&
        !managerListFetching &&
        managerList.length >= 10 &&
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
        label={t('vendors:head')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack spacing={23} spaceBelow={16}>
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.rtlView}>
          {t('vendors:title')}
        </TextView>
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <VendorSuppliersList
          data={managerList}
          isLoading={managerListLoading || loader}
          isFetching={managerListFetching}
          pageNo={pageNumber}
          refreshing={isRefreshing}
          getRefresh={value => getRefresh(value)}
          onPress={data => {
            props.navigation.navigate('VendorDetails', {
              data: data,
            });
          }}
        />
      </Stack>
    </Container>
  );
};

const styles = StyleSheet.create({
  company: {marginTop: 0},
  companyNameHead: {
    width: 160,
  },
  companyName: {
    maxWidth: 160,
  },
  rtlView: {textAlign: 'left'},
});
