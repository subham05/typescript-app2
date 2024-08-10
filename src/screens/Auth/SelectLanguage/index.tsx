import AsyncStorage from '@react-native-async-storage/async-storage';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {STR_KEYS} from 'common/storage';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Loader from 'components/Loader';
import RenderLanguages from 'components/RenderLanguages';
import {Stack} from 'components/Stack';
import {RootStackParamList} from 'navigation/router';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, I18nManager, Image, StyleSheet} from 'react-native';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import i18n from 'translation/Localization';
import RNRestart from 'react-native-restart';

type Props = NativeStackScreenProps<RootStackParamList, 'SelectLanguage'>;
export const SelectLanguage = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {data: masterData, isLoading: isLoadingMaster} =
    useGetMasterCollectionQuery();
  const [languages, setLanguages] = useState<string[]>([]);

  const onLanguageClicked = async (lngCode: string) => {
    const lang = lngCode === 'arabic' ? 'ar' : 'en';
    if (i18n.language === lang) {
      i18n.changeLanguage(lang);
      await AsyncStorage.setItem(STR_KEYS.LANGUAGE_SELECTED, lang);
      navigation.navigate('Walkthrough');
    } else {
      i18n.changeLanguage(lang);
      await AsyncStorage.setItem(STR_KEYS.LANGUAGE_SELECTED, lang);
      I18nManager.forceRTL(lang === 'ar' ? true : false);
      RNRestart.Restart();
    }
  };

  useEffect(() => {
    if (masterData) {
      setLanguages(masterData.language);
    }
  }, [masterData]);

  if (isLoadingMaster) {
    return <Loader />;
  }

  return (
    <Container noSpacing>
      <Stack spacing={15} style={styles().mainStack}>
        <Image
          source={require('../../../assets/images/walkthrough/SelectLanguage.png')}
          style={styles().image}
          resizeMode={'contain'}
        />
      </Stack>
      <Stack style={styles().selectLanguageBox}>
        <TextView
          weight="semibold"
          variant={FontSizes.xlarge}
          style={styles().text}>
          {t('login:selectLanguage')}
        </TextView>
        <Stack spacing={30}>
          <RenderLanguages
            languages={languages}
            onLanguageClicked={onLanguageClicked}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

const styles = () => {
  const loginStyles = StyleSheet.create({
    text: {
      marginTop: '10%',
      textAlign: 'center',
      marginHorizontal: 26,
      marginBottom: '8%',
    },
    mainStack: {
      flex: 1,
      // marginTop: Dimensions.get('screen').height * 0.03,
    },
    // language: {
    //   backgroundColor: colors.grey_009,
    //   paddingLeft: 20,
    //   paddingVertical: 10,
    //   borderRadius: 3,
    // },
    selectLanguageBox: {
      backgroundColor: colors.white,
      height: 300,
      width: '100%',
      borderTopRightRadius: 28,
      borderTopLeftRadius: 28,
    },
    image: {
      height: Dimensions.get('screen').height / 2.5,
      width: '100%',
      marginTop: 16,
    },
    // languageText: {
    //   marginTop: -3,
    // },
  });
  return loginStyles;
};
