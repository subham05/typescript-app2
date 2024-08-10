import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {roleType} from 'common/utils/RoleType';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {Dimensions, StyleSheet} from 'react-native';
import {accessLogsObjModal} from 'request/AccessLogs';
import Text_snippet from '../../../../assets/svgs/text_snippet.svg';

interface AccessLogsItemProps {
  data: accessLogsObjModal;
}

export interface AccessLogsProps {
  name: string;
  position: string;
  company: string;
  date: string;
  time: string;
}

export const AccessLogsItem: React.FC<AccessLogsItemProps> = ({data}) => {
  const {name, role, createdAt, company} = data;
  return (
    <>
      <Stack style={styles().container} spaceBelow={16}>
        <Stack horizontal horizontalAlign="space-between">
          <Stack horizontal>
            {/* <Icon
            name="text_snippet"
            size={18}
            color={colors.primary}
            style={styles().fileIcon}
          /> */}
            <Stack style={styles().fileIcon}>
              <Text_snippet width={20} height={20} />
            </Stack>
            <Stack style={styles().view}>
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between">
                <StackItem childrenGap={5} horizontal verticalAlign="center">
                  <TextView
                    style={styles().nameWidth}
                    weight="medium"
                    variant={FontSizes.medium}
                    truncate>
                    {name || ''}
                  </TextView>
                  <TextView
                    weight="medium"
                    variant={FontSizes.medium}
                    style={{color: colors.grey_003}}>
                    {'|'}
                  </TextView>
                  <TextView
                    weight="regular"
                    variant={FontSizes.regular}
                    style={styles().text}>
                    {roleType(role) || ''}
                  </TextView>
                </StackItem>
                <TextView
                  weight="regular"
                  variant={FontSizes.xSmall}
                  style={styles().text}>
                  {moment(createdAt).format(DateTimeFormats.MonthDateYear) !==
                  moment().format(DateTimeFormats.MonthDateYear)
                    ? moment(createdAt).format(DateTimeFormats.MonthDateYear)
                    : 'Today'}
                </TextView>
              </Stack>
              <Stack
                horizontal
                verticalAlign="center"
                horizontalAlign="space-between">
                <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={[styles().text, styles().companyWidth]}
                  numberOfLines={1}>
                  {company || ''}
                </TextView>
                <TextView
                  weight="regular"
                  variant={FontSizes.xSmall}
                  style={styles().text}>
                  {moment(createdAt).format('hh:mm A') || ''}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <Divider />
    </>
  );
};

const styles = () => {
  const mergeStyles = StyleSheet.create({
    container: {
      padding: 10,
      borderRadius: 3,
    },
    fileIcon: {
      alignSelf: 'center',
      marginRight: 15,
    },
    view: {
      marginLeft: 10,
      marginTop: 3,
      width: Dimensions.get('screen').width - 94,
    },
    text: {
      color: colors.grey_003,
    },
    nameWidth: {width: Dimensions.get('screen').width / 2.2},
    companyWidth: {width: '80%'},
  });
  return mergeStyles;
};
