import {useFocusEffect} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Loader from 'components/Loader';
import {CompanyListView} from 'components/SelectCompany/CompanyListView';
import {CompanySearch} from 'components/SelectCompany/CompanySearch';
import {Stack} from 'components/Stack';
import {NavContext} from 'navigation/router';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, KeyboardAvoidingView, Platform} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {
  CompanyListResponseProps,
  CompanySelectionBody,
  useCompanyListingMutation,
  useCompanySelectionMutation,
} from 'request/CompanyList';
import {useAppDispatch, useAppSelector} from 'store/hooks';
import {setCompanyIdAction} from 'store/Reducer';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'SelectCompany'>;

export const InitialSelectCompanyScreen = (props: Props) => {
  const {t} = useTranslation();

  const {saveSelectCompany} = useContext(NavContext);
  const translateY = useSharedValue(0);
  const dispatch = useAppDispatch();
  const {companyId} = useAppSelector(state => state.formanagement);
  const [searchText, setSearchText] = useState('');
  const [isDone, setIsDone] = useState(false);

  // const {
  //   data: companyData,
  //   isLoading: isLoadingCompanyData,
  //   // error: companyError,
  // } = useCompanyListQuery();

  const [
    getCompanies,
    {
      data: companyData,
      isLoading: isLoadingCompanyData,
      // error: companyError,
    },
  ] = useCompanyListingMutation();

  const [
    companySelected,
    {
      isLoading: isLoadingCompanySelected,
      isError: isErrorCompanySelected,
      isSuccess: isSuccessCompanySelected,
      error: companySelectedError,
      // data: companySelectedData,
    },
  ] = useCompanySelectionMutation();

  // useEffect(() => {
  //   getCompanies();
  // }, [getCompanies]);

  useFocusEffect(
    useCallback(() => {
      getCompanies();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    if (companyId?.length && isDone) {
      saveSelectCompany();
    } else if (!companyId?.length && isDone) {
      showToast('Please select at least one company');
      setIsDone(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, isDone]);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  console.log('checkkkk-->', companyData?.data);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  // const defaultCompany: CompanyProps[] = [
  //   {
  //     _id: '1',
  //     name: 'Google',
  //     address: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
  //   },
  // ];

  const [selectedCompany, setSelectedCompany] =
    useState<CompanyListResponseProps[]>(companyId);

  useEffect(() => {
    if (isSuccessCompanySelected) {
      dispatch(setCompanyIdAction(selectedCompany!));
      // saveSelectCompany();
      setIsDone(true);
    } else if (isErrorCompanySelected) {
      // showToast(JSON.stringify(AcceptTaskError));
    }
  }, [
    companySelectedError,
    dispatch,
    isErrorCompanySelected,
    isSuccessCompanySelected,
    selectedCompany,
  ]);
  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.flex}>
        <KeyboardAvoidingView
          behavior="height"
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
          <Stack spacing={16} spaceBelow={16} style={styles.head}>
            <TextView weight="semibold" variant={FontSizes.xlarge}>
              {t('selectCompany:head')}
            </TextView>
          </Stack>
          {/* <Header
            label={t('selectCompany:head')}
            navigationType="STACK"
            translateY={translateY}
          /> */}
          <CompanySearch
            initial
            searchText={text => setSearchText?.(text.trim())}
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            {/* <SelectAllCompany
          selectedAll={isAllSelected}
          onPress={setIsAllSelected}
        /> */}
            <Stack style={styles.companiesContainer}>
              <CompanyListView
                data={companyData?.data.filter(item =>
                  item?.name.toLowerCase().includes(searchText.toLowerCase()),
                )}
                props={props}
                isLoading={isLoadingCompanyData}
                isAllSelected={isAllSelected}
                onSelectCompany={setIsAllSelected}
                selectedCompany={selectedCompany!}
                onPress={company => setSelectedCompany([company])}
              />
            </Stack>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        <Stack style={{height: Dimensions.get('screen').height * 0.07}}>
          <Stack spacing={16} spaceBelow={16}>
            {companyData!?.data?.length > 0 ? (
              <PrimaryButton
                title={t('selectCompany:done')}
                onPress={() => {
                  if (selectedCompany!?.length > 0) {
                    let bodyObj: CompanySelectionBody = {
                      companyId: selectedCompany![0]?._id,
                    };
                    companySelected(bodyObj);
                  } else {
                    showToast('Please select at least one company');
                  }
                }}
              />
            ) : (
              <PrimaryButton
                title={t('selectCompany:AddCompany')}
                onPress={() => {
                  props.navigation.navigate('AddCompany');
                  // if (selectedCompany!?.length > 0) {
                  //   let bodyObj: CompanySelectionBody = {
                  //     companyId: selectedCompany![0]?._id,
                  //   };
                  //   companySelected(bodyObj);
                  // } else {
                  //   showToast('Please select at least one company');
                  // }
                }}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
      {/* {!hideButton && (
        <Stack spacing={16} spaceBelow={16}>
          <PrimaryButton
            title={t('selectCompany:done')}
            onPress={saveSelectCompany}
          />
        </Stack>
      )} */}
      {(isLoadingCompanyData || isLoadingCompanySelected) && <Loader />}
    </Container>
  );
};
