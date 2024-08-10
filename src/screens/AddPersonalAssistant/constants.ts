import {locationModal} from 'components/GooglePlaces';
import {FormikProps} from 'formik';
import {MutableRefObject} from 'react';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {dataModal} from 'request/AddManager/constant';
import {AddPA} from './types';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export const InitialValues: AddPA = {
  companyId: [],
  company: '',
  name: '',
  gender: {id: 1, value: 'Male'},
  dob: '',
  designation: '',
  department: '',
  countryCode: '',
  mobile: '',
  alternateMobile: '',
  alternateMobileCountryCode: '',
  companyNumber: '',
  companyExtension: '',
  email: '',
  address: '',
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

export const resetPAData = () => {
  InitialValues.companyId = [];
  InitialValues.company = '';
  InitialValues.name = '';
  InitialValues.gender = {id: 1, value: 'Male'};
  InitialValues.dob = '';
  InitialValues.designation = '';
  InitialValues.department = '';
  InitialValues.countryCode = '';
  InitialValues.mobile = '';
  InitialValues.alternateMobile = '';
  InitialValues.alternateMobileCountryCode = '';
  InitialValues.companyNumber = '';
  InitialValues.companyExtension = '';
  InitialValues.email = '';
  InitialValues.address = '';
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
  InitialValues.reportTo = '';
};

export const onSelectLocation = (
  isWorkAddressClick: boolean,
  value: GooglePlaceData | undefined,
  location: locationModal,
  currentLocation: string | undefined,
  pinCode?: string,
  formikRef?: MutableRefObject<FormikProps<AddPA> | null>,
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

export const CreateRequestObj = (
  values: AddPA,
  addCompanyLogo: string | unknown | undefined,
  countryCode: string,
  locationModalRef: MutableRefObject<locationModal | undefined>,
  locationWorkModalRef: MutableRefObject<locationModal | undefined>,
  primary: string,
  selectedCountry: string,
  companyIds: string[],
  profileImageDetails: ProfileImageDetailsObj,
  reportTo: ReportToResponseList,
  alternateCountryCode: string,
  selectedAltCountry: string,
) => {
  const requestObj = {
    companyId: companyIds,
    name: values.name,
    gender: values.gender.value.toUpperCase(),
    dob: values.dob,
    designation: values.designation,
    department: values.department,
    countryCode: countryCode,
    mobile: values.mobile,
    mobileShortCode: selectedCountry,
    mobileVerified: 'YES',
    alternateMobile: values.alternateMobile,
    alternateMobileCountryCode: alternateCountryCode,
    alternateMobileShortCode: selectedAltCountry,
    companyExtension: values.companyExtension,
    companyNumber: values.companyNumber,
    email: values.email.toLowerCase(),
    emailVerified: 'YES',
    reportTo: {
      id: reportTo._id,
      name: reportTo.name,
      role: reportTo.role,
      profileUrl: reportTo.profileUrl,
    },
    residenceAddress: {
      latitude: locationModalRef.current?.lat!,
      longitude: locationModalRef.current?.lng!,
      latlong: {
        latitude: locationModalRef.current?.lat!,
        longitude: locationModalRef.current?.lng!,
      },
      flat: values.addressArea,
      address: values.address,
      country: values.country,
      state: values.state,
      city: values.city,
      zipCode: values.zipcode,
    },
    workAddress: {
      latitude: locationWorkModalRef.current?.lat!,
      longitude: locationWorkModalRef.current?.lng!,
      latlong: {
        latitude: locationWorkModalRef.current?.lat!,
        longitude: locationWorkModalRef.current?.lng!,
      },
      flat: values.workAddressArea,
      address: values.workAddressBlock,
      country: values.workCountry,
      state: values.workState,
      city: values.workCity,
      zipCode: values.workZipcode,
      countryISO: values?.countryShort,
    },
    role: {
      type: 'PA',
    },
    profileUrl: addCompanyLogo ? (addCompanyLogo as string) : '',
    primary: primary,
    system: 'YES',
    profileImageDetails: profileImageDetails,
  };
  return requestObj;
};

export const setPAFormData = (
  paDetailData: dataModal,
  formikRef: MutableRefObject<FormikProps<AddPA> | null>,
) => {
  InitialValues.company = paDetailData.company![0]?._id;
  InitialValues.name = paDetailData?.name;
  InitialValues.designation = paDetailData?.designation;
  InitialValues.gender =
    paDetailData?.gender === 'MALE'
      ? {id: 1, value: 'Male'}
      : {id: 2, value: 'Female'};
  InitialValues.department = paDetailData?.department;
  InitialValues.mobile = paDetailData?.login?.mobile;
  InitialValues.countryCode = paDetailData?.login?.countryCode;
  formikRef.current?.setFieldValue(
    'countryCode',
    paDetailData?.login?.countryCode,
  );
  InitialValues.alternateMobile = paDetailData?.alternateMobile!;
  InitialValues.alternateMobileCountryCode =
    paDetailData?.alternateMobileCountryCode!;
  formikRef.current?.setFieldValue(
    'alternateMobileCountryCode',
    paDetailData?.alternateMobileCountryCode,
  );
  InitialValues.email = paDetailData?.login?.email.toLowerCase();
  InitialValues.address = paDetailData?.residenceAddress?.address;
  InitialValues.dob = paDetailData?.dob;
  InitialValues.reportTo = paDetailData.reportTo?.id!;
  InitialValues.companyExtension = paDetailData?.companyExtension;
  InitialValues.companyNumber = paDetailData?.companyNumber;
  InitialValues.addressArea = paDetailData?.residenceAddress?.flat!;
  InitialValues.city = paDetailData?.residenceAddress?.city;
  InitialValues.country = paDetailData?.residenceAddress?.country;
  InitialValues.state = paDetailData?.residenceAddress?.state;
  InitialValues.zipcode = paDetailData?.residenceAddress?.zipCode!;
  InitialValues.workAddressArea = paDetailData?.workAddress?.flat!;
  InitialValues.workAddressBlock = paDetailData?.workAddress?.address;
  InitialValues.workCity = paDetailData?.workAddress?.city;
  InitialValues.workCountry = paDetailData?.workAddress?.country;
  InitialValues.workState = paDetailData?.workAddress?.state;
  InitialValues.workZipcode = paDetailData?.workAddress?.zipCode!;
  InitialValues.countryShort = paDetailData?.workAddress?.countryISO!;
};
