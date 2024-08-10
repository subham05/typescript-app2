import AsyncStorage from '@react-native-async-storage/async-storage';
import {STR_KEYS} from 'common/storage';
import {FontSizes} from 'common/theme/font';
import {showToast} from 'common/utils/ToastMessage';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import RenderLanguages from 'components/RenderLanguages';
import {Stack} from 'components/Stack';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {I18nManager, Image} from 'react-native';
import RNRestart from 'react-native-restart';
import {useSharedValue} from 'react-native-reanimated';
import {
  ChangeLangBody,
  useChangeLanguageMutation,
} from 'request/ChangeLanguage';
import {useGetMasterCollectionQuery} from 'request/MasterCollection';
import {Styles} from './index.styles';
import i18n from 'translation/Localization';

export const ChangeLanguage = () => {
  const {t} = useTranslation();
  // const navigation = useNavigation();
  const translateY = useSharedValue(0);
  const [changeLangApi, {isLoading}] = useChangeLanguageMutation();
  const {data: masterData, isLoading: isLoadingMaster} =
    useGetMasterCollectionQuery();
  const [languages, setLanguages] = useState<string[]>([]);

  const LanguageClicked = async (lang: string) => {
    const bodyObj: ChangeLangBody = {
      language: lang,
    };
    let languageSelected = await AsyncStorage.getItem(
      STR_KEYS.LANGUAGE_SELECTED,
    );
    const lng = lang === 'arabic' ? 'ar' : 'en';
    if (languageSelected !== lng) {
      console.log(
        '🚀 ~ file: index.tsx:41 ~ LanguageClicked ~ bodyObj:',
        bodyObj,
      );
      changeLangApi(bodyObj)
        .then(async (res: any) => {
          if (res.error) {
            showToast(res.error.data.error.message || t('somethingWrong'));
          } else {
            await AsyncStorage.setItem(STR_KEYS.LANGUAGE_SELECTED, lng);
            i18n.changeLanguage(lng);
            I18nManager.forceRTL(lng === 'ar' ? true : false);
            showToast(res.data.message ?? 'Language updated');
            RNRestart.Restart();
          }
        })
        .catch(() => {
          showToast(t('somethingWrong'));
        });
    } else {
      showToast(`${t('currentLanguage')} ${lang}`);
    }
  };

  useEffect(() => {
    if (masterData) {
      setLanguages(masterData.language);
    }
  }, [masterData]);

  if (isLoading || isLoadingMaster) {
    return <Loader />;
  }

  return (
    <Container noSpacing>
      <Header translateY={translateY} hideLabel />
      <Stack spacing={15} style={Styles.mainStack}>
        <Image
          source={require('../../assets/images/walkthrough/SelectLanguage.png')}
          style={Styles.image}
          resizeMode={'contain'}
        />
      </Stack>
      <Stack style={Styles.selectLanguageBox}>
        <TextView
          weight="semibold"
          variant={FontSizes.xlarge}
          style={Styles.text}>
          {t('login:selectLanguage')}
        </TextView>
        <Stack spacing={30}>
          <RenderLanguages
            languages={languages}
            onLanguageClicked={LanguageClicked}
          />
        </Stack>
      </Stack>
    </Container>
  );
};
