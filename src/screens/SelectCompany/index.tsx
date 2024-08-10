import {useFocusEffect} from '@react-navigation/core';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {showToast} from 'common/utils/ToastMessage';
import {Container} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {CompanyListView} from 'components/SelectCompany/CompanyListView';
import {CompanySearch} from 'components/SelectCompany/CompanySearch';
import {SelectAllCompany} from 'components/SelectCompany/SelectAllCompany';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useState} from 'react';
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
import {setCompanyIdAction, setInviteeMembers} from 'store/Reducer';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'SelectCompany'>;

export const SelectCompanyScreen = (props: Props) => {
  const {t} = useTranslation();
  const dispatch = useAppDispatch();
  const {companyId} = useAppSelector(state => state.formanagement);

  useFocusEffect(
    useCallback(() => {
      setSelectedCompany(companyId);
    }, [companyId]),
  );

  const {route} = {...props};
  const {allSelect, onGoBack} = {
    ...route.params,
  };

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [searchText, setSearchText] = useState('');

  const [getCompanies, {data: companyData, isLoading: isLoadingCompanyData}] =
    useCompanyListingMutation();

  const [
    companySelected,
    {
      isLoading: isLoadingCompanySelected,
      isError: isErrorCompanySelected,
      isSuccess: isSuccessCompanySelected,
      error: companySelectedError,
    },
  ] = useCompanySelectionMutation();

  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  useEffect(() => {
    let isExist = false;
    companyData?.data.map(item =>
      companyId.map((ele, eleIndex) => {
        if (ele?._id === item?._id) {
          isExist = true;
        } else if (
          ele?._id !== item?._id &&
          eleIndex === companyId.length - 1
        ) {
          isExist = false;
        }
      }),
    );
    if (isExist) {
      setIsAllSelected(true);
    }
  }, [companyData, companyId]);

  const [selectedCompany, setSelectedCompany] = useState<
    CompanyListResponseProps[] | undefined
  >(companyId);
  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  useEffect(() => {
    if (isSuccessCompanySelected) {
      dispatch(setCompanyIdAction(selectedCompany!));
      dispatch(setInviteeMembers([]));
      onGoBack?.();
      props.navigation.goBack();
    } else if (isErrorCompanySelected) {
    }
  }, [
    companySelectedError,
    dispatch,
    isErrorCompanySelected,
    isSuccessCompanySelected,
    onGoBack,
    props.navigation,
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
          <Header
            label={t('selectCompany:head')}
            navigationType="STACK"
            translateY={translateY}
          />
          <CompanySearch searchText={text => setSearchText(text.trim())} />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            {!allSelect &&
            companyData?.data.filter(item => item?.name.includes(searchText))
              .length ? (
              <SelectAllCompany
                selectedAll={isAllSelected}
                onPress={val => {
                  setIsAllSelected(val);
                  if (val) {
                    companyData?.data.length! > 0 &&
                      setSelectedCompany(
                        companyData?.data.filter(item =>
                          item?.name.includes(searchText),
                        ),
                      );
                  } else {
                    setSelectedCompany([companyId[0]]);
                  }
                }}
              />
            ) : (
              <></>
            )}
            <Stack style={styles.companiesContainer}>
              <CompanyListView
                data={companyData?.data.filter(item =>
                  item?.name.toLowerCase().includes(searchText.toLowerCase()),
                )}
                isLoading={isLoadingCompanyData}
                props={props}
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
          </Stack>
        </Stack>
      </Stack>
      {(isLoadingCompanyData || isLoadingCompanySelected) && <Loader />}
    </Container>
  );
};
