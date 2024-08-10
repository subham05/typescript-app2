import React, {useContext, useEffect, useState} from 'react';
import {Container} from 'components';
import {WebView} from 'react-native-webview';
import queryString from 'query-string';
import Loader from 'components/Loader';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {EmailStackParamList} from 'navigation/Stacks/InboxEmailStack';
import axios from 'axios';
import {NavContext} from 'navigation/router';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  GRANT_TYPE,
  GRANT_TYPE_2,
  REDIRECT_URI,
} from '@env';
import {
  useAddEmailThreadsMutation,
  useGmailSettingMutation,
} from 'request/Inbox';
import {Platform, StyleSheet} from 'react-native';
import {showToast} from 'common/utils/ToastMessage';
import {SettingsResponse} from './constants';

type Props = NativeStackScreenProps<EmailStackParamList, 'emailType'>;
const LoginWithGoogle = (props: Props) => {
  const {saveMailLoggedIn} = useContext(NavContext);
  const [isLoading, setIsLoading] = useState(false);
  const [setMailThread, {data: mailThreadData, isSuccess: mailThreadSuccess}] =
    useAddEmailThreadsMutation();
  const [setGmailSetting] = useGmailSettingMutation();
  useEffect(() => {
    return () => {
      setIsLoading(false);
    };
  }, []);

  useEffect(() => {
    if (mailThreadSuccess && mailThreadData) {
      saveMailLoggedIn();
      setIsLoading(false);
      props.navigation.navigate('Inbox');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mailThreadSuccess]);

  const getThreads = (response: any) => {
    axios
      .get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.access_token}`,
        },
      })
      .then(response1 => {
        const obj = {messages: response1.data?.messages, labelIds: ['INBOX']};
        setMailThread(obj);
      });
  };
  const getAccessToken = (
    response: any,
    code: string | (string | null)[] | null,
  ) => {
    const accessObj = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: response.refresh_token,
      grant_type: GRANT_TYPE,
    };
    axios
      .post('https://accounts.google.com/o/oauth2/token', accessObj, {
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.access_token}`,
        },
      })
      .then(response1 => {
        axios
          .get('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
            headers: {
              Accept: 'application.json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${response.access_token}`,
            },
          })
          .then(profileResponse => {
            const obj = {
              code: code as string,
              refresh_token: response.refresh_token,
              access_token: response1.data.access_token,
              scope: response1.data?.scope,
              gmail: profileResponse.data?.emailAddress,
            };
            setGmailSetting(obj)
              .unwrap()
              .then(res => {
                if (res?.success) {
                  getThreads(response1.data);
                } else if (res?.message === SettingsResponse?.alreadyExists) {
                  setIsLoading(false);
                  showToast(res?.message);
                  props.navigation.pop();
                }
              });
          });
      });
  };
  const getRefreshToken = (code: string | (string | null)[] | null) => {
    setIsLoading(true);
    const obj = {
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: GRANT_TYPE_2,
    };
    axios
      .post('https://accounts.google.com/o/oauth2/token', obj, {
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => {
        getAccessToken(response.data, code);
      });
  };
  return (
    <Container noSpacing>
      {isLoading ? (
        <Loader />
      ) : (
        <WebView
          cacheEnabled={false}
          cacheMode="LOAD_NO_CACHE"
          incognito={true}
          source={{
            uri: 'https://accounts.google.com/o/oauth2/v2/auth?scope=https://mail.google.com&access_type=offline&redirect_uri=http://localhost/&response_type=code&client_id=276049342100-qbgaouanen98ajgn7srvdvkt9197qr39.apps.googleusercontent.com',
          }}
          userAgent={
            Platform?.OS === 'ios'
              ? 'Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19'
              : 'Mozilla/5.0 (Linux; Android 10; SM-J105H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.164 Mobile Safari/537.36'
          }
          style={styles().WebViewStyle}
          onNavigationStateChange={state => {
            if (state.url.includes('http://localhost/?code')) {
              const parsed = queryString.parseUrl(state.url);
              getRefreshToken(parsed.query.code);
            }
          }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          renderLoading={() => <Loader />}
          startInLoadingState={true}
        />
      )}
    </Container>
  );
};
const styles = () => {
  const mergeStyles = StyleSheet.create({
    WebViewStyle: {
      flex: 1,
    },
  });
  return mergeStyles;
};
export default LoginWithGoogle;
