import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {PrimaryButton} from 'components/Buttons';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {ContactMembersList} from './components/ContactMembersList';
import {Styles} from './index.styles';
import {contactList} from './mockData';

type Props = NativeStackScreenProps<SignedInStackParamList, 'BusinessCard'>;
export const ShareContactWithScreen = (props: Props) => {
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
        label={t('contacts:shareContactWith')}
        translateY={translateY}
        isCloseNavigation
      />
      <Stack style={styles.flex}>
        <KeyboardAvoidingView
          behavior="height"
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 20}>
          <Stack
            horizontal
            spacing={16}
            spaceBelow={16}
            style={styles.attachmentView}>
            <SearchTextField />
          </Stack>
          <TouchableOpacity onPress={() => setIsAllSelected(!isAllSelected)}>
            <Stack
              spacing={5}
              spaceBelow={16}
              horizontal
              style={styles.selectAll}
              verticalAlign="center">
              <TextView
                weight="medium"
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
          <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            <Stack spacing={16} spaceBelow={16}>
              <StackItem childrenGap={10}>
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  The walt disney company
                </TextView>
                <TextView weight="regular" variant={FontSizes.regular} truncate>
                  IT department
                </TextView>
                <Stack>
                  <TextView weight="regular" variant={FontSizes.small} truncate>
                    Managers
                  </TextView>
                  <ContactMembersList
                    data={contactList}
                    isAllSelected={isAllSelected}
                    onSelect={setIsAllSelected}
                  />
                </Stack>
                <Stack>
                  <TextView weight="regular" variant={FontSizes.small} truncate>
                    Staff
                  </TextView>
                  <ContactMembersList
                    data={contactList}
                    isAllSelected={isAllSelected}
                    onSelect={setIsAllSelected}
                  />
                </Stack>
              </StackItem>
            </Stack>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        <Stack style={{height: Dimensions.get('screen').height * 0.07}}>
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('share')}
              onPress={() => {
                props.navigation.navigate('PublicContactRepository');
              }}
            />
          </Stack>
        </Stack>
      </Stack>
    </Container>
  );
};
