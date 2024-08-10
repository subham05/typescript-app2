import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container} from 'components';
import Header from 'components/Header';
import Loader from 'components/Loader';
import {AuthStackParamList} from 'navigation/Stacks/AuthStack';
import React, {useEffect} from 'react';
import {Platform, View} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import WebView from 'react-native-webview';
import {
  CMSBodyParams,
  useGetCMSAboutMutation,
  useGetCMSPrivacyMutation,
  useGetCMSTermsMutation,
} from 'request/MasterCollection';
import {styles} from './index.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'CMSScreen'>;

const CMSScreen = ({route}: Props) => {
  const {cameFrom} = {...route.params};

  const translateY = useSharedValue(0);

  const [trigger, {isLoading, isSuccess, data, isError, error}] =
    useGetCMSPrivacyMutation();

  const [
    triggerTerms,
    {
      isLoading: isLoadingTerms,
      isSuccess: isSuccessTerms,
      data: dataTerms,
      isError: isErrorTerms,
      error: errorTerms,
    },
  ] = useGetCMSTermsMutation();

  const [
    triggerAbout,
    {
      isLoading: isLoadingAbout,
      isSuccess: isSuccessAbout,
      data: dataAbout,
      isError: isErrorAbout,
      error: errorAbout,
    },
  ] = useGetCMSAboutMutation();

  const getCMS = () => {
    let bodyObj: CMSBodyParams = {
      osType: Platform.OS === 'android' ? 'ANDROID' : 'IOS',
    };
    if (cameFrom === 'Privacy policy') {
      trigger(bodyObj);
    } else if (cameFrom === 'Terms of service') {
      triggerTerms(bodyObj);
    } else if (cameFrom === 'About us') {
      triggerAbout(bodyObj);
    }
  };

  useEffect(() => {
    getCMS();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameFrom]);

  useEffect(() => {
    if (isSuccess && data?.success) {
      // showToast(data.message);
    } else if (isError) {
      // showToast(error as string);
    }
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    if (isSuccessTerms && dataTerms?.success) {
      // showToast(data.message);
    } else if (isErrorTerms) {
      // showToast(error as string);
    }
  }, [dataTerms, isSuccessTerms, isErrorTerms, errorTerms]);

  useEffect(() => {
    if (isSuccessAbout && dataAbout?.success) {
      // showToast(data.message);
    } else if (isErrorAbout) {
      // showToast(error as string);
    }
  }, [dataAbout, isSuccessAbout, isErrorAbout, errorAbout]);

  const SCRIPT = `
    const meta = document.createElement('meta');
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
    meta.setAttribute('name', 'viewport');
    document.head.appendChild(meta);
    true;
    `;

  return (
    <Container>
      <Header navigationType="STACK" hideLabel translateY={translateY} />
      <View style={styles.mainView}>
        <WebView
          source={{
            uri:
              cameFrom === 'Privacy policy'
                ? `${data?.data}`
                : cameFrom === 'Terms of service'
                ? `${dataTerms?.data}`
                : `${dataAbout?.data}`,
          }}
          style={[styles.webView]}
          injectedJavaScript={SCRIPT}
          onMessage={() => {}}
          javaScriptEnabled={true}
        />
      </View>
      {(isLoading || isLoadingTerms || isLoadingAbout) && <Loader />}
    </Container>
  );
};

export default CMSScreen;
