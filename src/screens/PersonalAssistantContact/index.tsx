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
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useLazyGetPAListQuery} from 'request/PersonalAssistant';
import {PAListNode} from 'request/PersonalAssistant/types';
import {ContactMembersList} from 'screens/OwnerContacts/components/ContactMembersList';
import {useAppSelector} from 'store/hooks';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList>;

export const PersonalAssistantContact = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);
  const {netStatus} = useContext(NetworkContext);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [loader, setLoader] = useState<boolean>(false);
  const [isUnMounting, setIsUnmounting] = useState<boolean>(false);
  const {companyId} = useAppSelector(state => state?.formanagement);

  const [assistantList, setPAList] = useState<PAListNode[]>([]);
  const lastPageNumber = useRef<number>(1);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [
    getPA,
    {
      data: paListData,
      isLoading: paListLoading,
      isSuccess: paListSuccess,
      isFetching: paListFetching,
    },
  ] = useLazyGetPAListQuery();

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
            ((pageNumber === 1 && assistantList.length <= 10) ||
              searchText.trim()) &&
            setLoader(true);
          const companyIdList: string[] = [];
          companyId.map(company => companyIdList.push(`${company._id}`));
          getPA({
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
    if (paListData && paListSuccess) {
      const {nodes, pageInfo} = paListData;
      const managerListTemp =
        pageNumber !== 1 ? assistantList.concat(nodes) : nodes;
      setPAList(managerListTemp);
      lastPageNumber.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
      pageNumber === 1 && setLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paListData]);

  const getRefresh = (value = false) => {
    if (value) {
      setPageNumber(1);
      setIsRefreshing(true);
      pageNumber === 1 && setIsRefreshing(false);
    } else {
      lastPageNumber.current > pageNumber &&
        !paListFetching &&
        assistantList.length >= 10 &&
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
        label={t('drawer:personalAssistant')}
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          // pattern1={/[~`!@#$%^&*+=[\]\\;,_©®™✓°¥€¢£√π÷¶•∆/{}()|\\":<>?]/}
          // pattern2={/^[ A-Za-z0-9.'-]*$/}
          // eslint-disable-next-line no-empty-character-class
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
          data={assistantList}
          searchText={searchText.length}
          isLoading={paListLoading || loader}
          isFetching={paListFetching}
          pageNo={pageNumber}
          refreshing={isRefreshing}
          getRefresh={value => getRefresh(value)}
          onPress={data => {
            props.navigation.navigate('GeneralManagerContactsDetailsScreen', {
              data: data,
              userType: 'PA',
            });
          }}
        />
      </Stack>
    </Container>
  );
};
