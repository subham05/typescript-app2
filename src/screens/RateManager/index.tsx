import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Persona} from 'components/Persona';
import {RadioButton} from 'components/RadioButton';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import SwitchToggle from 'react-native-switch-toggle';
import {genderData} from 'screens/AddOwner';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList>;
export const RateManagerScreen = ({}: Props) => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [redZone, setRedZone] = useState<boolean>(false);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header navigationType="STACK" hideLabel translateY={translateY} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <Stack spaceBelow={16}>
            <Stack horizontal horizontalAlign="space-between" center>
              <TextView
                weight="medium"
                variant={FontSizes.medium}
                style={
                  redZone ? {color: colors.red_001} : {color: colors.green}
                }>
                {redZone ? t('redZone') : t('greenZone')}
              </TextView>
              <SwitchToggle
                switchOn={redZone}
                onPress={() => setRedZone(prevState => !prevState)}
                circleColorOff={colors.white}
                circleColorOn={colors.primary}
                backgroundColorOn={colors.primary_005}
                backgroundColorOff={colors.grey_008}
                containerStyle={styles.switchContainer}
                circleStyle={styles.switchCircle}
              />
            </Stack>
          </Stack>
          <Stack spaceBelow={16}>
            <Divider size={2} />
          </Stack>
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
          </Stack>
          <Stack spaceBelow={16}>
            <Divider size={2} />
          </Stack>
          <StackItem childrenGap={10} spaceBelow={16}>
            <TextField
              label={t('accountPage:company')}
              value={'The walt disney company'}
              editable={false}
            />
            <TextView
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
                variant={FontSizes.medium}
                style={styles.showDOBInput}>
                23/02/22
              </TextView>
              <View style={styles.icon}>
                <Icon name="calendar" size={18} color={colors.grey_003} />
              </View>
            </Stack>
            <>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.genderLabel}>
                {t('managersHomePage:gender')}
              </TextView>
              <RadioButton data={genderData} disabled />
            </>
            <TextField
              label={t('addManager:designation')}
              value={'Manager'}
              editable={false}
            />
            <TextField
              label={t('addManager:department')}
              value={'Department'}
              editable={false}
            />
            <TextField
              label={t('addManager:contactNumber')}
              value={'+91 9874563210'}
              editable={false}
            />
            <TextField
              label={t('addManager:extensionNumber')}
              value={'(219) 555-0114'}
              editable={false}
            />
            <TextField
              label={t('addManager:companyExtensionNumber')}
              value={'(219) 555-0114'}
              editable={false}
            />
            <TextField
              label={t('addManager:hrContactNumber')}
              value={'+91 9874563210'}
              editable={false}
            />
            <TextField
              label={t('addManager:email')}
              value={'leslie.alexander@email.com'}
              editable={false}
            />
            <TextField
              label={t('accountPage:residenceAddress')}
              value={' 6127 Evergreen Rd, Dearborn Heights, Dubai, 48127'}
              multiline
              numberOfLines={2}
              editable={false}
            />
            <TextField
              label={t('addManager:workAddress')}
              value={' 6127 Evergreen Rd, Dearborn Heights, Dubai, 48127'}
              multiline
              numberOfLines={2}
              editable={false}
            />
          </StackItem>
        </Stack>
      </Animated.ScrollView>
    </Container>
  );
};
