import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {Styles} from '../index.styles';

interface FilterHeader {
  showClearButton: boolean;
  clearAllFunction: () => void;
}

export const FilterHeader: React.FC<FilterHeader> = ({
  showClearButton,
  clearAllFunction,
}) => {
  const {t} = useTranslation();

  const styles = Styles();
  return (
    <>
      <Stack
        spacing={16}
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between">
        <TextView weight="medium" variant={FontSizes.medium}>
          {t('filter:head')}
        </TextView>
        {showClearButton && (
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            onPress={clearAllFunction}
            style={styles.clearAll}>
            {t('filter:clearAll')}
          </TextView>
        )}
      </Stack>
      <Stack style={styles.horizontalLine} spacing={16}>
        <Divider size={1} color={colors.grey_002} />
      </Stack>
    </>
  );
};
