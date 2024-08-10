import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {Divider} from 'components/Divider';
import {DropDownView} from 'components/DropDownView';
import {RippleIconButton} from 'components/IconButtons';
import {InputTextField} from 'components/InputView';
import {Stack, StackItem} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from './index.styles';

export const OfficeLocation = () => {
  const {t} = useTranslation();

  const [companyName, setCompanyName] = useState<string>('');
  const [companyUrl, setCompanyUrl] = useState<string>('');
  const [companyAddress, setCompanyAddress] = useState<string>('');
  const [companyLandmark, setCompanyLandmark] = useState<string>('');
  const [Country, setCountry] = useState<string>('');
  const [companyContact, setCompanyContact] = useState<string>('');
  const allCountryData = [
    {label: 'India', value: 'India'},
    {label: 'USA', value: 'USA'},
    {label: 'UK', value: 'UK'},
    {label: 'Japan', value: 'Japan'},
  ];
  const [editOffice, setEditOffice] = useState<boolean>(false);

  const renderItem = (item: any) => {
    return (
      <StackItem style={styles.item} childrenGap={10}>
        <TextView weight="regular" variant={FontSizes.regular}>
          {item.label}
        </TextView>
        <Divider size={1.5} />
      </StackItem>
    );
  };

  const styles = Styles();
  return (
    <Stack>
      <Stack spacing={16} spaceBelow={16}>
        <Stack
          spaceBelow={16}
          horizontal
          horizontalAlign="space-between"
          style={styles.labelHead}>
          <TextView weight="medium" variant={FontSizes.xMedium}>
            {t('accountPage:officeLocation')}
          </TextView>
          {editOffice ? (
            <RippleIconButton
              name="edit"
              onPress={() => setEditOffice(!editOffice)}
            />
          ) : (
            <RippleIconButton
              name="edit"
              onPress={() => setEditOffice(!editOffice)}
              color={colors.black}
            />
          )}
          {/* {editOffice ? (
            <Ripple onPress={() => setEditOffice(!editOffice)}>
              <Icon name="edit" size={18} />
            </Ripple>
          ) : (
            <Ripple onPress={() => setEditOffice(!editOffice)}>
              <Icon name="edit" size={18} color={colors.black} />
            </Ripple>
          )} */}
        </Stack>
        <Stack spacing={editOffice ? 0 : 16}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.label}>
            The Walt Disney Company
          </TextView>
        </Stack>
        {editOffice && (
          <>
            <InputTextField
              label={t('accountPage:owner')}
              placeholder={t('accountPage:companyNamePlaceholder')}
              onChangeText={text => setCompanyName(text)}
              value={companyName}
            />
            <InputTextField
              label={t('accountPage:URL')}
              placeholder={t('accountPage:URLPlaceholder')}
              onChangeText={text => setCompanyUrl(text)}
              value={companyUrl}
            />
            <InputTextField
              label={t('accountPage:address')}
              placeholder={t('accountPage:addressPlaceholder')}
              onChangeText={text => setCompanyAddress(text)}
              value={companyAddress}
            />
            <InputTextField
              label={t('accountPage:landmark')}
              placeholder={t('accountPage:landmarkPlaceholder')}
              onChangeText={text => setCompanyLandmark(text)}
              value={companyLandmark}
            />
            <DropDownView
              label={t('accountPage:country')}
              placeholderStyle={styles.placeholderStyle}
              data={allCountryData}
              labelField="label"
              valueField="value"
              placeholder={t('accountPage:dropdownPlaceholder')}
              value={Country}
              onChange={item => {
                setCountry(item.value);
              }}
              renderItem={renderItem}
            />
            <InputTextField
              label={t('accountPage:contact')}
              placeholder={t('accountPage:contact')}
              onChangeText={text => setCompanyContact(text)}
              value={companyContact}
            />
            <Stack style={styles.saveButton}>
              <PrimaryButton
                title={t('save')}
                onPress={() => {
                  setEditOffice(false);
                }}
                height={38}
              />
            </Stack>
            {/* <TouchableOpacity onPress={() => {}} style={styles.saveButton}>
              <TextView
                weight="medium"
                variant={FontSizes.small}
                style={styles.save}>
                {t('save')}
              </TextView>
            </TouchableOpacity> */}
          </>
        )}
        <Stack spacing={editOffice ? 0 : 16}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.label}>
            Google ZTech solutions
          </TextView>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.label}>
            Jaguar
          </TextView>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.label}>
            ZTech solutions
          </TextView>
        </Stack>
      </Stack>
    </Stack>
  );
};
