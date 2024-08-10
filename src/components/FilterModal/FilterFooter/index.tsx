import {FontSizes} from 'common/theme/font';
import {globalScreenHeight} from 'common/utils/ScreenDimensions';
import {TextView} from 'components';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Ripple from 'react-native-material-ripple';
import {Styles} from '../index.styles';

interface FilterFooter {
  applyPanel: () => void;
  closePanel: () => void;
  dashboardModal?: boolean;
}

export const FilterFooter: React.FC<FilterFooter> = ({
  closePanel,
  applyPanel,
  dashboardModal,
}) => {
  const {t} = useTranslation();

  const styles = Styles();
  return (
    <Stack
      style={{
        height: globalScreenHeight * 0.07,
      }}>
      <Stack spacing={16} horizontal center style={styles.buttonView}>
        <Ripple onPress={() => applyPanel()} style={styles.loginButton}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.login}>
            {t('filter:apply')}
          </TextView>
        </Ripple>
        <Ripple onPress={() => closePanel()} style={styles.addMoreButton}>
          <TextView
            weight="medium"
            variant={FontSizes.regular}
            style={styles.addMore}>
            {dashboardModal ? t('filter:cancel') : t('filter:close')}
          </TextView>
        </Ripple>
      </Stack>
    </Stack>
  );
};
