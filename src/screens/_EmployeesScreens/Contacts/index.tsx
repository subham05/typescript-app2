import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {SearchTextField} from 'components/InputView';
import {MembersList} from 'components/Members/MembersList';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {notificationContactList} from 'screens/NotificationContactRequest/mockData';
import {Styles} from './index.styles';

// type Props = NativeStackScreenProps<
//   EmployeesSignedInStackParamList,
//   'ReallocateTo'
// >;
export const ReallocateToScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('manageTask:reAllocateTo')}
        translateY={translateY}
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField />
      </Stack>
      <TouchableOpacity onPress={() => setIsAllSelected(!isAllSelected)}>
        <Stack spacing={5} spaceBelow={16} horizontal style={styles.selectAll}>
          <TextView
            weight="semibold"
            variant={FontSizes.regular}
            style={styles.selectAllText}>
            {t('selectAll')}
          </TextView>
          {isAllSelected ? (
            <Icon name="check_box" size={20} color={colors.primary_002} />
          ) : (
            <Icon name="check_box_blank" size={20} color={colors.primary_002} />
          )}
        </Stack>
      </TouchableOpacity>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <MembersList
            data={notificationContactList}
            showCheckBox={true}
            isAllSelected={isAllSelected}
            onSelect={setIsAllSelected}
          />
        </Stack>
      </Animated.ScrollView>
      <Stack spacing={16} spaceBelow={16}>
        <PrimaryButton
          title={t('manageTask:sendForApproval')}
          onPress={() => {}}
        />
      </Stack>
    </Container>
  );
};
