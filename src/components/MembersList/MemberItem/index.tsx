import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {globalScreenWidth} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {membersProps} from 'components/Members/MembersItem';
import {Persona} from 'components/Persona';
import {t} from 'i18next';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {AssignToUsers} from 'request/AddTask';
import {requestToData} from 'screens/CreateContact/types';
import {Stack} from 'stack-container';

interface MemberItemProps {
  item:
    | membersProps
    | AssignToUsers
    | undefined
    | requestToData
    | ReportToResponseList;
  isEmail?: boolean;
  onPress?: (val: membersProps | undefined) => void;
  isDividerFalse?: boolean;
  disabled?: boolean;
}

export const MemberItem: React.FC<MemberItemProps> = ({
  item,
  isEmail,
  onPress,
  isDividerFalse,
  disabled = false,
}) => {
  const onClick = () => {
    onPress!(item);
  };
  return (
    <>
      <TouchableOpacity
        style={styles(isDividerFalse).container}
        onPress={onClick}
        disabled={disabled}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal verticalAlign="center">
            {(item?.name || item?.profileUrl || item?.profile) && (
              <Persona
                name={item?.name ? item.name : ''}
                image={item?.profileUrl! || item?.profile!}
                size={isDividerFalse ? 38 : 48}
              />
            )}
            <Stack style={styles(isDividerFalse).view}>
              {item?.name ? (
                <TextView
                  weight="medium"
                  variant={FontSizes.regular}
                  style={{width: globalScreenWidth / 2}}
                  truncate>
                  {item?.name || ''}
                </TextView>
              ) : (
                <TextView
                  variant={FontSizes.regular}
                  style={styles(isDividerFalse).label}>
                  {t('addTask:assigneePlaceholder')}
                </TextView>
              )}
              <TextView weight="regular" variant={FontSizes.small}>
                {isEmail
                  ? item?.email
                  : item?.role?.type ||
                    item?.designation ||
                    item?.role ||
                    item?.position}
              </TextView>
            </Stack>
          </Stack>
          {/* <Stack childrenGap={10} horizontal verticalAlign="center">
            <TextView weight="medium" variant={FontSizes.regular} truncate>
              {item.name}
            </TextView>
            <View style={styles().verticalDivider} />
            <TextView weight="regular" variant={FontSizes.small}>
              {isEmail ? item.email : item.position}
            </TextView>
          </Stack> */}
        </Stack>
      </TouchableOpacity>
      {!isDividerFalse && <Divider />}
    </>
  );
};

const styles = (isDividerFalse: boolean | undefined) => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: isDividerFalse ? 0 : 10,
      borderRadius: 3,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 25,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      // width: '75%',
    },
    icon: {
      justifyContent: 'center',
    },
    verticalDivider: {
      backgroundColor: colors.black,
      height: 20,
      width: 1,
    },
    label: {
      color: colors.primary_003,
    },
  });
  return mergeStyles;
};
