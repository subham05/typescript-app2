import {locationModal} from 'components/GooglePlaces';
import {FormikProps} from 'formik';
import {MutableRefObject} from 'react';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {dataModal} from 'request/AddManager/constant';
import {AddVendorProps} from './types';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {ProfileImageDetailsObj} from 'screens/AddEmployee';

export const InitialValues: AddVendorProps = {
  companyId: '',
  company: '',
  companyName: '',
  name: '',
  designation: '',
  gender: {id: 1, value: 'Male'},
  department: '',
  mobile: '',
  countryCode: '',
  alternateMobileCountryCode: '',
  email: '',
  address: '',
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
  companyAddress: '',
  alternateMobile: '',
  countryShort: '',
  reportTo: '',
};

export const resetManagerData = () => {
  InitialValues.companyId = '';
  InitialValues.company = '';
  InitialValues.companyName = '';
  InitialValues.name = '';
  InitialValues.designation = '';
  InitialValues.gender = {id: 1, value: 'Male'};
  InitialValues.department = '';
  InitialValues.mobile = '';
  InitialValues.countryCode = '';
  InitialValues.email = '';
  InitialValues.address = '';
  InitialValues.companyExtension = '';
  InitialValues.companyNumber = '';
  InitialValues.workAddressArea = '';
  InitialValues.workAddressBlock = '';
  InitialValues.workCity = '';
  InitialValues.workCountry = '';
  InitialValues.workState = '';
  InitialValues.workZipcode = '';
  InitialValues.alternateMobile = '';
  InitialValues.alternateMobileCountryCode = '';
  InitialValues.countryShort = '';
  InitialValues.reportTo = '';
};

export const onSelectManagerLocation = (
  isWorkAddressClick: boolean,
  value: GooglePlaceData | undefined,
  location: locationModal,
  currentLocation: string | undefined,
  pinCode?: string,
  formikRef?: MutableRefObject<FormikProps<AddVendorProps> | null>,
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
  managerFormValues: AddVendorProps,
  addCompanyLogo: string | unknown | undefined,
  countryCode: string,
  alternateMobileCountryCode: string,
  locationModalRef: MutableRefObject<locationModal | undefined>,
  locationWorkModalRef: MutableRefObject<locationModal | undefined>,
  profileImageDetails: ProfileImageDetailsObj,
  reportTo: ReportToResponseList,
  selectedAltCountry: string,
  selectedCountry: string,
) => {
  const requestObj = {
    companyId: managerFormValues?.company!,
    companyName: managerFormValues?.companyName!,
    name: managerFormValues?.name!,
    gender: managerFormValues.gender.value.toUpperCase(),
    designation: managerFormValues.designation,
    department: managerFormValues.department,
    countryCode: countryCode,
    mobile: managerFormValues.mobile,
    mobileShortCode: selectedCountry,
    mobileVerified: 'YES',
    companyExtension: managerFormValues.companyExtension,
    companyNumber: managerFormValues.companyNumber,
    alternateMobileCountryCode: alternateMobileCountryCode,
    alternateMobileShortCode: selectedAltCountry,
    alternateMobile: managerFormValues.alternateMobile,
    email: managerFormValues.email.toLowerCase(),
    emailVerified: 'YES',
    reportTo: {
      id: reportTo._id,
      name: reportTo.name,
      role: reportTo.role,
      profileUrl: reportTo.profileUrl,
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
      type: 'VENDOR',
      roleId: '63ce56ce50491c43a56fd3a9',
    },
    primary: 'NO',
    system: 'YES',
    profileUrl: addCompanyLogo ? addCompanyLogo : '',
    profileImageDetails: profileImageDetails,
  };
  return requestObj;
};
export const setManagerFormData = (
  managerDetailData: dataModal,
  formikRef: MutableRefObject<FormikProps<AddVendorProps> | null>,
) => {
  InitialValues.company = managerDetailData.companyId;
  InitialValues.companyName = managerDetailData.companyName!;
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
  InitialValues.email = managerDetailData.login.email.toLowerCase();
  InitialValues.alternateMobile = managerDetailData?.alternateMobile!;
  InitialValues.alternateMobileCountryCode =
    managerDetailData?.alternateMobileCountryCode;
  formikRef.current?.setFieldValue(
    'alternateMobileCountryCode',
    managerDetailData?.alternateMobileCountryCode,
  );
  InitialValues.reportTo = managerDetailData.reportTo?.id!;
  InitialValues.companyExtension = managerDetailData.companyExtension;
  InitialValues.companyNumber = managerDetailData.companyNumber;
  InitialValues.workAddressBlock = managerDetailData.workAddress.address;
  InitialValues.workCity = managerDetailData.workAddress.city;
  InitialValues.workCountry = managerDetailData.workAddress.country;
  InitialValues.workState = managerDetailData.workAddress.state;
  InitialValues.workZipcode = managerDetailData.workAddress.zipCode;
  InitialValues.countryShort = managerDetailData.workAddress.countryISO;
};
