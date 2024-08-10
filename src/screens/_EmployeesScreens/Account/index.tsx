import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {DropDownView} from 'components/DropDownView';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {InputTextField} from 'components/InputView';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {EmployeesSignedInStackParamList} from 'navigation/Stacks/EmployeesStack/EmployeesSignedInStack';
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
  EmployeesSignedInStackParamList,
  'AccountScreen'
>;

export const EmployeesAccountScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isModalOpened, setIsModalOpened] = useState<boolean>(false);
  const [detail, setDetail] = useState<string>('');

  const [dropdownValue, setDropdownValue] = useState<string>('');
  const allDropdownValues = [
    {label: 'Owner', value: 'Owner'},
    {label: 'Manager', value: 'UTC'},
  ];

  const renderItem = (item: any) => {
    return (
      <StackItem style={styles.item} childrenGap={10}>
        <TextView weight="regular" variant={FontSizes.regular}>
          {item.label}
        </TextView>
        <Divider size={1.5} />
      </StackItem>
    );
  };

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
                    props.navigation.navigate('EmployeeShareContact')
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
                {t('accountPage:request1')}
              </TextView>
              <DropDownView
                accounts
                placeholderStyle={styles.placeholderStyle}
                data={allDropdownValues}
                labelField="label"
                valueField="value"
                placeholder={t('accountPage:select')}
                value={dropdownValue}
                onChange={item => {
                  setDropdownValue(item.value);
                }}
                renderItem={renderItem}
              />
              <InputTextField
                style={styles.inputText}
                placeholder={t('accountPage:addDetailsPlaceholder')}
                onChangeText={text => setDetail(text)}
                value={detail}
                multiline
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
