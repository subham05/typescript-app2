import {locationModal} from 'components/GooglePlaces';
import {FormikProps} from 'formik';
import {MutableRefObject} from 'react';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';

export interface Company {
  name: string;
  website: string;
  officeTelephone: string;
  contact: string;
  countryCode: string;
  address: string;
  country: string;
  state: string;
  city: string;
  landmark: string;
  zipcode: string;
}

export const InitialValues: Company = {
  name: '',
  website: '',
  contact: '',
  officeTelephone: '',
  countryCode: '',
  address: '',
  country: '',
  state: '',
  city: '',
  landmark: '',
  zipcode: '',
};

export const resetCompanyData = () => {
  InitialValues.address = '';
  InitialValues.city = '';
  InitialValues.contact = '';
  InitialValues.country = '';
  InitialValues.officeTelephone = '';
  InitialValues.countryCode = '';
  InitialValues.landmark = '';
  InitialValues.name = '';
  InitialValues.state = '';
  InitialValues.website = '';
  InitialValues.zipcode = '';
};

export const onSelectCompanyLocation = (
  value: GooglePlaceData | undefined,
  location: locationModal,
  currentLocation: string | undefined,
  pinCode?: string,
  formikRef?: MutableRefObject<FormikProps<Company> | null>,
) => {
  let getWordArray;
  InitialValues.zipcode = pinCode!;
  formikRef?.current?.setFieldValue('zipcode', pinCode!);
  if (currentLocation) {
    getWordArray = currentLocation.split(',');
    const stateArray = getWordArray?.[getWordArray.length - 2].split(' ');
    stateArray.length > 1 &&
      getWordArray.splice(getWordArray.length - 2, 1, stateArray[1]);
    if (stateArray.length > 1) {
      InitialValues.zipcode = stateArray[stateArray.length - 1];
      formikRef?.current?.setFieldValue(
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

  InitialValues.address = currentLocation
    ? currentLocation!
    : value?.description!;
  formikRef?.current?.setFieldValue(
    'address',
    currentLocation ? currentLocation! : value?.description!,
  );
  InitialValues.country = country;
  formikRef?.current?.setFieldValue('country', country);
  InitialValues.state = state;
  formikRef?.current?.setFieldValue('state', state);
  InitialValues.city = city;
  formikRef?.current?.setFieldValue('city', city);
};

export const createCompanyRequestObj = (
  companyFormValues: Company,
  addCompanyLogo: string | unknown | undefined,
  locationModalRef: MutableRefObject<locationModal | undefined>,
) => {
  const {
    contact,
    country,
    countryCode,
    address,
    city,
    landmark,
    name,
    officeTelephone,
    state,
    website,
    zipcode,
  } = companyFormValues;

  const countryCodeValue = countryCode ? countryCode : '+91';
  const contactWithCountryCode = contact
    ? `${countryCode ? countryCode : '91'}${contact}`
    : '';

  const contactNo = contact ? contact : '';

  const requestObj = {
    clientId: '617a500e25cc2338dd2137de', //need to change
    contact: contactNo,
    contactWithCountryCode: contactWithCountryCode,
    countryCode: countryCodeValue,
    officeTelephone: officeTelephone,
    logo: addCompanyLogo ? addCompanyLogo : undefined,
    name: name,
    officeAddress: {
      address: address,
      city: city,
      country: country,
      landmark: landmark,
      latlong: {
        latitude: locationModalRef.current?.lat,
        longitude: locationModalRef.current?.lng,
      },
      state: state,
      zipcode: zipcode,
    },
    website: website,
  };
  return requestObj;
};
