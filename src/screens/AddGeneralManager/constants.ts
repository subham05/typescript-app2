import {locationModal} from 'components/GooglePlaces';
import {FormikProps} from 'formik';
import {MutableRefObject} from 'react';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {dataModal} from 'request/AddManager/constant';
import {AddGeneralManagerProps} from './types';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export const InitialValues: AddGeneralManagerProps = {
  companyId: [],
  company: '',
  name: '',
  designation: '',
  gender: {id: 1, value: 'Male'},
  department: '',
  mobile: '',
  countryCode: '',
  alternateMobile: '',
  alternateMobileCountryCode: '',
  email: '',
  address: '',
  dob: '',
  // extensionNumber: '',
  hrMobile: '',
  hrMobileCountryCode: '',
  companyExtension: '',
  companyNumber: '',
  addressArea: '',
  city: '',
  country: '',
  state: '',
  zipcode: '',
  workAddressArea: '',
  workAddressBlock: '',
  workCity: '',
  workCountry: '',
  workState: '',
  workZipcode: '',
  countryShort: '',
  reportTo: '',
};

export const resetManagerData = () => {
  InitialValues.companyId = [];
  InitialValues.company = '';
  InitialValues.name = '';
  InitialValues.designation = '';
  InitialValues.gender = {id: 1, value: 'Male'};
  InitialValues.department = '';
  InitialValues.mobile = '';
  InitialValues.countryCode = '';
  InitialValues.alternateMobile = '';
  InitialValues.alternateMobileCountryCode = '';
  InitialValues.email = '';
  InitialValues.address = '';
  InitialValues.dob = '';
  InitialValues.hrMobile = '';
  InitialValues.hrMobileCountryCode = '';
  InitialValues.companyExtension = '';
  InitialValues.companyNumber = '';
  InitialValues.addressArea = '';
  InitialValues.city = '';
  InitialValues.country = '';
  InitialValues.state = '';
  InitialValues.zipcode = '';
  InitialValues.workAddressArea = '';
  InitialValues.workAddressBlock = '';
  InitialValues.workCity = '';
  InitialValues.workCountry = '';
  InitialValues.workState = '';
  InitialValues.workZipcode = '';
  InitialValues.countryShort = '';
};

export const onSelectManagerLocation = (
  isWorkAddressClick: boolean,
  value: GooglePlaceData | undefined,
  location: locationModal,
  currentLocation: string | undefined,
  pinCode?: string,
  formikRef?: MutableRefObject<FormikProps<AddGeneralManagerProps> | null>,
) => {
  let getWordArray;
  isWorkAddressClick
    ? (InitialValues.workZipcode = pinCode!)
    : (InitialValues.zipcode = pinCode!);
  isWorkAddressClick
    ? formikRef?.current?.setFieldValue('workZipcode', pinCode!)
    : formikRef?.current?.setFieldValue('zipcode', pinCode!);
  if (currentLocation) {
    getWordArray = currentLocation.split(',');
    const stateArray = getWordArray?.[getWordArray.length - 2].split(' ');
    stateArray.length > 1 &&
      getWordArray.splice(getWordArray.length - 2, 1, stateArray[1]);
    if (stateArray.length > 1) {
      isWorkAddressClick
        ? (InitialValues.workZipcode = stateArray[stateArray.length - 1])
        : (InitialValues.zipcode = stateArray[stateArray.length - 1]);
      isWorkAddressClick
        ? formikRef?.current?.setFieldValue(
            'workZipcode',
            stateArray[stateArray.length - 1],
          )
        : formikRef?.current?.setFieldValue(
            'zipcode',
            stateArray[stateArray.length - 1],
          );
    }
  }
  const country = currentLocation
    ? getWordArray?.[getWordArray.length - 1]
    : value!.terms[value!.terms.length - 1].value;

  const state = currentLocation
    ? getWordArray?.[getWordArray.length - 2]
    : value!.terms.length > 1 && value!.terms[value!.terms.length - 2].value;

  const city = currentLocation
    ? getWordArray?.[getWordArray.length - 3]
    : value!.terms.length > 2 && value!.terms[value!.terms.length - 3].value;

  if (isWorkAddressClick) {
    InitialValues.workAddressBlock = currentLocation
      ? currentLocation
      : value?.description!;
    formikRef?.current?.setFieldValue(
      'workAddressBlock',
      currentLocation ? currentLocation : value?.description!,
    );
    InitialValues.workCountry = country;
    formikRef?.current?.setFieldValue('workCountry', country);
    InitialValues.workState = state;
    formikRef?.current?.setFieldValue('workState', state);
    InitialValues.workCity = city;
    formikRef?.current?.setFieldValue('workCity', city);
  } else {
    InitialValues.address = currentLocation
      ? currentLocation
      : value?.description!;
    formikRef?.current?.setFieldValue(
      'address',
      currentLocation ? currentLocation : value?.description!,
    );
    InitialValues.country = country;
    formikRef?.current?.setFieldValue('country', country);
    InitialValues.state = state;
    formikRef?.current?.setFieldValue('state', state);
    InitialValues.city = city;
    formikRef?.current?.setFieldValue('city', city);
  }
};

export const CreateManagerRequestObj = (
  managerFormValues: AddGeneralManagerProps,
  addCompanyLogo: string | unknown | undefined,
  countryCode: string,
  HRcountryCode: string,
  locationModalRef: MutableRefObject<locationModal | undefined>,
  locationWorkModalRef: MutableRefObject<locationModal | undefined>,
  companyIds: string[],
  selectedCountry: string,
  selectedHrCountry: string,
  profileImageDetails: ProfileImageDetailsObj,
  reportTo: ReportToResponseList,
  alternateCountryCode: string,
  selectedAltCountry: string,
) => {
  const requestObj = {
    companyId: companyIds,
    name: managerFormValues.name,
    gender: managerFormValues.gender.value.toUpperCase(),
    dob: managerFormValues.dob,
    designation: managerFormValues.designation,
    department: managerFormValues.department,
    countryCode: countryCode,
    mobile: managerFormValues.mobile,
    mobileShortCode: selectedCountry,
    mobileVerified: 'YES',
    companyExtension: managerFormValues.companyExtension,
    companyNumber: managerFormValues.companyNumber,
    hrMobileCountryCode: HRcountryCode,
    hrMobile: managerFormValues.hrMobile,
    hrMobileShortCode: selectedHrCountry,
    alternateMobile: managerFormValues.alternateMobile,
    alternateMobileCountryCode: alternateCountryCode,
    alternateMobileShortCode: selectedAltCountry,
    email: managerFormValues.email.toLowerCase(),
    emailVerified: 'YES',
    reportTo: {
      id: reportTo._id,
      name: reportTo.name,
      role: reportTo.role,
      profileUrl: reportTo.profileUrl,
    },
    residenceAddress: {
      latitude: locationModalRef.current?.lat,
      longitude: locationModalRef.current?.lng,
      latlong: {
        latitude: locationModalRef.current?.lat,
        longitude: locationModalRef.current?.lng,
      },
      flat: managerFormValues.addressArea,
      address: managerFormValues.address,
      country: managerFormValues.country,
      state: managerFormValues.state,
      city: managerFormValues.city,
      zipCode: managerFormValues.zipcode,
    },
    workAddress: {
      latitude: locationWorkModalRef.current?.lat,
      longitude: locationWorkModalRef.current?.lng,
      latlong: {
        latitude: locationWorkModalRef.current?.lat,
        longitude: locationWorkModalRef.current?.lng,
      },
      flat: managerFormValues.workAddressArea,
      address: managerFormValues.workAddressBlock,
      country: managerFormValues.workCountry,
      state: managerFormValues.workState,
      city: managerFormValues.workCity,
      zipCode: managerFormValues.workZipcode,
      countryISO: managerFormValues?.countryShort,
    },
    role: {
      type: 'GM',
      roleId: '6316f5116c22f223fd3f759e',
    },
    primary: 'NO',
    system: 'YES',
    profileUrl: addCompanyLogo ? addCompanyLogo : '',
    businessCard: {
      type: '',
      fileURL: '',
      desc: '',
    },
    profileImageDetails: profileImageDetails,
  };
  return requestObj;
};
export const setManagerFormData = (
  managerDetailData: dataModal,
  formikRef: MutableRefObject<FormikProps<AddGeneralManagerProps> | null>,
) => {
  // InitialValues.companyId = ;
  InitialValues.company = managerDetailData.company![0]?._id;
  InitialValues.name = managerDetailData.name;
  InitialValues.designation = managerDetailData.designation;
  InitialValues.gender =
    managerDetailData.gender === 'MALE'
      ? {id: 1, value: 'Male'}
      : {id: 2, value: 'Female'};
  InitialValues.department = managerDetailData.department;
  InitialValues.mobile = managerDetailData.login.mobile;
  InitialValues.countryCode = managerDetailData.login.countryCode;
  formikRef.current?.setFieldValue(
    'countryCode',
    managerDetailData.login.countryCode,
  );
  InitialValues.alternateMobile = managerDetailData.alternateMobile!;
  InitialValues.alternateMobileCountryCode =
    managerDetailData.alternateMobileCountryCode!;
  formikRef.current?.setFieldValue(
    'alternateMobileCountryCode',
    managerDetailData.alternateMobileCountryCode,
  );
  InitialValues.email = managerDetailData.login.email.toLowerCase();
  InitialValues.address = managerDetailData.residenceAddress.address;
  InitialValues.dob = managerDetailData.dob;
  InitialValues.hrMobile = managerDetailData.hrMobile;
  InitialValues.hrMobileCountryCode = managerDetailData.hrMobileCountryCode;
  formikRef.current?.setFieldValue(
    'hrMobileCountryCode',
    managerDetailData.hrMobileCountryCode,
  );
  InitialValues.reportTo = managerDetailData.reportTo?.id!;
  InitialValues.companyExtension = managerDetailData.companyExtension;
  InitialValues.companyNumber = managerDetailData.companyNumber;
  InitialValues.addressArea = managerDetailData.residenceAddress.flat;
  InitialValues.city = managerDetailData.residenceAddress.city;
  InitialValues.country = managerDetailData.residenceAddress.country;
  InitialValues.state = managerDetailData.residenceAddress.state;
  InitialValues.zipcode = managerDetailData.residenceAddress.zipCode;
  InitialValues.workAddressArea = managerDetailData.workAddress.flat;
  InitialValues.workAddressBlock = managerDetailData.workAddress.address;
  InitialValues.workCity = managerDetailData.workAddress.city;
  InitialValues.workCountry = managerDetailData.workAddress.country;
  InitialValues.workState = managerDetailData.workAddress.state;
  InitialValues.workZipcode = managerDetailData.workAddress.zipCode;
  InitialValues.countryShort = managerDetailData.workAddress.countryISO!;
};
