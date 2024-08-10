import React, {useEffect, useMemo, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import {useGetRolePrivateListMutation} from 'request/ContactRepository';
import {FilterModal} from 'screens/Contacts';
import {Stack} from 'stack-container';
import Header from 'components/Header';
import {useSharedValue} from 'react-native-reanimated';
import {t} from 'i18next';
import {SearchTextField} from 'components/TextField';
import FilterOptionsList from '../FilterOptions/FilterOptionsList';
import {Container} from 'components';
import {BackHandler, Text, View} from 'react-native';
import FilterOptionsItem from '../FilterOptions/FilterOptionsItem';
import {colors} from 'common/theme/colors';
type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'FilterPrivateList'
>;
const FilterPrivateList = (props: Props) => {
  const {item} = props?.route?.params;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filteredPrivateList, setFilteredPrivateList] = useState<FilterModal[]>(
    [],
  );
  const lastPageNo = useRef<number>(1);
  const translateY = useSharedValue(0);

  const [
    getPrivateList,
    {
      data: privateData,
      isLoading: isPrivateLoading,
      isSuccess: isPrivateSuccess,
    },
  ] = useGetRolePrivateListMutation();
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', _handleBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', _handleBackPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const _handleBackPress = () => {
    props.navigation.goBack();
    return true;
  };
  const requestObj = useMemo(() => {
    return {
      employeeId: item?.employeeId,
      pageNo: pageNumber,
      searchValue: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchText, isRefreshing]);

  useEffect(() => {
    getPrivateList(requestObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);

  useEffect(() => {
    if (isPrivateSuccess && privateData) {
      const {nodes, pageInfo} = privateData.data;
      const tempFilterArray =
        pageNumber > 1 ? filteredPrivateList.concat(nodes) : nodes;
      setFilteredPrivateList(tempFilterArray);
      lastPageNo.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivateSuccess]);
  const renderMainContainer = () => {
    return (
      <View>
        <Text style={{color: colors.black}}>{t('drawer:privateList')}</Text>
      </View>
    );
  };
  return (
    <Container noSpacing onRetry={() => setPageNumber(1)}>
      <Header
        label={t('drawer:privateList')}
        translateY={translateY}
        navigationType={'STACK'}
        RenderMainContainer={renderMainContainer}
        isCloseNavigation
      />
      <Stack spacing={16} spaceBelow={130}>
        <Stack spaceBelow={10}>
          <FilterOptionsItem
            item={item}
            hideBusinessCard
            textColor={colors.primary}
          />
        </Stack>
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
        <FilterOptionsList
          data={filteredPrivateList}
          isFetching={isPrivateLoading}
          pageCount={pageNumber}
          refreshing={isRefreshing}
          serachTextLength={searchText.length}
          getRefresh={() => {
            setIsRefreshing(true);
            setPageNumber(1);
          }}
          onEndReached={() =>
            filteredPrivateList.length >= 10 &&
            pageNumber < lastPageNo.current &&
            setPageNumber(pageNumber + 1)
          }
        />
      </Stack>
    </Container>
  );
};
export default FilterPrivateList;
