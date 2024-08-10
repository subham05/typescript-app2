// Need to use the React-specific entry point to import createApi
import {CreateApi} from 'request/CreateApi';
import {Urls} from 'common/utils/ApiConstants';
import {
  addBusinessCardData,
  addBusinessCardModel,
  businessCArdData,
  businessCardModal,
} from './constant';

const AddBusinessCard = CreateApi.injectEndpoints({
  endpoints: builder => ({
    addBusinessCard: builder.mutation<
      addBusinessCardData,
      addBusinessCardModel
    >({
      query: businessCardObj => {
        return {
          url: Urls.addBusinessCard,
          method: 'POST',
          body: businessCardObj,
        };
      },
      transformResponse: (response: addBusinessCardData) => {
        return response;
      },
    }),
    getBusinessCardData: builder.mutation<businessCArdData, businessCardModal>({
      query: imageUrl => {
        return {
          url: Urls.getBusinessCardData,
          method: 'POST',
          body: imageUrl,
        };
      },
      transformResponse: (response: businessCArdData) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetBusinessCardDataMutation, useAddBusinessCardMutation} =
  AddBusinessCard;
