// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

interface ViewProfileData {
  success: boolean;
  message: string;
  data: DataModal;
}

interface DataModal {
  foundUser: ProfileModal;
  officeLocation: OfficeLocationModal[];
}

export interface ProfileModal {
  _id: string;
  companyId?: any;
  name: string;
  dob: string;
  designation: string;
  email: string;
  mobile: string;
}

export interface OfficeLocationModal {
  _id: string;
  name: string;
}

interface ProfileRes {
  success: boolean;
  message: string;
  Data?: any;
}

export interface ProfilePhotoBody {
  profileImage: string;
  profileImageDetail: ProfileImageDetailsObj;
}

export interface ProfileBody {
  name: string;
  dob: string;
}

export interface OfficeLocationListBody {
  searchText: string;
  pageNo: number;
}

const UserProfile = CreateApi.injectEndpoints({
  endpoints: builder => ({
    viewProfile: builder.query<ViewProfileData, {}>({
      query: () => {
        return {
          url: Urls.viewProfile,
          method: 'GET',
        };
      },
      transformResponse: (response: ViewProfileData) => {
        return response;
      },
    }),

    editProfile: builder.mutation<ProfileRes, ProfileBody>({
      query: bodyObj => {
        return {
          url: Urls.editProfile,
          method: 'PUT',
          body: bodyObj,
        };
      },
      transformResponse: (response: ProfileRes) => {
        return response;
      },
    }),

    updateProfileImage: builder.mutation<ProfileRes, ProfilePhotoBody>({
      query: bodyObj => {
        return {
          url: Urls.uploadProfileImage,
          method: 'PUT',
          body: bodyObj,
        };
      },
      transformResponse: (response: ProfileRes) => {
        return response;
      },
    }),

    deleteProfileImage: builder.query<ProfileRes, {}>({
      query: () => {
        return {
          url: Urls.deleteProfileImage,
          method: 'DELETE',
        };
      },
      transformResponse: (response: ProfileRes) => {
        return response;
      },
    }),

    officeLocationList: builder.mutation<ProfileRes, OfficeLocationListBody>({
      query: bodyObj => {
        return {
          url: Urls.officeLocationList,
          method: 'POST',
          body: bodyObj,
        };
      },
      transformResponse: (response: ProfileRes) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLazyViewProfileQuery,
  useEditProfileMutation,
  useUpdateProfileImageMutation,
  useLazyDeleteProfileImageQuery,
  useOfficeLocationListMutation,
} = UserProfile;
