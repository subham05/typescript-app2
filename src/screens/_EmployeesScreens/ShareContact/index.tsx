import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {MembersList} from 'components/Members/MembersList';
import {Stack} from 'components/Stack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {shareMembersList} from 'screens/ShareContact/mockData';
import {Styles} from './index.styles';

export const EmployeeShareContactScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Stack style={styles.view}>
        <Stack style={styles.view}>
          <Header
            navigationType="STACK"
            label={t('accountPage:contacts')}
            translateY={translateY}
            isCloseNavigation
          />
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <TouchableOpacity onPress={() => setIsAllSelected(!isAllSelected)}>
              <Stack
                spacing={5}
                spaceBelow={16}
                horizontal
                style={styles.selectAll}>
                <TextView
                  weight="semibold"
                  variant={FontSizes.regular}
                  style={styles.selectAllText}>
                  {t('selectAll')}
                </TextView>
                {isAllSelected ? (
                  <Icon name="check_box" size={20} color={colors.primary_002} />
                ) : (
                  <Icon
                    name="check_box_blank"
                    size={20}
                    color={colors.primary_002}
                  />
                )}
              </Stack>
            </TouchableOpacity>
            <Stack spacing={16} spaceBelow={16}>
              <MembersList
                data={shareMembersList}
                showCheckBox={true}
                isAllSelected={isAllSelected}
                onSelect={setIsAllSelected}
                isEmail
              />
            </Stack>
          </Animated.ScrollView>
        </Stack>
        <Stack style={styles.shareButtonView}>
          <TouchableOpacity onPress={() => {}} style={styles.shareButton}>
            <TextView
              weight="medium"
              variant={FontSizes.small}
              style={styles.share}>
              {t('share')}
            </TextView>
          </TouchableOpacity>
        </Stack>
      </Stack>
    </Container>
  );
};
