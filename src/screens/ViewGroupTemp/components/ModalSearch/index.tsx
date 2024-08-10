import {colors} from 'common/theme/colors';
import {RippleIconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/InputView';
import {SearchMessageContactList} from 'components/Messages/SearchModal/MessageContactList';
import {Stack} from 'components/Stack';
import React from 'react';
import {Dimensions} from 'react-native';
import Animated, {
  Easing,
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Styles} from 'screens/ViewGroup/index.styles';
import {viewSearchGroupArray} from 'screens/ViewGroup/mockData';

interface ModalSearchProps {
  value: boolean;
  onPress: (val: boolean) => void;
}

const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const ModalSearch: React.FC<ModalSearchProps> = ({onPress}) => {
  const animatedVal = useSharedValue(0);

  const headerAnimatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedVal.value,
      [0, 1],
      [SCREEN_HEIGHT, 0],
      Extrapolate.CLAMP,
    );
    const height = interpolate(
      animatedVal.value,
      [0, 1],
      [0, SCREEN_HEIGHT],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateY}],
      height,
      // heightVal === 0 ?
      // setSearchModal(false):null,
      // }
      // backgroundColor:
      //   translateY.value >= height * 0.9 ? colors.white : colors.red,
      // elevation: translateY.value >= height * 0.9 ? 20 : 0,
    };
  });

  const styles = Styles();
  return (
    <Animated.View style={[styles.searchModalView, headerAnimatedStyles]}>
      <>
        <Stack horizontal spaceBelow={16} style={styles.attachmentView}>
          <RippleIconButton
            name="arrow_back"
            size={24}
            color={colors.black}
            style={styles.modalBack}
            onPress={() => {
              animatedVal.value = withTiming(0, {
                duration: 300,
                easing: Easing.in(Easing.exp),
              });
              //   setSearchModal(false);
              onPress(false);
            }}
          />
          {/* <Ripple
            onPress={() => {
              animatedVal.value = withTiming(0, {
                duration: 300,
                easing: Easing.in(Easing.exp),
              });
              //   setSearchModal(false);
              onPress(false);
            }}>
            <Icon
              name="arrow_back"
              size={24}
              color={colors.black}
              style={styles.modalBack}
            />
          </Ripple> */}
          {/* <Stack style={styles.attachmentIcon}>
              <Icon name="search" size={18} color={colors.primary_003} />
            </Stack> */}
          <SearchTextField searchIcon />
        </Stack>
        <SearchMessageContactList data={viewSearchGroupArray} />
      </>
    </Animated.View>
  );
};
