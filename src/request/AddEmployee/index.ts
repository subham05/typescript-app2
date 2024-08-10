// Need to use the React-specific entry point to import createApi
import {Urls} from 'common/utils/ApiConstants';
import {
  getManagerData,
  getManagerModal,
  ManagerData,
  ManagerDetailResponseData,
  managerListData,
  ManagerModal,
  RateManagerData,
  RateManagerModal,
} from 'request/AddManager/constant';
import {CreateApi} from 'request/CreateApi';
interface editEmployeeModal {
  employeeObj: ManagerModal;
  employeeId?: string;
}
const AddOwner = CreateApi.injectEndpoints({
  endpoints: builder => ({
    setEmployee: builder.mutation<ManagerData, editEmployeeModal>({
      query: ({employeeObj}) => {
        return {
          url: Urls.setEmployee,
          method: 'POST',
          body: employeeObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    getEmployee: builder.query<managerListData, getManagerModal>({
      query: ({searchValue, companies, pageNo}) => {
        return {
          url: `${Urls.getEmployee}${pageNo}`,
          method: 'POST',
          body: {companies: companies, searchValue: searchValue},
        };
      },
      transformResponse: (response: getManagerData) => {
        return response.data;
      },
    }),
    getEmployeeDetail: builder.query<ManagerDetailResponseData, string>({
      query: employeeId => ({
        url: `${Urls.getEmployeeDetail}${employeeId}`,
        method: 'GET',
      }),
      transformResponse: (response: ManagerDetailResponseData) => {
        return response;
      },
    }),
    editEmployee: builder.mutation<ManagerData, editEmployeeModal>({
      query: ({employeeId, employeeObj}) => {
        return {
          url: `${Urls.editEmployee}${employeeId}`,
          method: 'PUT',
          body: employeeObj,
        };
      },
      transformResponse: (response: ManagerData) => {
        return response;
      },
    }),
    rateEmployee: builder.mutation<RateManagerData, RateManagerModal>({
      query: ({managerId, rateValue}) => {
        return {
          url: `${Urls.rateEmployee}${managerId}`,
          method: 'PUT',
          body: rateValue,
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
    deleteEmployee: builder.mutation<RateManagerData, string>({
      query: employeeId => {
        return {
          url: `${Urls.deleteEmployee}${employeeId}`,
          method: 'DELETE',
        };
      },
      transformResponse: (response: RateManagerData) => {
        return response;
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSetEmployeeMutation,
  useLazyGetEmployeeQuery,
  useLazyGetEmployeeDetailQuery,
  useRateEmployeeMutation,
  useEditEmployeeMutation,
  useDeleteEmployeeMutation,
} = AddOwner;
