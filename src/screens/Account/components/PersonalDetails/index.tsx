import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {userTypes} from 'common/users/userTypes';
import {TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import {DatePicker} from 'components/DatePicker';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import {TextField} from 'components/TextField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {ProfileBody, ProfileModal} from 'request/Profile';
import {Styles} from './index.styles';

interface PersonalDetailsProp {
  isEditable?: boolean;
  profileData: ProfileModal | undefined;
  updateProfile?: (bodyObj: ProfileBody) => void;
}

export const PersonalDetails: React.FC<PersonalDetailsProp> = ({
  profileData,
  updateProfile,
}) => {
  const {t} = useTranslation();

  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });

  const [name, setName] = useState<string | undefined>('');
  const [dobDate, setDobDate] = useState<Date | undefined>();
  // const [company, setCompany] = useState<string>('The Walt Disney Company');

  const [editPersonal, setEditPersonal] = useState<boolean>(false);

  const styles = Styles();

  useEffect(() => {
    setName(profileData?.name);
  }, [profileData]);

  return (
    <>
      <Stack
        spacing={16}
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.labelHead}>
        <TextView
          weight="semibold"
          variant={FontSizes.large}
          style={{color: colors.primary_007}}>
          {t('accountPage:personalDetails')}
        </TextView>
        {/* {userType === userTypes.Owner && */}
        {/* (editPersonal ? ( */}
        {/* <RippleIconButton
          name="edit"
          onPress={() => setEditPersonal(!editPersonal)}
        /> */}
        {/* ) : ( */}
        {/* {!editPersonal && (
          <Stack style={styles.editIcon}>
            <RippleIconButton
              name="edit"
              onPress={() => setEditPersonal(prevState => !prevState)}
              color={colors.primary_007}
              size={20}
            />
          </Stack>
        )} */}
        {/* ))} */}
        {editPersonal ? (
          <Ripple onPress={() => setEditPersonal(!editPersonal)}>
            <Icon name="edit" size={18} />
          </Ripple>
        ) : (
          <Ripple onPress={() => setEditPersonal(!editPersonal)}>
            <Icon name="edit" size={18} color={colors.black} />
          </Ripple>
        )}
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
              weight="medium"
              variant={FontSizes.medium}
              style={styles.showInput}>
              The Walt Disney Company
            </TextView>
            {/* ) : (
              <TextField
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
        {!editPersonal ? (
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            style={styles.nonEditView}>
            {profileData?.name}
          </TextView>
        ) : (
          <TextField
            // placeholder={'The Walt Disney Company'}
            onChangeText={text => setName(text)}
            value={name}
          />
        )}
        <TextView
          weight="regular"
          variant={FontSizes.regular}
          style={styles.label}>
          {t('accountPage:email')}
        </TextView>
        {!editPersonal ? (
          <TextView
            weight="medium"
            variant={FontSizes.medium}
            style={styles.nonEditView}>
            {profileData?.email}
          </TextView>
        ) : (
          <TextField
            onChangeText={() => {}}
            value={profileData?.email}
            editable={false}
          />
          // <TextView
          //   weight="regular"
          //   variant={FontSizes.small}
          //   style={styles.disabledInput}>
          //   leslie.alexander@email.com
          // </TextView>
        )}
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
                weight="medium"
                variant={FontSizes.medium}
                style={styles.nonEditView}>
                {profileData?.mobile}
              </TextView>
            ) : (
              <TextField
                // style={[styles.showInput, styles.inputNumber]}
                // placeholder={profileData?.mobile}
                // onChangeText={text => setNumber(text)}
                editable={false}
                value={profileData?.mobile}
                keyboardType="number-pad"
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
                style={styles.dobView}>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={styles.nonEditView}>
                  {profileData?.dob}
                </TextView>
                <View style={styles.icon}>
                  {/* <Icon name="calendar" size={18} color={colors.grey_003} /> */}
                </View>
              </Stack>
            ) : (
              <DatePicker
                placeholder={profileData?.dob}
                hideIcon
                onDateSelected={setDobDate}
                maximumDate={new Date()}
                isPlaceholderBlack
                // format="YYYY-MM-DD"
              />
            )}
          </View>
        </Stack>
        {editPersonal && (
          <Stack style={styles.saveButton}>
            <PrimaryButton
              title={t('save')}
              onPress={() => {
                setEditPersonal(false);
                const bodyObj = {
                  name: name,
                  dob: dobDate
                    ? dobDate?.toISOString().split('T')[0]
                    : profileData?.dob,
                } as ProfileBody;
                updateProfile?.(bodyObj);
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
