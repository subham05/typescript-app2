import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {FormikTextField} from 'components/formikFields';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import GPS from '../../../../assets/svgs/GPS.svg';
import {useAppSelector} from 'store/hooks';
import {styles} from '../../index.styles';
import {InitialValues} from 'screens/AddPersonalAssistant/constants';

export interface ResidenceModal {
  setShowModal: () => void;
}

export const ResidenceAddress: React.FC<ResidenceModal> = ({setShowModal}) => {
  const {t} = useTranslation();
  const {validations} = useAppSelector(state => state?.formanagement);

  return (
    <>
      <TextView variant={FontSizes.regular} style={styles.label}>
        {t('addManager:address')}
      </TextView>
      <StackItem childrenGap={10}>
        <TouchableOpacity onPress={() => setShowModal()}>
          <FormikTextField
            name="address"
            placeholder={t('addManager:addressPlaceholder_1')}
            RenderRightContainer={() => <GPS style={styles.gpsIcon} />}
            editable={false}
            // enableBackground={true}
          />
        </TouchableOpacity>
        <FormikTextField
          value={InitialValues.addressArea}
          name="addressArea"
          placeholder={t('addManager:addressPlaceholder_2')}
          onChangeInput={value => (InitialValues.addressArea = value)}
          maxLength={validations?.landmarkLimit.MAX}
        />
        <Stack horizontal center horizontalAlign="space-between">
          <View style={styles.fieldView}>
            <FormikTextField
              name="country"
              placeholder={t('addManager:countryPlaceholder')}
              keyboardType={'email-address'}
              autoComplete={'off'}
              editable={false}
              // enableBackground={true}
            />
          </View>
          <View style={styles.fieldView}>
            <FormikTextField
              name="state"
              placeholder={t('addManager:statePlaceholder')}
              keyboardType={'email-address'}
              autoComplete={'off'}
              editable={false}
              // enableBackground={true}
            />
          </View>
        </Stack>
        <Stack
          horizontal
          style={styles.rowVerticalStyle}
          horizontalAlign="space-between">
          <View style={styles.fieldView}>
            <FormikTextField
              name="city"
              value={InitialValues.city}
              placeholder={t('addManager:cityPlaceholder')}
              keyboardType={'email-address'}
              autoComplete={'off'}
              onChangeInput={value => (InitialValues.city = value)}
              maxLength={validations?.cityLimit.MAX}
            />
          </View>
          <View style={styles.fieldView}>
            <FormikTextField
              name="zipcode"
              value={InitialValues.zipcode}
              placeholder={t('addManager:zipcodePlaceholder')}
              onChangeInput={value => (InitialValues.zipcode = value)}
              keyboardType={'email-address'}
              autoComplete={'off'}
            />
          </View>
        </Stack>
      </StackItem>
    </>
  );
};
