import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {Dimensions, ScrollView, TouchableOpacity, View} from 'react-native';
import {useCompanyListingMutation} from 'request/CompanyList';
import {Styles} from '../../index.styles';

interface FilterCompany {
  selectedCompanies: Set<string>;
  updateArrayCompanies: (Value: string) => void;
  companyIdsLength?: number;
}

export const FilterCompany: React.FC<FilterCompany> = ({
  selectedCompanies,
  updateArrayCompanies,
}) => {
  const [getCompanies, {data: companyData, isLoading: isLoadingCompanyData}] =
    useCompanyListingMutation({fixedCacheKey: 'CompaniesFilter'});

  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const styles = Styles();

  return (
    <>
      <SearchTextField
        setSearchValue={val => {
          setSearchText(val.trim());
        }}
        showBorder
        modal
        pattern1={/[]/}
        pattern2={
          /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
        }
        // onSearchChange={text => setSearchText(text.trim())}
      />
      <ScrollView>
        {companyData?.data.filter(item =>
          item?.name.toLowerCase().includes(searchText.toLowerCase()),
        )?.length! > 0 && (
          <TouchableOpacity
            onPress={() => {
              updateArrayCompanies('1');
            }}>
            <Stack horizontal>
              {companyData?.data?.length === selectedCompanies.size ||
              selectedCompanies.has('1') ? (
                <Icon
                  name="check_circle_selected"
                  size={20}
                  color={colors.primary}
                  style={[styles.blankDot, styles.selectAll]}
                />
              ) : (
                <View style={styles.blankDot} />
              )}
              {!searchText.length && (
                <TextView
                  weight={
                    companyData?.data?.length === selectedCompanies.size
                      ? 'medium'
                      : 'regular'
                  }
                  variant={FontSizes.regular}
                  style={styles.selectedAll}>
                  All Companies
                </TextView>
              )}
            </Stack>
          </TouchableOpacity>
        )}
        {companyData?.data
          .filter(item =>
            item?.name.toLowerCase().includes(searchText.toLowerCase()),
          )
          .map(({_id, name}, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => updateArrayCompanies(_id)}>
                <Stack horizontal>
                  {selectedCompanies.has(_id) ? (
                    <Icon
                      name="check_circle_selected"
                      size={20}
                      color={colors.primary}
                      style={styles.blankDot}
                    />
                  ) : (
                    <View style={styles.blankDot} />
                  )}
                  <TextView
                    weight={selectedCompanies.has(_id) ? 'medium' : 'regular'}
                    variant={FontSizes.regular}
                    style={styles.selected}>
                    {name}
                  </TextView>
                </Stack>
              </TouchableOpacity>
            );
          })}
        {!companyData?.data?.filter(item =>
          item?.name.toLowerCase().includes(searchText.toLowerCase()),
        ).length && (
          <TextView
            variant={FontSizes.medium}
            textAlign="center"
            truncate
            style={{
              paddingTop: Dimensions.get('screen').height / 4,
            }}>
            No data found
          </TextView>
        )}
      </ScrollView>
      {isLoadingCompanyData && <Loader message="Fetching companies..." />}
    </>
  );
};
