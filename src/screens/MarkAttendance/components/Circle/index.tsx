import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {StyleProp, ViewStyle} from 'react-native';
import {Styles} from '../../index.styles';

interface AttendanceCircleProps {
  checkIn: string | undefined;
  checkOut: string | undefined;
  currentStatus: boolean;
}
export const AttendanceCircle: React.FC<AttendanceCircleProps> = ({
  // checkIn,
  currentStatus,
}) => {
  const {t} = useTranslation();

  const backgroundColorStyle: StyleProp<ViewStyle> | undefined = {
    backgroundColor: currentStatus ? colors.primary_002 : colors.primary,
  };
  const styles = Styles();
  return (
    <Stack style={[styles.circle, backgroundColorStyle]}>
      <Icon name="touch" size={100} color={colors.white} />
      <TextView
        weight="regular"
        variant={FontSizes.medium}
        style={styles.checkInOut}>
        {currentStatus ? t('attendance:checkOut') : t('attendance:checkIn')}
      </TextView>
    </Stack>
  );
};
