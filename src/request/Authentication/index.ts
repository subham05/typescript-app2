// Need to use the React-specific entry point to import createApi
import {CreateApi} from 'request/CreateApi';
import {customDataModal} from 'request/Dashboard/interfaces';
import {StaffSubmenuModal} from 'store/Reducer';

export interface Device {
  deviceId: string;
  osType: string;
  osVersion: string;
  deviceUniqueId: string;
  deviceBrand: string;
  deviceModel: string;
  deviceType: string;
  appVersion: string;
  fcmToken: string | null;
}

export interface LoginBody {
  loginFor: string;
  isLoginByEmail: boolean;
  countryCode?: string;
  mobile?: string;
  otp?: string;
  email?: string;
  password?: string;
  latlong?: {
    latitude?: number | string;
    longitude?: number | string;
  };
  isLocationEnabled?: boolean;
  device: Device;
  language: string;
  isConsent: string;
}
export interface BusinessCard {
  type: string;
  fileURL: string;
  desc: string;
}

export interface Latlong {
  latitude: number;
  longitude: number;
}

export interface ResidenceAddress {
  latitude: number;
  longitude: number;
  latlong: Latlong;
  address: string;
  country: string;
  state: string;
  city: string;
}

export interface WorkAddress {
  latitude: number;
  longitude: number;
  latlong: Latlong;
  address: string;
  country: string;
  state: string;
  city: string;
}

export interface Login {
  email: string;
  emailVerified: string;
  countryCode: string;
  mobile: string;
  mobileWithCountryCode: string;
  mobileVerified: string;
}

export interface Role {
  type: string;
  roleId: string;
}

// export interface LoginData {
//   _id: string;
//   clientId: string;
//   companyId: string;
//   name: string;
//   profileUrl: string;
//   gender: string;
//   dob: string;
//   businessCard: BusinessCard;
//   designation: string;
//   department: string;
//   companyExtension: string;
//   companyNumber: string;
//   companyNumberWithExtension: string;
//   hrMobileCountryCode: string;
//   hrMobile: string;
//   hrMobileWithCountryCode: string;
//   residenceAddress: ResidenceAddress;
//   workAddress: WorkAddress;
//   login: Login;
//   role: Role;
//   accessToken: string;
// }
export interface MasterData {
  priority: string[];
  typeOfTask: string[];
  taskStatus: string[];
  companyUrl: string[];
  documentCategory: string[];
}

export interface Companies {
  _id: string;
  name: string;
  website: string;
  contact: string;
  __v: number;
}
export interface LoginData {
  _id: string;
  name: string;
  designation: string;
  login: Login;
  role: Role;
  zone: string;
  primary: string;
  profileUrl: string;
  system: string;
  status: string;
  clientId: string;
  companyId: string;
  language: string;
  companies: Companies;
  accessToken: string;
  refreshToken: string;
  masterData: MasterData;
  selectedCompanyId: string;
  performance?: string[];
  staff: StaffSubmenuModal[] | [];
  add: StaffSubmenuModal[] | [];
  gmailSettings?: {
    access_token: string;
    refresh_token: string;
    scope: string;
  };
  attendanceFilter?: string[];
  workload?: string[];
  dashboardCustomSettings?: customDataModal;
  taskReportFilter?: string[];
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginData;
}

export interface LoginOTP {
  countryCode: string;
  mobile: string;
}

export interface LoginOTPResponse {
  success: boolean;
  message: string;
}

export interface LogoutBody {
  _id?: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

interface LogoutResponseCollection {
  data: LogoutResponse;
  success: string;
  message: string;
}
export interface OtpEmailBody {
  email: string;
}

export interface OtpBody {
  email: string;
  otp: string;
}

interface SendOtpResponseCollection {
  success: boolean;
  message: string;
}

interface VerifyOtpResponseCollection {
  success: boolean;
  message: string;
}

interface SetPasswordResponseCollection {
  success: boolean;
  message: string;
}

export interface SetPasswordBody {
  newPassword: string;
  confirmPassword: string;
  email: string;
}

const AuthenticationCollection = CreateApi.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginBody>({
      query: body => ({
        url: 'users/login',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
      // transformResponse: (response: LoginResponse) => {
      //   return response.data;
      // },
    }),
    loginOTP: builder.mutation<LoginOTPResponse, LoginOTP>({
      query: body => ({
        url: 'users/get/otp',
        method: 'POST',
        // headers: {
        //   token: 'token',
        // },
        body: body,
      }),
      // transformResponse: (response: LoginResponse) => {
      //   return response.data;
      // },
    }),
    logout: builder.query<LogoutResponse, LogoutBody>({
      query: body => ({
        url: `users/logout/${body._id}`,
        method: 'Get',
        // headers: {
        //   token: 'token',
        // },
      }),
      transformResponse: (response: LogoutResponseCollection) => {
        return response.data;
      },
    }),
    sendEmailOTP: builder.mutation<SendOtpResponseCollection, OtpEmailBody>({
      query: body => ({
        url: 'users/sendemailotp',
        method: 'POST',
        body: body,
      }),
    }),
    verifyEmailOtp: builder.mutation<VerifyOtpResponseCollection, OtpBody>({
      query: body => ({
        url: 'users/verifyemailotp',
        method: 'POST',
        body: body,
      }),
    }),
    setPassword: builder.mutation<
      SetPasswordResponseCollection,
      SetPasswordBody
    >({
      query: body => ({
        url: 'users/setpassword',
        method: 'PUT',
        body: body,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useLoginOTPMutation,
  useLazyLogoutQuery,
  useSendEmailOTPMutation,
  useVerifyEmailOtpMutation,
  useSetPasswordMutation,
} = AuthenticationCollection;
