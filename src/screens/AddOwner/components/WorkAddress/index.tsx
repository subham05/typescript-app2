import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {FormikTextField} from 'components/formikFields';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {InitialValues} from 'screens/AddOwner/constants';
import {Styles} from '../../index.styles';
import GPS from '../../../../assets/svgs/GPS.svg';
import {ResidenceModal} from 'screens/AddManager/components/ResidenceAddress';
import {useAppSelector} from 'store/hooks';

export const WorkAddress: React.FC<ResidenceModal> = ({setShowModal}) => {
  const {t} = useTranslation();
  const {validations} = useAppSelector(state => state?.formanagement);
  const styles = Styles();
  return (
    <>
      <TextView variant={FontSizes.regular} style={styles.label}>
        {t('addManager:workAddress')}
      </TextView>
      <StackItem childrenGap={10}>
        <TouchableOpacity onPress={() => setShowModal()}>
          <FormikTextField
            name="workAddressBlock"
            placeholder={t('addManager:addressPlaceholder_3')}
            RenderRightContainer={() => <GPS style={styles.gpsIcon} />}
            editable={false}
            // enableBackground={true}
          />
        </TouchableOpacity>
        <FormikTextField
          value={InitialValues.workAddressArea}
          name="workAddressArea"
          placeholder={t('addManager:addressPlaceholder_4')}
          onChangeInput={value => (InitialValues.workAddressArea = value)}
          maxLength={validations?.landmarkLimit.MAX}
        />
        <Stack horizontal center horizontalAlign="space-between">
          <View style={styles.fieldView}>
            <FormikTextField
              name="workCountry"
              placeholder={t('addManager:countryPlaceholder')}
              keyboardType={'email-address'}
              autoComplete={'off'}
              editable={false}
              // enableBackground={true}
            />
          </View>
          <View style={styles.fieldView}>
            <FormikTextField
              name="workState"
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
              name="workCity"
              value={InitialValues.workCity}
              placeholder={t('addManager:cityPlaceholder')}
              keyboardType={'email-address'}
              autoComplete={'off'}
              onChangeInput={value => (InitialValues.workCity = value)}
              maxLength={validations?.cityLimit.MAX}
            />
          </View>
          <View style={styles.fieldView}>
            <FormikTextField
              name="workZipcode"
              value={InitialValues.workZipcode}
              placeholder={t('addManager:zipcodePlaceholder')}
              onChangeInput={value => (InitialValues.workZipcode = value)}
              keyboardType={'email-address'}
              autoComplete={'off'}
            />
          </View>
        </Stack>
      </StackItem>
    </>
  );
};
