// Need to use the React-specific entry point to import createApi
import {API_URL} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BaseQueryFn,
  createApi,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {STR_KEYS} from 'common/storage';
import {showToast} from 'common/utils/ToastMessage';
import {t} from 'i18next';
import {LoginData} from 'request/Authentication';
import {userDataAction} from 'store/Reducer';
import {RootState} from 'store/store';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';

// Define a service using a base URL and expected endpoints

export interface Data {
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RootObject {
  success: boolean;
  message: string;
  data: Data;
}
const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  credentials: 'include',
  prepareHeaders: (headers, {getState}) => {
    const token = (getState() as RootState).formanagement.userData?.accessToken;
    const timezone = (getState() as RootState).formanagement.userData?.login
      ?.timezone;
    if (token) {
      headers.set('timezone', timezone);
      headers.set('token', token);
    }
    return headers;
  },
});

const errorStatusArray = [
  'Task is rejected, can not perform operation',
  'Task is accepted, can not perform operation',
  'Task is inprogress, can not perform operation',
  'Task is awaitingapproval, can not perform operation',
  'Task is completed, can not perform operation',
  'Task is reopened, can not perform operation',
  'Task name is invalid!',
];

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error && result.error.status === 401) {
    console.log('sending refresh token', result.error);
    if (result?.error?.data?.error?.name === 'TokenExpiredError') {
      // send refresh token to get new access token
      let fcmToken = await AsyncStorage.getItem(STR_KEYS.FCM_TOKEN);
      let deviceUniqueId: string = '';
      DeviceInfo.getUniqueId().then(res => (deviceUniqueId = res));
      let body = {
        token: (api.getState() as RootState).formanagement.userData
          ?.refreshToken,
        loginFor: 'MOBILE',
        device: {
          deviceId: DeviceInfo.getDeviceId() || '',
          osType: Platform.OS === 'android' ? 'ANDROID' : 'IOS' || '',
          osVersion: Platform.Version.toString() || '',
          deviceUniqueId: deviceUniqueId || '',
          deviceBrand: DeviceInfo.getBrand() || '',
          deviceModel: DeviceInfo.getModel() || '',
          deviceType: DeviceInfo.getDeviceType() || '',
          appVersion: '1.0',
          fcmToken: fcmToken || '',
        },
      };

      const refreshResult: RootObject = await baseQuery(
        {
          url: 'users/refreshtoken',
          method: 'POST',
          body,
        },
        api,
        extraOptions,
      );
      if (refreshResult?.data) {
        const user: LoginData | undefined = (api.getState() as RootState)
          .formanagement.userData;
        // store the new token
        await AsyncStorage.setItem(
          STR_KEYS.LOGINUSERDATA,
          JSON.stringify({
            ...user,
            accessToken: refreshResult?.data?.data?.accessToken,
            refreshToken: refreshResult?.data?.data?.refreshToken,
          }),
        );
        api.dispatch(
          userDataAction({
            ...user,
            accessToken: refreshResult?.data?.data?.accessToken,
            refreshToken: refreshResult?.data?.data?.refreshToken,
          }),
        );
        // retry the original query with new access token
        result = await baseQuery(args, api, extraOptions);
      }
    } else {
      await AsyncStorage.removeItem('UserType');
      await AsyncStorage.getItem('UserType');
      AsyncStorage.setItem(STR_KEYS.LOGINUSERDATA, '');
      api.dispatch(userDataAction(undefined));
      await AsyncStorage.removeItem(STR_KEYS.USERTOKEN);
      await AsyncStorage.removeItem(STR_KEYS.USERTYPE);
      showToast(result.error?.data.error.message);
      // api.dispatch(logOut());
    }
  } else if (result.error && result.error.status === 'FETCH_ERROR') {
    showToast(t('noNetwork'));
  } else if (result.error && result?.error?.status === 409) {
    showToast(result?.error?.data?.msg);
  } else if (result.error && result?.error?.status === 422) {
    showToast(result?.error?.data?.message);
  } else if (result.error) {
    if (
      errorStatusArray.includes((result?.error?.data?.error[0]?.msg).toString())
    ) {
      showToast(result?.error?.data?.error[0]?.msg);
    } else {
      showToast('Something went wrong.');
    }
  }
  return result;
};

export const CreateApi = createApi({
  reducerPath: 'CreateApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Event', 'EmailDetails'],
  endpoints: () => ({}),
});

// export const CreateApi = createApi({
//   reducerPath: 'CreateApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: API_URL,
//   }),
//   endpoints: () => ({}),
// });
