import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {SearchTextField} from 'components/TextField';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {ContactMembersList} from './components/ContactMembersList';
import {Styles} from './index.styles';
import {TouchableOpacity} from 'react-native';
import {FontSizes} from 'common/theme/font';
import {colors} from 'common/theme/colors';
import {useAppSelector} from 'store/hooks';
import {Icon} from 'components/Icon';
import {useLazyGetOwnersQuery} from 'request/AddOwner';
import {NetworkContext} from 'components/NetworkProvider';
import {showToast} from 'common/utils/ToastMessage';
import {managerListNode} from 'request/AddManager/constant';
import {useFocusEffect} from '@react-navigation/core';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const OwnerContactsScreen = (props: Props) => {
  const {t} = useTranslation();
  const {netStatus} = useContext(NetworkContext);
  const translateY = useSharedValue(0);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isUnMounting, setIsUnmounting] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [ownerList, setOwnerList] = useState<managerListNode[]>([]);
  const {companyId} = useAppSelector(state => state?.formanagement);
  const lastPageNumber = useRef<number>(1);

  const [
    getOwnerList,
    {
      data: ownerListData,
      isSuccess: isOwnerListSuccess,
      isLoading: isOwnerLoading,
      isFetching: isOwnerListFetching,
    },
  ] = useLazyGetOwnersQuery();
  const styles = Styles();

  const bodyObj = useMemo(() => {
    const companyIdList: string[] = [];
    companyId.map(company => companyIdList.push(`${company._id}`));
    return {
      companies: companyIdList,
      searchValue: searchText.trim(),
      pageNo: pageNumber,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchText, companyId, isUnMounting]);

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
            ((pageNumber === 1 && ownerList.length <= 10) ||
              searchText.trim()) &&
            setLoader(true);
          getOwnerList(bodyObj);
        }
      } else {
        showToast('No Network, please try again');
        setLoader(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bodyObj]),
  );

  useEffect(() => {
    if (ownerListData && isOwnerListSuccess) {
      const {nodes, pageInfo} = ownerListData;
      const ownerListTemp = pageNumber !== 1 ? ownerList.concat(nodes) : nodes;
      setOwnerList(ownerListTemp);
      lastPageNumber.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
      pageNumber === 1 && setLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ownerListData]);
  const renderLeftContainer = () => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate('SelectCompany', {
            onGoBack: () => {
              setIsRefreshing(false);
              setIsUnmounting(false);
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
  const getRefresh = (value = false) => {
    if (value) {
      setPageNumber(1);
      setIsRefreshing(true);
      pageNumber === 1 && setIsRefreshing(false);
    } else {
      lastPageNumber.current > pageNumber &&
        !isOwnerListFetching &&
        ownerList.length >= 10 &&
        setPageNumber(pageNumber + 1);
    }
  };
  return (
    <Container noSpacing>
      <Header
        label={t('drawer:owner')}
        translateY={translateY}
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
          data={ownerList}
          searchText={searchText.length}
          isLoading={isOwnerLoading || loader}
          isFetching={isOwnerListFetching}
          pageNo={pageNumber}
          refreshing={isRefreshing}
          getRefresh={value => getRefresh(value)}
          onPress={data => {
            props.navigation.navigate('ManagerContactDetails', {
              data: data,
              userType: 'owner',
            });
          }}
        />
      </Stack>
    </Container>
  );
};
