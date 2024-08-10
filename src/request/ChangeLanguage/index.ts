// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {CreateApi} from 'request/CreateApi';

interface ChangeLangData {
  success: boolean;
  message: string;
  //   data: ProfileModal;
}

export interface ChangeLangBody {
  language: string;
}

const UserLanguage = CreateApi.injectEndpoints({
  endpoints: builder => ({
    changeLanguage: builder.mutation<ChangeLangData, ChangeLangBody>({
      query: bodyObj => {
        return {
          url: Urls.changeLanguage,
          method: 'PUT',
          body: bodyObj,
        };
      },
      transformResponse: (response: ChangeLangData) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useChangeLanguageMutation} = UserLanguage;
