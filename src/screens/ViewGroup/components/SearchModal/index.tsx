import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Styles} from 'screens/ViewGroup/index.styles';

interface SearchModalProps {
  onPressNavigate: () => void;
  onPressSearch: (val: boolean) => void;
  membersCount?: number;
  isAdmin?: boolean;
}

export const SearchModalScreen: React.FC<SearchModalProps> = ({
  onPressNavigate,
  onPressSearch,
  membersCount = 0,
  isAdmin = false,
}) => {
  const {t} = useTranslation();

  const styles = Styles();
  return (
    <Stack>
      <Stack
        spacing={16}
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.head}>
        {membersCount ? (
          <TextView weight="medium" variant={FontSizes.small}>
            {membersCount} {t('group:members')}
          </TextView>
        ) : (
          <View />
        )}

        <Ripple
          onPress={() => {
            onPressSearch(true);
          }}
          style={styles.search}>
          <Icon name="search" size={24} color={colors.black} />
        </Ripple>
      </Stack>

      {isAdmin && (
        <TouchableOpacity onPress={onPressNavigate}>
          <StackItem
            horizontal
            verticalAlign="center"
            childrenGap={10}
            spacing={10}
            style={styles.verticalMargin}>
            <Stack style={styles.iconBackground}>
              <Icon name="add_member" size={24} color={colors.white} />
            </Stack>
            <Stack center>
              <TextView weight="medium" variant={FontSizes.medium} truncate>
                Add member
              </TextView>
            </Stack>
          </StackItem>
        </TouchableOpacity>
      )}
    </Stack>
  );
};
