import AsyncStorage from '@react-native-async-storage/async-storage';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {STR_KEYS} from 'common/storage';
import {LoginData} from 'request/Authentication';
import {InviteeUserData} from 'request/Calendar';
import {CompanyListResponseProps} from 'request/CompanyList';
import {taskStatusColor, validationData} from 'request/MasterCollection';

export interface StaffSubmenuModal {
  user: string;
}
interface InitialState {
  userData: LoginData | undefined;
  companyId: CompanyListResponseProps[];
  validations: validationData | undefined;
  statusColor: taskStatusColor | undefined;
  eventRecurrence: any;
  inviteeMembers: string[] | undefined;
  reportToCompanyId?: string;
  selectedInviteeObj?: InviteeUserData[];
}
const initialState: InitialState = {
  userData: undefined,
  companyId: [],
  validations: undefined,
  statusColor: undefined,
  eventRecurrence: undefined,
  inviteeMembers: undefined,
  reportToCompanyId: undefined,
  selectedInviteeObj: undefined,
};

export const ForManagementSlice = createSlice({
  name: 'formanagement',
  initialState,
  reducers: {
    userDataAction: (state, action: PayloadAction<LoginData | undefined>) => {
      state.userData = action.payload;
    },
    setCompanyIdAction: (
      state,
      action: PayloadAction<CompanyListResponseProps[]>,
    ) => {
      // console.log('action payload', action.payload);
      state.companyId = action.payload;
      AsyncStorage.setItem(
        STR_KEYS.SELECTED_COMPANIES,
        JSON.stringify(action.payload),
      );
      // console.log('after state change-->', state.companyId);
    },
    resetCompanyId: state => {
      state.companyId = [];
    },
    setValidations: (state, action: PayloadAction<validationData>) => {
      state.validations = action.payload;
    },
    setStatusColor: (state, action: PayloadAction<taskStatusColor>) => {
      state.statusColor = action.payload;
    },
    setEventRecurrence: (state, action: PayloadAction<any>) => {
      state.eventRecurrence = action.payload;
    },
    setInviteeMembers: (state, action: PayloadAction<any>) => {
      state.inviteeMembers = action.payload;
    },
    setReportToCompanyId: (state, action: PayloadAction<any>) => {
      state.reportToCompanyId = action.payload;
    },
    setSelectedInviteeObj: (state, action: PayloadAction<any>) => {
      state.selectedInviteeObj = action.payload;
    },
  },
});

export const {
  userDataAction,
  setCompanyIdAction,
  setValidations,
  resetCompanyId,
  setStatusColor,
  setEventRecurrence,
  setInviteeMembers,
  setReportToCompanyId,
  setSelectedInviteeObj,
} = ForManagementSlice.actions;
export default ForManagementSlice.reducer;
