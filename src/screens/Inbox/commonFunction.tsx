import {CLIENT_ID, CLIENT_SECRET, GRANT_TYPE} from '@env';
import axios from 'axios';
import {LoginData} from 'request/Authentication';

export const getRefreshEmail = (userData: LoginData | undefined) => {
  return new Promise(resolve => {
    const accessObj = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: userData?.gmailSettings?.refresh_token,
      grant_type: GRANT_TYPE,
    };
    axios
      .post('https://accounts.google.com/o/oauth2/token', accessObj, {
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
        },
      })
      .then(response => resolve(response));
  });
};
export const getThreads = (response: any) => {
  return new Promise(resolve => {
    axios
      .get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response?.access_token}`,
        },
      })
      .then(response1 => resolve(response1));
  });
};
