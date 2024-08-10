import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Ripple from 'react-native-material-ripple';
import Modal from 'react-native-modal';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {PersonalDetails} from 'screens/Account/components/PersonalDetails';
import {Styles} from './index.styles';

const userImage =
  'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

type Props = NativeStackScreenProps<
  ManagerSignedInStackParamList,
  'ManagersAccountScreen'
>;

export const ManagersAccountScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [detail, setDetail] = useState<string>('');

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
                weight="semibold"
                variant={FontSizes.large}
                style={styles.name}
                truncate>
                Leslie Alexander
              </TextView>
              <Stack horizontal horizontalAlign="space-between">
                <TouchableOpacity
                  onPress={() =>
                    props.navigation.navigate('ManagersShareContact')
                  }
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('accountPage:shareContact')}
                  </TextView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setIsModalOpened(true);
                  }}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('accountPage:askShare')}
                  </TextView>
                </TouchableOpacity>
              </Stack>
            </Stack>
          </Stack>
          <PersonalDetails />
        </KeyboardAwareScrollView>
      </Animated.ScrollView>
      {isModalOpened ? (
        <Modal
          isVisible={isModalOpened}
          onBackdropPress={() => setIsModalOpened(false)}
          onBackButtonPress={() => setIsModalOpened(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextView
                weight="bold"
                variant={FontSizes.regular}
                style={styles.shareVia}>
                {t('accountPage:request')}
              </TextView>
              <InputTextField
                style={styles.inputText}
                placeholder={t('accountPage:addDetailsPlaceholder')}
                onChangeText={text => setDetail(text)}
                value={detail}
              />
              <Stack style={styles.cancel}>
                <TouchableOpacity
                  onPress={() => setIsModalOpened(false)}
                  style={styles.shareButton}>
                  <TextView
                    weight="medium"
                    variant={FontSizes.small}
                    style={styles.share}>
                    {t('send')}
                  </TextView>
                </TouchableOpacity>
              </Stack>
            </View>
          </View>
        </Modal>
      ) : (
        <></>
      )}
    </Container>
  );
};
