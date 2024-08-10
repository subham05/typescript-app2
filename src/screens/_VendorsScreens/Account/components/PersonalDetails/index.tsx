import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {RippleIconButton} from 'components/IconButtons';
import {InputTextField} from 'components/InputView';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {Styles} from './index.styles';

interface PersonalDetailsProps {
  onPress: (val: boolean) => void;
}
export const PersonalDetails: React.FC<PersonalDetailsProps> = ({onPress}) => {
  const {t} = useTranslation();

  const [name] = useState<string>('Leslie Alexander');
  const [email] = useState<string>('leslie.alexander@email.com');
  const [number, setNumber] = useState<string>('');
  const [company] = useState<string>('The Walt Disney Company');
  const [address] = useState<string>('Residance address');
  const [editPersonal, setEditPersonal] = useState<boolean>(false);

  onPress(editPersonal);

  // const [isDatePickerVisible, setDatePickerVisibility] =
  //   useState<boolean>(false);

  // const showDatePicker = () => {
  //   setDatePickerVisibility(true);
  // };

  // const hideDatePicker = () => {
  //   setDatePickerVisibility(false);
  // };

  // const handleConfirm = () => {
  //   hideDatePicker();
  //   // const day   = pickeddate.getDate();
  //   // const month = pickeddate.getMonth();
  //   // const year  = pickeddate.getFullYear();
  //   // const monthName= moment().month(month).format("MMMM");
  //   // // pickeddate.setMonth(month);
  //   // // const monthName = pickeddate.toLocaleString("default", {month: "long"});
  //   // setDOB(day + ' ' + monthName + ' ' + year)
  //   // setDate(year+'-'+(month+1)+'-'+day)
  // };

  const styles = Styles();
  return (
    <>
      <Stack
        spacing={16}
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.labelHead}>
        <TextView weight="semibold" variant={FontSizes.medium}>
          {t('accountPage:personalDetails')}
        </TextView>
        {/* {editPersonal ? (
          <RippleIconButton
            name="edit"
            onPress={() => setEditPersonal(!editPersonal)}
          />
        ) : (
          <RippleIconButton
            name="edit"
            onPress={() => setEditPersonal(!editPersonal)}
            color={colors.black}
          />
        )} */}
        <RippleIconButton
          name="edit"
          onPress={() => setEditPersonal(prevState => !prevState)}
          color={colors.black}
        />
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
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('accountPage:companyName')}
        </TextView>
        {/* {!editPersonal ? ( */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.showInput}>
          {company}
        </TextView>
        {/* ) : (
          <InputTextField
            // placeholder={'The Walt Disney Company'}
            onChangeText={text => setCompany(text)}
            value={company}
          />
        )} */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('accountPage:name')}
        </TextView>
        {/* {!editPersonal ? ( */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.showInput}>
          {name}
        </TextView>
        {/* ) : (
          <InputTextField
            placeholder={t('accountPage:name')}
            onChangeText={text => setName(text)}
            value={name}
          />
        )} */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('accountPage:email')}
        </TextView>
        {/* {!editPersonal ? ( */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.showInput}>
          {email}
        </TextView>
        {/* ) : (
          <InputTextField
            placeholder={t('accountPage:name')}
            onChangeText={text => setEmail(text)}
            value={email}
          />
        )} */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('accountPage:contact')}
        </TextView>
        {!editPersonal ? (
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.showInput}>
            +00 0000 0000 00
          </TextView>
        ) : (
          <InputTextField
            placeholder={'+00 0000 0000 00'}
            onChangeText={text => setNumber(text)}
            value={number}
            number
          />
        )}
        {/* <Stack horizontal center horizontalAlign="space-between">
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
              style={styles.label}>
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
                  style={styles.showInput}>
                  23/02/22
                </TextView>
                <View style={styles.icon}>
                  <Icon name="calendar" size={18} color={colors.grey_003} />
                </View>
              </Stack>
            ) : (
              <TouchableOpacity onPress={() => showDatePicker()}>
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  style={styles.dob}>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles.showInput}>
                    23/02/22
                  </TextView>
                  <View style={styles.icon}>
                    <Icon name="calendar" size={18} color={colors.grey_003} />
                  </View>
                </Stack>
              </TouchableOpacity>
            )}
          </View>
        </Stack> */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.label}>
          {t('accountPage:residanceAddress')}
        </TextView>
        {/* {!editPersonal ? ( */}
        <TextView
          weight="regular"
          variant={FontSizes.small}
          style={styles.showInput}>
          {address}
        </TextView>
        {/* ) : (
          <InputTextField
            // placeholder={'+00 0000 0000 00'}
            onChangeText={text => setAddress(text)}
            value={address}
          />
        )} */}
        {editPersonal && (
          <TouchableOpacity onPress={() => {}} style={styles.saveButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.save}>
              {t('save')}
            </TextView>
          </TouchableOpacity>
        )}
      </Stack>
      {/* <DateTimePickerModal
        minimumDate={new Date()}
        isVisible={isDatePickerVisible}
        isDarkModeEnabled={
          Appearance.getColorScheme() === 'dark' ? true : false
        }
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      /> */}
    </>
  );
};
