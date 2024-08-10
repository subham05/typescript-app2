import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React, {FC} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {OfficeLocationModal} from 'request/Profile';
import {AccountProps} from 'screens/Account';
import {Styles} from './index.styles';

interface OfficeLocationProps {
  props: AccountProps;
  data: OfficeLocationModal[] | undefined;
  callFetchProfileApi: () => void;
}

export const OfficeLocation: FC<OfficeLocationProps> = ({
  props,
  data,
  callFetchProfileApi,
}) => {
  const {t} = useTranslation();

  const RenderCompanyList = () => {
    return (
      <>
        {data &&
          data.map((company, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  props.navigation.navigate('ViewCompany', {
                    companyData: company,
                    callFetchProfileApi: callFetchProfileApi,
                  })
                }>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.label}>
                  {company.name}
                </TextView>
              </TouchableOpacity>
            );
          })}
      </>
    );
  };

  const styles = Styles();
  return (
    <Stack>
      <Stack spacing={16} spaceBelow={16}>
        <TextView
          weight="semibold"
          variant={FontSizes.large}
          style={{color: colors.primary_007}}>
          {t('accountPage:officeLocation')}
        </TextView>
        <RenderCompanyList />
      </Stack>
    </Stack>
  );
};
