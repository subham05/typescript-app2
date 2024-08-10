// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';

interface ChangePassData {
  success: boolean;
  message: string;
  //   data: ProfileModal;
}

export interface ChangePassBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserPassword = CreateApi.injectEndpoints({
  endpoints: builder => ({
    changePassword: builder.mutation<ChangePassData, ChangePassBody>({
      query: bodyObj => {
        return {
          url: Urls.changePassword,
          method: 'PUT',
          body: bodyObj,
        };
      },
      transformResponse: (response: ChangePassData) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useChangePasswordMutation} = UserPassword;
