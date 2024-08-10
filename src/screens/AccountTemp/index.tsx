import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {OfficeLocation} from './components/OfficeLocation';
import {PersonalDetails} from './components/PersonalDetails';
import {Styles} from './index.styles';

const userImage =
  'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

type Props = NativeStackScreenProps<SignedInStackParamList, 'AccountScreen'>;

export const AccountScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('accountPage:head')}
        translateY={translateY}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <KeyboardAwareScrollView bounces={false} overScrollMode={'never'}>
          <Stack spaceBelow={150}>
            <Stack horizontal spacing={16} spaceBelow={16}>
              <Ripple
                onPress={() =>
                  props.navigation.navigate('EditGroupIcon', {
                    profile: true,
                    image: userImage,
                  })
                }>
                <Persona name="Leslie Alexander" image={userImage} size={92} />

                <Icon
                  name="camera"
                  size={18}
                  color={colors.white}
                  style={styles.iconImage}
                />
              </Ripple>
              {/* <Image
            source={{uri: 'https://picsum.photos/200/300'}}
            style={styles.image}
          /> */}
              <Stack style={styles.view}>
                <TextView
                  weight="medium"
                  variant={FontSizes.large}
                  style={styles.name}
                  truncate>
                  Leslie Alexander
                </TextView>
                <Stack style={styles.shareButton}>
                  <PrimaryButton
                    title={t('accountPage:shareContact')}
                    onPress={() => props.navigation.navigate('ShareContact')}
                    height={38}
                    fontSize={FontSizes.small}
                  />
                </Stack>
                {/* <TouchableOpacity
                  onPress={() => props.navigation.navigate('ShareContact')}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('accountPage:shareContact')}
                  </TextView>
                </TouchableOpacity> */}
              </Stack>
            </Stack>
            <PersonalDetails />
            <OfficeLocation />
          </Stack>
        </KeyboardAwareScrollView>
      </Animated.ScrollView>
    </Container>
  );
};
