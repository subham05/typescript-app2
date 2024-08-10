import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {t} from 'i18next';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import {respHeight, respWidth} from 'screens/Calendar/utils/responsive';

export interface filterData {
  value: string;
  label: string;
  onClick: (item: string) => void;
}

interface filterProps {
  icon: string;
  data: filterData[];
  selectedRole: string[];
  showCheckBox?: boolean;
  modalWidth?: number;
  showLeaveRequest?: boolean;
  onClickLeaveRequest?: () => void;
}

const Filter: FC<filterProps> = ({
  icon,
  data,
  selectedRole,
  showCheckBox = false,
  modalWidth = 160,
  showLeaveRequest,
  onClickLeaveRequest,
}) => {
  return (
    <Menu>
      <MenuTrigger>
        <Icon name={icon} size={24} color={colors.black} />
      </MenuTrigger>
      <MenuOptions optionsContainerStyle={{width: modalWidth}}>
        {data.map(item => {
          const isSelected = selectedRole?.includes(item.value);
          return (
            <MenuOption
              onSelect={() => item.onClick(item.value)}
              style={{
                backgroundColor: isSelected ? colors.grey_011 : colors.white,
              }}>
              <View style={styles.listView}>
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={{color: colors.black}}>
                  {item.label}
                </TextView>
                {showCheckBox &&
                  (isSelected ? (
                    <Icon name="check_box" size={20} color={colors.black} />
                  ) : (
                    <Icon
                      name="check_box_blank"
                      size={20}
                      color={colors.black}
                    />
                  ))}
              </View>
            </MenuOption>
          );
        })}
        {showLeaveRequest && (
          <MenuOption onSelect={onClickLeaveRequest}>
            <View style={styles.listView}>
              <TextView
                weight="medium"
                variant={FontSizes.regular}
                style={{color: colors.black}}>
                {t('attendance:leaveRequest')}
              </TextView>
            </View>
          </MenuOption>
        )}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  listView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: respWidth(10),
    paddingVertical: respHeight(5),
  },
});

export default Filter;
