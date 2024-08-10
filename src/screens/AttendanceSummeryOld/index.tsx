import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {IconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React from 'react';
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
import {Stack} from 'stack-container';
import {AttendanceList} from './components/AttendanceList';
import {Styles} from './index.styles';
import {attendanceList} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const AttendanceSummeryScreen = ({navigation}: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const renderLeftContainer = () => {
    return (
      <Stack horizontal childrenGap={10} center style={styles.leftContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('SelectCompany')}>
          <Stack horizontal verticalAlign="center">
            <TextView
              weight="medium"
              variant={FontSizes.regular}
              numberOfLines={1}
              style={styles.companyName}>
              The walt disney company
            </TextView>
            <Icon name="arrow_selection" size={24} color={colors.black} />
          </Stack>
        </TouchableOpacity>
        <Menu>
          <MenuTrigger>
            <Icon name="filter" size={24} color={colors.black} />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={styles.filterWidth}>
            <MenuOption onSelect={() => {}}>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.shareText}>
                {t('attendance:own')}
              </TextView>
            </MenuOption>
            <Stack spacing={16}>
              <Divider size={2} />
            </Stack>
            <MenuOption onSelect={() => {}}>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.shareText}>
                {t('attendance:manager')}
              </TextView>
            </MenuOption>
            <Stack spacing={16}>
              <Divider size={2} />
            </Stack>
            <MenuOption onSelect={() => {}}>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.shareText}>
                {t('attendance:employee')}
              </TextView>
            </MenuOption>
          </MenuOptions>
        </Menu>
        <Menu>
          <MenuTrigger>
            <Icon name="more" size={24} color={colors.black} />
          </MenuTrigger>
          <MenuOptions optionsContainerStyle={styles.configureWidth}>
            <MenuOption
              onSelect={() => {
                navigation.navigate('AttendanceReportConfiguration');
              }}>
              <Stack horizontal childrenGap={5} center>
                <Icon name="time" size={20} color={colors.black} />
                <TextView weight="regular" variant={FontSizes.regular}>
                  {t('attendance:configure')}
                </TextView>
              </Stack>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        // label={t('attendance:head')}
        hideLabel
        translateY={translateY}
        RenderLeftContainer={renderLeftContainer}
      />
      <Stack
        spacing={16}
        horizontal
        horizontalAlign="space-between"
        style={styles.head}
        center>
        <TextView weight="semibold" variant={FontSizes.xlarge}>
          {t('attendance:head')}
        </TextView>
        <Stack horizontal childrenGap={10} center>
          <Stack center style={styles.icon}>
            <IconButton
              name="arrow_left"
              size={16}
              color={colors.black}
              onPress={() => {}}
            />
          </Stack>
          <TextView weight="semibold" variant={FontSizes.regular}>
            Dec, 2021
          </TextView>
          <Stack center style={styles.icon}>
            <IconButton
              name="arrow_right"
              size={16}
              color={colors.black}
              onPress={() => {}}
            />
            {/* <TouchableOpacity onPress={() => monthAdd(calRef)}>
              <Icon name="arrow_right" size={18} color={colors.black} />
            </TouchableOpacity> */}
          </Stack>
        </Stack>
      </Stack>
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField />
      </Stack>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <AttendanceList
            data={attendanceList}
            onPress={() => {
              navigation.navigate('AttendanceReport');
            }}
          />
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
