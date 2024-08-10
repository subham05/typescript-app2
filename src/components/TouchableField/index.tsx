import {colors} from 'common/theme/colors';
import {AppFonts, FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {membersProps} from 'components/Members/MembersItem';
import {TaskDataModel} from 'components/TaskLists/TaskItem';
import React from 'react';
import {
  Dimensions,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {AssignToUsers} from 'request/AddTask';
import {Timezone, TimezoneData} from 'request/Calendar';
import {DropDownModel} from 'screens/AddTask';
import {requestToData} from 'screens/CreateContact/types';
import {Stack} from 'stack-container';

export interface TouchableFieldProps {
  label?: string;
  icon?: string;
  iconSize?: number;
  iconColor?: string;
  RenderView: React.FC | undefined;
  onPress?: () => void;
  isError?: boolean;
  onSelect?: (val: string | undefined) => void;
  data?:
    | membersProps
    | TaskDataModel
    | AssignToUsers
    | DropDownModel[]
    | requestToData
    | ReportToResponseList
    | undefined;
  placeholder?: string;
  disabled?: boolean;
  disabledNoBackground?: boolean;
  dropdownData?: TimezoneData[];
  isDropdownOpen?: boolean;
  variant?: 12 | 10 | 16 | 22 | 18 | 14 | 52 | 28 | 42 | 20 | undefined;
  variantStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  stackStyle?: StyleProp<ViewStyle>;
  onTimezoneSelect?: (value: TimezoneData) => void;
  onPressClose?: () => void;
}
export const TouchableField: React.FC<TouchableFieldProps> = ({
  label,
  icon,
  iconSize = 24,
  iconColor,
  RenderView,
  onPress,
  // onSelect,
  // data,
  isError,
  placeholder,
  disabled = false,
  disabledNoBackground = false,
  dropdownData,
  isDropdownOpen,
  variant,
  variantStyle,
  style,
  stackStyle,
  onTimezoneSelect,
  onPressClose,
}) => {
  const borderStyle: StyleProp<ViewStyle> | undefined = {
    borderWidth: 1,
    borderColor: isError
      ? colors.red
      : disabled
      ? colors.grey_002
      : colors.white,
  };

  const backgroundColorStyle: StyleProp<ViewStyle> | undefined = {
    backgroundColor: disabled
      ? disabledNoBackground
        ? colors.white
        : colors.grey_012
      : colors.white,
  };

  const onClick = () => {
    onPress!();
    // if (data) {
    //   onSelect!(data?.name);
    // }
  };

  const onSelect = (data: Timezone | TimezoneData) => {
    onTimezoneSelect!(data as TimezoneData);
  };
  return (
    <Stack childrenGap={5}>
      {label !== undefined && label?.length > 0 && (
        <TextView variant={FontSizes.regular} style={styles.label}>
          {label}
        </TextView>
      )}
      <TouchableOpacity onPress={onClick} disabled={disabled} style={style}>
        <Stack
          style={[styles.stack, borderStyle, backgroundColorStyle, stackStyle]}
          verticalAlign="center"
          horizontal
          horizontalAlign="space-between">
          {placeholder !== undefined && placeholder?.length > 0 ? (
            <TextView
              variant={variant ? variant : FontSizes.medium}
              style={[styles.placeholderColor, variantStyle]}>
              {placeholder}
            </TextView>
          ) : (
            RenderView && (
              <Stack style={{width: Dimensions.get('screen').width - 90}}>
                <RenderView />
              </Stack>
            )
          )}
          {icon && !disabledNoBackground && (
            <Icon
              name={icon}
              size={iconSize}
              style={styles.icon}
              color={iconColor ? iconColor : undefined}
              onPress={onPressClose}
              disabled={icon !== 'close'}
            />
          )}
        </Stack>
      </TouchableOpacity>
      {isDropdownOpen && (
        <View style={styles.dropdown}>
          {/* <FlatList
            data={dropdownData}
            renderItem={({item}) => (
              <Stack spacing={16} spaceBelow={16}>
                <TextView
                  variant={FontSizes.regular}
                  style={styles.dropdownHead}>
                  {item.name}
                </TextView>
                {item?.timezones?.map((itemTimezone, index) => {
                  return (
                    <Stack spacing={10} spaceBelow={10}>
                      <TouchableOpacity
                        onPress={() => onSelect(itemTimezone)}
                        key={index.toString()}>
                        <TextView
                          variant={FontSizes.regular}
                          style={{
                            fontFamily: AppFonts.regular,
                            color: colors.black,
                          }}>
                          {itemTimezone.zoneName +
                            ' ' +
                            itemTimezone.gmtOffsetName}
                        </TextView>
                      </TouchableOpacity>
                    </Stack>
                  );
                })}
                <Divider size={1.5} />
              </Stack>
            )}
            keyExtractor={(_, index) => index.toString()}
            // style={{flex: 1, borderWidth: 1, height: 100}}
            nestedScrollEnabled
          /> */}
          <ScrollView nestedScrollEnabled>
            {dropdownData?.map(item => {
              return (
                <Stack spacing={16} spaceBelow={16}>
                  <TextView
                    variant={FontSizes.regular}
                    style={styles.dropdownHead}>
                    {item.name}
                  </TextView>
                  {item?.timezones?.map((itemTimezone, index) => {
                    return (
                      <Stack spacing={10} spaceBelow={10}>
                        <TouchableOpacity
                          onPress={() => onSelect(itemTimezone)}
                          key={index.toString()}>
                          <TextView
                            variant={FontSizes.regular}
                            style={{
                              fontFamily: AppFonts.regular,
                              color: colors.black,
                            }}>
                            {itemTimezone.zoneName +
                              ' ' +
                              itemTimezone.gmtOffsetName}
                          </TextView>
                        </TouchableOpacity>
                      </Stack>
                    );
                  })}
                  <Divider size={1.5} />
                </Stack>
              );
            })}
          </ScrollView>
          {/* <ScrollView style={{borderWidth: 1, flex: 1}}>
            {dropdownData.map((item, index) => {
              return (
                <TextView variant={FontSizes.regular} style={styles.label}>
                  {item.countryName}
                </TextView>
              );
            })}
          </ScrollView> */}
        </View>
      )}
    </Stack>
  );
};

const styles = StyleSheet.create({
  stack: {padding: 12, borderRadius: 3},
  icon: {
    width: 30,
  },
  label: {
    color: colors.primary_003,
    textAlign: 'left',
  },
  placeholderColor: {
    color: colors.grey_003,
  },
  dropdown: {
    position: 'absolute',
    zIndex: 2,
    backgroundColor: colors.white,
    height: 300,
    width: '100%',
    flex: 1,
  },
  dropdownHead: {
    fontFamily: AppFonts.bold,
    color: colors.black,
    marginBottom: 5,
  },
});
