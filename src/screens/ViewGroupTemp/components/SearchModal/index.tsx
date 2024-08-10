import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Icon} from 'components/Icon';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {MessageContactList} from 'components/Messages/MessageContactList';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {Easing, withTiming} from 'react-native-reanimated';
import {Styles} from 'screens/ViewGroup/index.styles';
import {viewGroupArray} from 'screens/ViewGroup/mockData';

interface SearchModalProps {
  onPress: (val: boolean, item: MessageContactProps) => void;
  onPressNavigate: () => void;
  onPressSearch: (val: boolean) => void;
  animatedVal: any;
}

export const SearchModalScreen: React.FC<SearchModalProps> = ({
  onPress,
  onPressNavigate,
  onPressSearch,
  animatedVal,
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
        <TextView weight="medium" variant={FontSizes.small}>
          7 {t('group:members')}
        </TextView>
        <Ripple
          onPress={() => {
            onPressSearch(true);
            // if (!searchModal) {
            //   translateY.value = withTiming(height, {duration: 2000}, () => {
            //     // setSearchModal(false);
            //   });
            // } else {
            animatedVal.value = withTiming(1, {
              duration: 300,
              easing: Easing.out(Easing.exp),
            });
            // }
          }}
          style={styles.search}>
          <Icon name="search" size={24} color={colors.black} />
        </Ripple>
      </Stack>
      <Stack spacing={16} spaceBelow={16}>
        <ScrollView>
          <MessageContactList
            data={viewGroupArray}
            onPress={(value, item) =>
              value === 'Add member' ? onPressNavigate() : onPress(true, item)
            }
          />
        </ScrollView>
      </Stack>
    </Stack>
  );
};
