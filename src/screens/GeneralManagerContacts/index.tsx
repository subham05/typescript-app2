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
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {ContactMembersList} from 'screens/OwnerContacts/components/ContactMembersList';
import {Styles} from '../ManagerContacts/index.styles';
import {TouchableOpacity} from 'react-native';
import {FontSizes} from 'common/theme/font';
import {Icon} from 'components/Icon';
import {colors} from 'common/theme/colors';
import {managerListNode} from 'request/AddManager/constant';
import {NetworkContext} from 'components/NetworkProvider';
import {showToast} from 'common/utils/ToastMessage';
import {useFocusEffect} from '@react-navigation/native';
import {useAppSelector} from 'store/hooks';
import {useLazyGetGeneralManagersQuery} from 'request/AddGeneralManager';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const GeneralManagerContactsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);
  const {netStatus} = useContext(NetworkContext);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isUnMounting, setIsUnmounting] = useState<boolean>(false);
  const {companyId} = useAppSelector(state => state?.formanagement);
  const [generalManagerList, setGeneralManagerList] = useState<
    managerListNode[]
  >([]);
  const lastPageNumber = useRef<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [
    getGeneralManager,
    {
      data: GMListData,
      isLoading: GMListLoading,
      isSuccess: GMListSuccess,
      isFetching: GMListFetching,
    },
  ] = useLazyGetGeneralManagersQuery();

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
            ((pageNumber === 1 && generalManagerList.length <= 10) ||
              searchText.trim()) &&
            setLoader(true);
          const companyIdList: string[] = [];
          companyId.map(company => companyIdList.push(`${company._id}`));
          getGeneralManager({
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
    if (GMListData && GMListSuccess) {
      const {nodes, pageInfo} = GMListData;
      const generalManagerListTemp =
        pageNumber !== 1 ? generalManagerList.concat(nodes) : nodes;
      setGeneralManagerList(generalManagerListTemp);
      lastPageNumber.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
      pageNumber === 1 && setLoader(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GMListData]);

  const getRefresh = (value = false) => {
    if (value) {
      setPageNumber(1);
      setIsRefreshing(true);
      pageNumber === 1 && setIsRefreshing(false);
    } else {
      lastPageNumber.current > pageNumber &&
        !GMListFetching &&
        generalManagerList.length >= 10 &&
        setPageNumber(pageNumber + 1);
    }
  };

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
              ? t('addGeneralManager:allSelectedCompany')
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
        label={t('drawer:generalManager')}
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
          data={generalManagerList}
          searchText={searchText.length}
          isLoading={GMListLoading || loader}
          isFetching={GMListFetching}
          pageNo={pageNumber}
          refreshing={isRefreshing}
          getRefresh={value => getRefresh(value)}
          onPress={data => {
            props.navigation.navigate('GeneralManagerContactsDetailsScreen', {
              data: data,
              userType: 'GM',
            });
          }}
        />
      </Stack>
    </Container>
  );
};
