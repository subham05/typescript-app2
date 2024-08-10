import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {FlatList} from 'react-native';
import {CompanyListResponseProps} from 'request/CompanyList';
import {useAppSelector} from 'store/hooks';
import {CompanyItem} from '../CompanyItem';

interface CompanyListViewProps {
  data: CompanyListResponseProps[] | undefined;
  props: any;
  isAllSelected: boolean;
  onSelectCompany: (value: boolean) => void;
  onPress: (selectedItem: CompanyListResponseProps) => void;
  selectedCompany: CompanyListResponseProps[];
  isLoading: boolean;
}
export interface CompanyProps {
  _id: number | string;
  name: string;
  address?: string;
}
export const CompanyListView: React.FC<CompanyListViewProps> = ({
  data,
  props,
  isAllSelected,
  onSelectCompany,
  onPress,
  selectedCompany,
  isLoading,
}) => {
  const {userData} = useAppSelector(state => state?.formanagement);
  const {t} = useTranslation();
  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <CompanyItem
          item={item}
          isAllSelected={isAllSelected}
          selectedCompany={selectedCompany!}
          onPress={onPress}
          onSelectCompany={onSelectCompany}
          props={props}
        />
      )}
      ListEmptyComponent={() =>
        !data?.length && !isLoading ? (
          <EmptyComponent
            message={
              userData?.role.type === 'OWNER' &&
              userData.primary === 'YES' &&
              !userData?.companyId
                ? t('selectCompany:NoCompaniesFound')
                : undefined
            }
          />
        ) : (
          <></>
        )
      }
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent />}
    />
  );
};
