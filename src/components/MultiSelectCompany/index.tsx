import React from 'react';

import {RippleIconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/TextField';
// import Modal from 'react-native-modal';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import EmptyComponent from 'components/EmptyComponent';
import {Icon} from 'components/Icon';
import {TextView} from 'components/TextView';
import {t} from 'i18next';
import {FlatList, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {DropDownModel} from 'screens/AddTask';
import {Stack} from 'stack-container';
import {Styles} from '../../screens/AddOwner/index.styles';

interface MultiSelectProp {
  openCompanyModal: boolean;
  setOpenCompanyModal: (value: boolean) => void;
  allCompanyData: DropDownModel[];
  selectedCompanyList: DropDownModel[];
  onClick: (value: DropDownModel) => void;
  searchText: string;
  setSearchText: (value: string) => void;
}
const MultiSelectCompany: React.FC<MultiSelectProp> = ({
  openCompanyModal,
  setOpenCompanyModal,
  allCompanyData,
  selectedCompanyList,
  onClick,
  searchText,
  setSearchText,
}) => {
  const styles = Styles();
  // const panelProps = {
  //   fullWidth: true,
  //   openLarge: false,
  //   // onlySmall: true,
  //   showCloseButton: false,
  //   onClose: () => setOpenCompanyModal(false),
  //   onPressCloseButton: () => setOpenCompanyModal(false),
  //   closeOnTouchOutside: true,
  //   smallPanelHeight: Dimensions.get('screen').height / 1.7,
  //   style: {
  //     justifyContent: 'flex-end',
  //     margin: 0,
  //     borderTopRightRadius: 0,
  //     borderTopLeftRadius: 0,
  //   },
  //   // ...or any prop you want
  // };
  return (
    <Modal
      avoidKeyboard
      isVisible={openCompanyModal}
      onBackdropPress={() => setOpenCompanyModal(false)}
      style={styles.modalStyle}>
      <View style={[styles.bottomModalView]}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          verticalAlign="center"
          spacing={16}>
          <Stack>
            <TextView weight="bold" variant={FontSizes.large}>
              Select company
            </TextView>
          </Stack>
          <RippleIconButton
            name="close"
            size={22}
            onPress={() => setOpenCompanyModal(false)}
          />
        </Stack>
        <Stack spacing={16} style={styles.attachmentView}>
          <SearchTextField
            // showBorder
            value={searchText}
            setSearchValue={setSearchText}
            pattern1={/[]/}
            pattern2={
              /^[ A-Za-z0-9~`!@#$%^&*+=\-[\]\\';,_-©®™✓°¥€¢£√π÷¶•∆/{}()|\\"':<>?\s]*$/
            }
          />
        </Stack>
        <Stack spacing={16}>
          {allCompanyData.length > 0 ? (
            <FlatList
              data={allCompanyData}
              showsVerticalScrollIndicator
              renderItem={({item}) => {
                const isAvailable = selectedCompanyList.find(
                  i => i.value === item.value,
                );
                return (
                  <TouchableOpacity onPress={() => onClick(item)}>
                    <Stack
                      horizontal
                      horizontalAlign="flex-start"
                      style={styles.listingStackStyle}>
                      {isAvailable ? (
                        <Icon
                          name="check_box"
                          size={20}
                          color={colors.grey_004}
                        />
                      ) : (
                        <Icon
                          name="check_box_blank"
                          size={20}
                          color={colors.grey_004}
                        />
                      )}
                      <TextView
                        weight="regular"
                        variant={FontSizes.regular}
                        style={styles.textViewStyle}>
                        {item.label}
                      </TextView>
                    </Stack>
                  </TouchableOpacity>
                );
              }}
            />
          ) : (
            <EmptyComponent
              message={t('selectCompany:NoCompaniesFound')}
              containerStyle={styles.containerEmptyStyle}
            />
          )}
        </Stack>
      </View>
    </Modal>
  );
};
export default MultiSelectCompany;
