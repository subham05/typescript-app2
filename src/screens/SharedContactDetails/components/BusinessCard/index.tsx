import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {DateTimeFormats} from 'common/utils/DateTimeFormats';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import moment from 'moment';
import React from 'react';
import {Dimensions} from 'react-native';
import {ContactModal, FilterModal} from 'screens/Contacts';
import {sharedBusinessData} from 'screens/CreateContact/types';
import ForLogo from '../../../../assets/svgs/FM_logo.svg';
import {Styles} from '../../index.styles';
interface bussinessCardModal {
  selectedItem: ContactModal | FilterModal | sharedBusinessData; // remove that optional ("?") once shared implement;
}
export const BusinessCard: React.FC<bussinessCardModal> = ({selectedItem}) => {
  const styles = Styles();
  const {
    contactName,
    contactEmail,
    contactAddress,
    contactPhone,
    contactDesignation,
    companyName,
    formattedDate,
    formattedTime,
    updatedAt,
  } = selectedItem!;
  const getDateTime = () =>
    `${
      formattedDate || moment(updatedAt).format(DateTimeFormats.YearMonthDay)
    }` + ` ${formattedTime || moment(updatedAt).format(DateTimeFormats.Time)}`;
  return (
    <Stack style={styles.background}>
      <StackItem spacing={25} childrenGap={15} style={styles.card}>
        <Stack horizontal horizontalAlign="space-between">
          <StackItem childrenGap={5}>
            <TextView
              weight="medium"
              variant={FontSizes.xMedium}
              style={styles.nameColor}
              numberOfLines={1}>
              {contactName || '---'}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.small}
              style={[
                styles.textColor,
                {width: Dimensions.get('screen').width / 1.5},
              ]}
              truncate>
              {contactDesignation || '---'}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.textColor}
              truncate>
              {companyName || '---'}
            </TextView>
          </StackItem>
          <ForLogo height={40} width={40} style={styles.logo} />
        </Stack>
        <Divider size={1.5} color={colors.primary_004} />
        <StackItem childrenGap={10}>
          <Stack horizontal verticalAlign="center">
            <Icon name="phone" size={24} color={colors.primary_005} />
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.text}>
              {contactPhone || '---'}
            </TextView>
          </Stack>
          <Stack horizontal verticalAlign="center">
            <Icon name="inbox" size={24} color={colors.primary_005} />
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.text}>
              {contactEmail || '---'}
            </TextView>
          </Stack>
          <Stack horizontal verticalAlign="center">
            <Icon name="location" size={24} color={colors.primary_005} />
            <TextView
              weight="regular"
              variant={FontSizes.xxSmall}
              style={styles.text}>
              {contactAddress || '---'}
            </TextView>
          </Stack>
        </StackItem>
      </StackItem>
      <TextView
        weight="regular"
        variant={FontSizes.xxSmall}
        style={styles.source}>
        Source: {contactName || '---'} {getDateTime()}
      </TextView>
    </Stack>
  );
};
