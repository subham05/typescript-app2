import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Icon} from 'components/Icon';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {AlertModal} from './components/AlertModal';
import {BottomModal} from './components/BottomModal';
import {ModalSearch} from './components/ModalSearch';
import {SearchModalScreen} from './components/SearchModal';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'ViewGroup'>;

// const SCREEN_HEIGHT = Dimensions.get('screen').height;

export const ViewGroupScreen = (props: Props) => {
  const {t} = useTranslation();
  const {route} = {...props};
  const {data} = {
    ...route.params,
  };

  const [dataItem, setDataItem] = useState<MessageContactProps>();

  const [searchModal, setSearchModal] = useState<boolean>(false);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [reopenModal, setReopenModal] = useState<boolean>(false);

  const animatedVal = useSharedValue(0);

  // const headerAnimatedStyles = useAnimatedStyle(() => {
  //   const translateY = interpolate(
  //     animatedVal.value,
  //     [0, 1],
  //     [SCREEN_HEIGHT, 0],
  //     Extrapolate.CLAMP,
  //   );
  //   const height = interpolate(
  //     animatedVal.value,
  //     [0, 1],
  //     [0, SCREEN_HEIGHT],
  //     Extrapolate.CLAMP,
  //   );
  //   return {
  //     transform: [{translateY}],
  //     height,
  //     // heightVal === 0 ?
  //     // setSearchModal(false):null,
  //     // }
  //     // backgroundColor:
  //     //   translateY.value >= height * 0.9 ? colors.white : colors.red,
  //     // elevation: translateY.value >= height * 0.9 ? 20 : 0,
  //   };
  // });

  // const headerScrollAnimatedStyles = useAnimatedStyle(() => {
  //   const opacity = interpolate(
  //     animatedVal.value,
  //     [0, 300],
  //     [0, 1],
  //     Extrapolate.CLAMP,
  //   );
  //   // const height = interpolate(
  //   //   animatedVal.value,
  //   //   [0, 300],
  //   //   [0, 35],
  //   //   Extrapolate.CLAMP,
  //   // );
  //   return {
  //     opacity,
  //     elevation: 20,
  //     // height,
  //     // elevation: translateY.value >= height * 0.9 ? 20 : 0,
  //     // backgroundColor: colors.primary,
  //     // heightVal === 0 ?
  //     // setSearchModal(false):null,
  //     // }
  //     // backgroundColor:
  //     //   translateY.value >= height * 0.9 ? colors.white : colors.red,
  //   };
  // });

  const scrollHandler = useAnimatedScrollHandler(event => {
    animatedVal.value = event.contentOffset.y;
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack>
        <Stack
          horizontal
          horizontalAlign="space-between"
          // style={[styles.header]}
        >
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon
              name="arrow_back"
              size={24}
              color={colors.black}
              style={styles.back}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.addMember}>
            <Menu>
              <MenuTrigger>
                <Icon name="more" size={24} color={colors.black} />
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.moreMenu}>
                <MenuOption onSelect={() => {}}>
                  <Stack horizontal>
                    <TextView weight="medium" variant={FontSizes.regular}>
                      {t('edit')}
                    </TextView>
                  </Stack>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </TouchableOpacity>
        </Stack>
      </Stack>
      {/* <Animated.View style={[headerScrollAnimatedStyles, styles.stickHeader]}>
        <Stack
          horizontal
          horizontalAlign="space-between"
          style={[styles.header]}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon
              name="arrow_back"
              size={24}
              color={colors.black}
              style={styles.back}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}} style={styles.addMember}>
            <Menu>
              <MenuTrigger>
                <Icon name="more" size={24} color={colors.black} />
              </MenuTrigger>
              <MenuOptions optionsContainerStyle={styles.moreMenu}>
                <MenuOption onSelect={() => {}}>
                  <Stack horizontal>
                    <TextView weight="medium" variant={FontSizes.regular}>
                      {t('edit')}
                    </TextView>
                  </Stack>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </TouchableOpacity>
        </Stack>
      </Animated.View> */}
      {/* <Stack
        spaceBelow={16}
        horizontal
        horizontalAlign="space-between"
        style={[styles.header]}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Icon
            name="arrow_back"
            size={24}
            color={colors.black}
            style={styles.back}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}} style={styles.addMember}>
          <Menu>
            <MenuTrigger>
              <Icon name="more" size={24} color={colors.black} />
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.moreMenu}>
              <MenuOption onSelect={() => {}}>
                <Stack horizontal>
                  <TextView weight="medium" variant={FontSizes.regular}>
                    {t('edit')}
                  </TextView>
                </Stack>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </TouchableOpacity>
      </Stack> */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode={'never'}
        onScroll={scrollHandler}>
        {/* <TouchableOpacity
          style={styles.groupIcon}
          onPress={() => props.navigation.navigate('EditGroupIcon')}>
          <Icon name="groups" size={64} color={colors.white} />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.groupIcon, {backgroundColor: colors.white}]}
          onPress={() =>
            props.navigation.navigate('EditGroupIcon', {image: data?.image})
          }>
          <StackItem childrenGap={20}>
            <Stack style={styles.groupImage}>
              <Persona name={data?.name} image={data?.image} size={150} />
            </Stack>
            <Stack horizontal>
              <TextView weight="bold" variant={FontSizes.large}>
                {data?.name}
                {'  '}
              </TextView>
              <TextView weight="bold" variant={FontSizes.large}>
                (Group name)
              </TextView>
            </Stack>
          </StackItem>
          {/* <Stack
            spacing={16}
            spaceBelow={16}
            horizontal
            horizontalAlign="space-between"
            style={styles.footer}>
            <Stack style={styles.groupName}>
              <Stack horizontal>
                <TextView weight="bold" variant={FontSizes.large}>
                  Managers{'  '}
                </TextView>
                <TextView weight="bold" variant={FontSizes.large}>
                  (Group name)
                </TextView>
              </Stack>
              <TextView weight="semibold" variant={FontSizes.small}>
              7 {t('group:members')}
            </TextView>
            </Stack>
            <TouchableOpacity
              onPress={() => props.navigation.navigate('EditGroupSubject')}
              style={styles.edit}>
              <Icon name="edit" size={24} color={colors.black} />
            </TouchableOpacity>
          </Stack> */}
        </TouchableOpacity>
        {/* <Stack
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
              setSearchModal(true);
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
              onPress={value =>
                value === 'Add member'
                  ? props.navigation.navigate('AddMember')
                  : setReopenModal(true)
              }
            />
          </ScrollView>
        </Stack> */}
        <SearchModalScreen
          onPress={(value, item) => {
            setDataItem(item);
            setReopenModal(value);
          }}
          onPressNavigate={() => props.navigation.navigate('AddMember')}
          onPressSearch={setSearchModal}
          animatedVal
        />
      </Animated.ScrollView>
      {openModal && (
        <AlertModal
          value={openModal}
          onPress={val => setOpenModal(val)}
          data={dataItem}
          groupName={data?.name}
        />
      )}
      {reopenModal && (
        <BottomModal
          data={dataItem}
          openValue
          reopenValue
          onPressOpenModal={setOpenModal}
          onPressReopenModal={setReopenModal}
          onPressChattingScreen={() =>
            props.navigation.navigate('ChattingScreen', {
              type: 'People',
              data: dataItem,
            })
          }
          onPressViewScreen={() =>
            props.navigation.navigate('ViewContact', {data: dataItem})
          }
        />
      )}
      {searchModal && (
        // <Animated.View style={[styles.searchModalView, headerAnimatedStyles]}>
        <ModalSearch value={searchModal} onPress={setSearchModal} />
        // {/* </Animated.View> */}
      )}
    </Container>
  );
};
