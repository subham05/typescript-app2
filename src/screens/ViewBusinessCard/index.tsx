import {Container} from 'components';
import Header from 'components/Header';
import {Stack} from 'components/Stack';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import {BusinessCard} from 'screens/SharedContactDetails/components/BusinessCard';
import {Styles} from './index.styles';

// type Props = NativeStackScreenProps<
//   SignedInStackParamList,
//   'FilteredContactRepository'
// >;
export const ViewBusinessCardScreen = () => {
  const {t} = useTranslation();

  const translateY = useSharedValue(0);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('businessCard:view')}
        translateY={translateY}
      />
      <Stack style={styles.flex}>
        <Stack spacing={16}>
          <BusinessCard />
        </Stack>
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
