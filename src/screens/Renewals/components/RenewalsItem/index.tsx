import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {renewalInterface} from 'request/Renewals';
import Text_snippet from '../../../../assets/svgs/text_snippet.svg';

interface RenewalsItemProps {
  data: renewalInterface;
  onPress: () => void;
}

export interface RenewalsProps {
  name: string;
  title: string;
  date: string;
  size: string;
}

export const RenewalsItem: React.FC<RenewalsItemProps> = ({data, onPress}) => {
  return (
    <>
      <TouchableOpacity style={styles().container} onPress={() => onPress()}>
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
              <Stack>
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  {data.name}
                </TextView>
              </Stack>
              <Stack horizontal verticalAlign="center">
                {/* <Icon
                  name="calendar"
                  size={18}
                  color={colors.primary_003}
                  style={styles().calendar}
                /> */}
                {/* <TextView
                  weight="regular"
                  variant={FontSizes.regular}
                  style={styles().text}>
                  {data.name} {' | '}
                </TextView> */}
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles().text}>
                  {data.formattedDate}
                </TextView>
              </Stack>
            </Stack>
          </Stack>
          <Icon
            name="arrow_right"
            size={18}
            color={colors.primary}
            style={styles().arrowIcon}
          />
        </Stack>
      </TouchableOpacity>
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
      width: '80%',
    },
    icon: {
      justifyContent: 'center',
    },
    calendar: {
      marginRight: 5,
    },
    text: {
      color: colors.grey_003,
    },
    arrowIcon: {
      alignSelf: 'center',
    },
  });
  return mergeStyles;
};
