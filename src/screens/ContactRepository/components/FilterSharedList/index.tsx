import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {Container} from 'components';
import Header from 'components/Header';
import {SearchTextField} from 'components/TextField';
import {t} from 'i18next';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {BackHandler, Text, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import {useGetRoleSharedListMutation} from 'request/ContactRepository';
import {FilterModal} from 'screens/Contacts';
import {Stack} from 'stack-container';
import FilterOptionsItem from '../FilterOptions/FilterOptionsItem';
import FilterOptionsList from '../FilterOptions/FilterOptionsList';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
type Props = NativeStackScreenProps<SignedInStackParamList, 'FilterSharedList'>;
const FilterSharedList = (props: Props) => {
  const {item} = props?.route?.params;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filteredSharedList, setFilteredSharedList] = useState<FilterModal[]>(
    [],
  );
  const lastPageNo = useRef<number>(1);
  const translateY = useSharedValue(0);

  const [
    getSharedList,
    {data: sharedData, isLoading: isSharedLoading, isSuccess: isSharedSuccess},
  ] = useGetRoleSharedListMutation();
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
    getSharedList(requestObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);

  useEffect(() => {
    if (isSharedSuccess && sharedData) {
      const {nodes, pageInfo} = sharedData.data;
      const tempFilterArray =
        pageNumber > 1 ? filteredSharedList.concat(nodes) : nodes;
      setFilteredSharedList(tempFilterArray);
      lastPageNo.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharedSuccess]);
  const renderMainContainer = () => {
    return (
      <View>
        <Text style={{color: colors.black}}>{t('drawer:sharedList')}</Text>
      </View>
    );
  };
  return (
    <Container noSpacing onRetry={() => setPageNumber(1)}>
      <Header
        label={t('drawer:sharedList')}
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
          pattern1={searchPattern1}
          pattern2={searchPattern2}
          onSearchChange={value => {
            setPageNumber(1);
            setSearchText(value);
          }}
        />
        <FilterOptionsList
          data={filteredSharedList}
          isFetching={isSharedLoading}
          pageCount={pageNumber}
          refreshing={isRefreshing}
          serachTextLength={searchText.length}
          getRefresh={() => {
            setIsRefreshing(true);
            setPageNumber(1);
          }}
          onEndReached={() =>
            filteredSharedList.length >= 10 &&
            pageNumber < lastPageNo.current &&
            setPageNumber(pageNumber + 1)
          }
        />
      </Stack>
    </Container>
  );
};
export default FilterSharedList;
