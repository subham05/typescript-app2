import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {RippleIconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {RadioButton} from 'components/RadioButton';
import {Stack} from 'components/Stack';
import {ManagerSignedInStackParamList} from 'navigation/Stacks/ManagersStack/ManagersSignedInStack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {genderData} from 'screens/AddOwner';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<ManagerSignedInStackParamList>;
export const VendorContactsDetailsScreen = (props: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header navigationType="STACK" hideLabel translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <Stack horizontal horizontalAlign="space-between">
            <Stack horizontal>
              <Persona name="Leslie Alexander" />
              <Stack style={styles.viewContact}>
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  Leslie Alexander
                </TextView>
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={{color: colors.grey_003}}>
                  (406) 555-0120
                </TextView>
              </Stack>
            </Stack>
            <RippleIconButton
              name="edit"
              onPress={() => {
                props.navigation.navigate('AddVendor', {edit: true});
              }}
              color={colors.black}
              size={21}
              style={styles.editButton}
            />
          </Stack>
          <Divider size={2} />
          <Stack spaceBelow={16}>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('managersHomePage:nameCompany')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.showInput}>
              The walt Disney Company
            </TextView>
            {/* <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('accountPage:dob')}
            </TextView>
            <Stack
              horizontal
              horizontalAlign="space-between"
              style={styles.dob}>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.showInput}>
                23/02/22
              </TextView>
              <View style={styles.icon}>
                <Icon name="calendar" size={18} color={colors.grey_003} />
              </View>
            </Stack> */}
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.genderLabel}>
              {t('managersHomePage:gender')}
            </TextView>
            <RadioButton data={genderData} disabled />
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('managersHomePage:email')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.showInput}>
              leslie.alexander@email.com
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('addOwner:contactNumber')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.showInput}>
              (406) 555-0120
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('addOwner:alternate_contactNumber')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.showInput}>
              (406) 555-0121
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('managersHomePage:address')}
            </TextView>
            <TextView
              weight="regular"
              variant={FontSizes.medium}
              style={styles.inputDescription}>
              6127 Evergreen Rd, Dearborn Heights, Dubai, 48127
            </TextView>
          </Stack>
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
