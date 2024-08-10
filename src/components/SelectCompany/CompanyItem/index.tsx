import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {CompanyListResponseProps} from 'request/CompanyList';
import {CompanyProps} from '../CompanyListView';

interface CompanyItemProps {
  item: CompanyListResponseProps;
  isAllSelected: boolean;
  selectedCompany: CompanyProps[];
  onPress: (selectedItem: CompanyListResponseProps) => void;
  onSelectCompany: (value: boolean) => void;
  props: any;
}

export const CompanyItem: React.FC<CompanyItemProps> = ({
  item,
  isAllSelected,
  selectedCompany,
  onPress,
  onSelectCompany,
}) => {
  const onSelect = () => {
    onSelectCompany(false);
    onPress(item);
  };
  const isSelected =
    selectedCompany?.length > 0
      ? selectedCompany.findIndex(company => company._id === item._id)
      : -1;
  return (
    <TouchableOpacity
      onPress={onSelect}
      style={
        !isAllSelected && isSelected !== -1
          ? styles().containerSelected
          : styles().container
      }>
      <Stack spacing={16} horizontal>
        <Stack center style={styles().checkContainer}>
          {(isAllSelected || isSelected !== -1) && (
            <View style={styles().check}>
              <Icon
                name="check_circle_selected"
                size={FontSizes.large}
                color={colors.primary}
              />
            </View>
          )}
        </Stack>
        <StackItem childrenGap={5}>
          <TextView weight="medium" variant={FontSizes.medium} truncate>
            {item?.name}
          </TextView>
          <TextView weight="light" variant={FontSizes.xSmall}>
            {item?.officeAddress?.address}
          </TextView>
        </StackItem>
      </Stack>
    </TouchableOpacity>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      // paddingRight: 10,
      paddingHorizontal: 15,
      borderRadius: 3,
    },
    containerSelected: {
      padding: 10,
      // paddingRight: 10,
      paddingHorizontal: 15,
      borderRadius: 3,
      backgroundColor: colors.grey_006,
    },
    check: {
      height: 25,
      width: 25,
      borderRadius: 25,
      alignSelf: 'center',
      marginRight: 15,
    },
    checkContainer: {
      height: 25,
      width: 25,
      borderRadius: 25,
      alignSelf: 'center',
      marginRight: 15,
    },
  });
  return mergeStyles;
};
