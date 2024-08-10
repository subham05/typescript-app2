import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import {Icon} from 'components/Icon';
import {RippleIconButton} from 'components/IconButtons';
import {InputTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import {Styles} from './index.styles';

interface PersonalDetailsProp {
  isEditable?: boolean;
}

export const PersonalDetails: React.FC<PersonalDetailsProp> = ({}) => {
  const {t} = useTranslation();

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const [number, setNumber] = useState<string>('');
  // const [company, setCompany] = useState<string>('The Walt Disney Company');

  const [editPersonal, setEditPersonal] = useState<boolean>(false);

  const styles = Styles();
  return (
    <>
      <Stack
        spacing={16}
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.labelHead}>
        <TextView weight="medium" variant={FontSizes.xMedium}>
          {t('accountPage:personalDetails')}
        </TextView>
        {/* {userType === userTypes.Owner && */}
        {/* (editPersonal ? ( */}
        {/* <RippleIconButton
          name="edit"
          onPress={() => setEditPersonal(!editPersonal)}
        /> */}
        {/* ) : ( */}
        <RippleIconButton
          name="edit"
          onPress={() => setEditPersonal(prevState => !prevState)}
          color={colors.black}
        />
        {/* ))} */}
        {/* {editPersonal ? (
          <Ripple onPress={() => setEditPersonal(!editPersonal)}>
            <Icon name="edit" size={18} />
          </Ripple>
        ) : (
          <Ripple onPress={() => setEditPersonal(!editPersonal)}>
            <Icon name="edit" size={18} color={colors.black} />
          </Ripple>
        )} */}
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        {userType === userTypes.Employee && (
          <>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('accountPage:companyName')}
            </TextView>
            {/* {!editPersonal ? ( */}
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={styles.showInput}>
              The Walt Disney Company
            </TextView>
            {/* ) : (
              <InputTextField
                // placeholder={'The Walt Disney Company'}
                onChangeText={text => setCompany(text)}
                value={company}
              />
            )} */}
          </>
        )}
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('accountPage:name')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.showInput}>
          Leslie Alexander
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('accountPage:email')}
        </TextView>
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.showInput}>
          leslie.alexander@email.com
        </TextView>
        <Stack horizontal center horizontalAlign="space-between">
          <View style={styles.fieldView}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('accountPage:contact')}
            </TextView>
            {!editPersonal ? (
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.showInput}>
                +00 0000 0000 00
              </TextView>
            ) : (
              <InputTextField
                style={[styles.showInput, styles.inputNumber]}
                placeholder={'+00 0000 0000 00'}
                onChangeText={text => setNumber(text)}
                value={number}
                number
              />
            )}
          </View>
          <View style={styles.fieldView}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={[
                styles.label,
                !editPersonal ? styles.labelDob : undefined,
              ]}>
              {t('accountPage:dob')}
            </TextView>
            {!editPersonal ? (
              <Stack
                horizontal
                horizontalAlign="space-between"
                style={styles.dob}>
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles.showDate}>
                  23/02/22
                </TextView>
                <View style={styles.icon}>
                  <Icon name="calendar" size={18} color={colors.grey_003} />
                </View>
              </Stack>
            ) : (
              <DatePicker date="23/02/22" />
            )}
          </View>
        </Stack>
        {editPersonal && (
          <Stack style={styles.saveButton}>
            <PrimaryButton
              title={t('save')}
              onPress={() => {
                setEditPersonal(false);
              }}
              height={38}
            />
          </Stack>
          // <TouchableOpacity
          //   onPress={() => {
          //     setEditPersonal(false);
          //   }}
          //   style={styles.saveButton}>
          //   <TextView
          //     weight="medium"
          //     variant={FontSizes.small}
          //     style={styles.save}>
          //     {t('save')}
          //   </TextView>
          // </TouchableOpacity>
        )}
      </Stack>
    </>
  );
};
