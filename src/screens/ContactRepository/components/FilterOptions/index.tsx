import React, {useEffect, useMemo, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import FilterOptionsList from './FilterOptionsList';
import {useGetRoleContactsMutation} from 'request/ContactRepository';
import {FilterModal} from 'screens/Contacts';
import {Stack} from 'stack-container';
import Header from 'components/Header';
import {useSharedValue} from 'react-native-reanimated';
import {t} from 'i18next';
import {Container} from 'components';
import {MenuModel, PopupMenu} from 'components/PopupMenu';
import {StaffSubmenuModal} from 'store/Reducer';
import {userTypes} from 'common/users/userTypes';
import {SearchTextField} from 'components/TextField';
import {BackHandler} from 'react-native';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {ShareFilterOptions} from 'screens/ContactRepository';
type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'FilteredContactList'
>;
const FilteredContactList = (props: Props) => {
  const {role, companyId, staffMenuList, type} = props?.route?.params;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filteredList, setFilteredList] = useState<FilterModal[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>(role);
  const lastPageNo = useRef<number>(1);
  const translateY = useSharedValue(0);

  const [
    getFilteredList,
    {
      data: filteredData,
      isLoading: isFilterDataLoading,
      isSuccess: isFilterSuccess,
    },
  ] = useGetRoleContactsMutation();

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
      companies: companyId,
      filterRole: selectedRole,
      pageNo: pageNumber,
      searchValue: searchText,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, searchText, isRefreshing, selectedRole]);

  useEffect(() => {
    getFilteredList(requestObj);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestObj]);

  useEffect(() => {
    if (isFilterSuccess && filteredData) {
      const {nodes, pageInfo} = filteredData.data;
      const tempFilterArray =
        pageNumber > 1 ? filteredList.concat(nodes) : nodes;
      setFilteredList(tempFilterArray);
      lastPageNo.current = pageInfo.lastPageNo;
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFilterSuccess]);

  const getOptions = (user: string) => {
    switch (user) {
      case userTypes.Owner.toUpperCase():
        return {
          name: t('drawer:owner'),
          onClick: () => {
            selectedRole !== user && setPageNumber(1);
            setSelectedRole(userTypes.Owner.toUpperCase());
          },
        };
      case userTypes.persoalAssistant:
        return {
          name: t('drawer:personalAssistant'),
          onClick: () => {
            selectedRole !== user && setPageNumber(1);
            setSelectedRole(userTypes.persoalAssistant);
          },
        };
      case userTypes.GeneralManager:
        return {
          name: t('drawer:generalManager'),
          onClick: () => {
            selectedRole !== user && setPageNumber(1);
            setSelectedRole(userTypes.GeneralManager);
          },
        };
      case userTypes.Manager.toUpperCase():
        return {
          name: t('drawer:manager'),
          onClick: () => {
            selectedRole !== user && setPageNumber(1);
            setSelectedRole(userTypes.Manager.toUpperCase());
          },
        };
      case userTypes.Employee.toUpperCase():
        return {
          name: t('drawer:employee'),
          onClick: () => {
            selectedRole !== user && setPageNumber(1);
            setSelectedRole(userTypes.Employee.toUpperCase());
          },
        };
      default:
        return {
          name: '',
          onClick: () => {},
        };
    }
  };
  const menuDataPrivate: MenuModel[] = staffMenuList?.map(
    (item: StaffSubmenuModal) => getOptions(item.user),
  );
  const renderLeftContainer = () => {
    return (
      <>
        {type !== 'Shared' && (
          <PopupMenu
            data={menuDataPrivate}
            height={staffMenuList.length * 52}
            width={152}
          />
        )}
      </>
    );
  };
  return (
    <Container noSpacing onRetry={() => setPageNumber(1)}>
      <Header
        label={t('drawer:roleFilter')}
        translateY={translateY}
        navigationType={'STACK'}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack spacing={16}>
        <SearchTextField
          pattern1={searchPattern1}
          pattern2={searchPattern2}
          onSearchChange={value => {
            setPageNumber(1);
            setSearchText(value);
          }}
        />
        <FilterOptionsList
          data={filteredList}
          isFetching={isFilterDataLoading}
          pageCount={pageNumber}
          refreshing={isRefreshing}
          hideBusinessCard={true}
          serachTextLength={searchText.length}
          getRefresh={() => {
            setIsRefreshing(true);
            setPageNumber(1);
          }}
          onEndReached={() =>
            filteredList.length >= 10 &&
            pageNumber < lastPageNo.current &&
            setPageNumber(pageNumber + 1)
          }
          onSelect={selectedItem =>
            type === ShareFilterOptions.shared
              ? props.navigation.navigate('FilterSharedList', {
                  item: selectedItem!,
                })
              : props.navigation.navigate('FilterPrivateList', {
                  item: selectedItem!,
                })
          }
        />
      </Stack>
    </Container>
  );
};
export default FilteredContactList;
