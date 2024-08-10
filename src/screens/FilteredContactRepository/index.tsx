import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Stack, StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {KeyboardAvoidingView, Platform} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {FilteredContactMembersList} from './components/ContactMembersList';
import {Styles} from './index.styles';
import {contactList} from './mockData';

// type Props = NativeStackScreenProps<
//   SignedInStackParamList,
//   'FilteredContactRepository'
// >;
export const FilteredContactRepositoryScreen = () => {
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
        label={t('contacts:contactRepository')}
        translateY={translateY}
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
                  <FilteredContactMembersList data={contactList} />
                </Stack>
                <Stack>
                  <TextView weight="regular" variant={FontSizes.small} truncate>
                    Staff
                  </TextView>
                  <FilteredContactMembersList data={contactList} />
                </Stack>
              </StackItem>
            </Stack>
          </Animated.ScrollView>
        </KeyboardAvoidingView>
        {/* <Stack style={{height: Dimensions.get('screen').height * 0.07}}>
          <Stack spacing={16} spaceBelow={16}>
            <PrimaryButton
              title={t('save')}
              onPress={() => {
                props.navigation.navigate('PublicContactRepository');
              }}
            />
          </Stack>
        </Stack> */}
      </Stack>
    </Container>
  );
};
