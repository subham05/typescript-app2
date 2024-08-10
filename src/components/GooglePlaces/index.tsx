import {GOOGLE_API_KEY} from '@env';
import {colors} from 'common/theme/colors';
import {Icon} from 'components/Icon';
import {TextView} from 'components/TextView';
import React, {useState} from 'react';
import {
  GooglePlaceData,
  GooglePlaceDetail,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete';
import {Stack} from 'stack-container';
import {Styles} from './index.styles';
import GPS from '../../assets/svgs/GPS.svg';
import {Platform, TouchableOpacity} from 'react-native';
import {getLocation} from 'common/utils/getLocation';
import Loader from 'components/Loader';
import Header from 'components/Header';
import {FontSizes} from 'common/theme/font';
import {useTranslation} from 'react-i18next';
import {useSharedValue} from 'react-native-reanimated';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import {Container} from 'components/container';

navigator.geolocation = require('react-native-geolocation-service');

export interface locationModal {
  lat: number | undefined;
  lng: number | undefined;
}

type Props = NativeStackScreenProps<SignedInStackParamList, 'GooglePlaces'>;

// const GooglePlaces: React.FC<GooglePlaceModal> = ({onSelect, setShowModal}) => {
const GooglePlaces = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const {onSelect, isWorkAddressClick} = props.route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const renderLeftButton = () => {
    return (
      <Stack style={Styles.leftIconStyle}>
        <Icon name="search" size={25} />
      </Stack>
    );
  };

  const getLocationOn = () => {
    return new Promise(resolve => {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
        interval: 10000,
        fastInterval: 5000,
      })
        .then(data => resolve(data))
        .catch(err => console.log(err));
    });
  };

  const goBack = () => {
    props.navigation.goBack();
  };
  const getCurrentLocation = async () => {
    const isEnabled = Platform.OS === 'android' ? await getLocationOn() : null;
    if (
      isEnabled === 'already-enabled' ||
      isEnabled === 'enabled' ||
      Platform.OS === 'ios'
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 10000);
      getLocation()
        .then(res => {
          setIsLoading(false);
          let countryShortName;
          res?.complete_address?.map(itemCountry => {
            if (itemCountry?.types?.includes('country')) {
              countryShortName = itemCountry?.short_name;
            }
          });
          onSelect?.(
            undefined,
            res.location,
            res.formatted_address,
            '',
            isWorkAddressClick!,
            countryShortName,
          );
          goBack();
        })
        .catch(err => {
          setIsLoading(false);
          console.log(err);
        });
    }
  };
  const renderRow = (
    data: GooglePlaceData | GooglePlaceDetail,
    index: number,
  ) => {
    const {id, description, structured_formatting} = data as GooglePlaceData;
    const {name, vicinity} = data as GooglePlaceDetail;
    const isCurrentLocation = description === 'Current location' ? true : false;
    return description === 'Current location' ? (
      <TouchableOpacity
        onPress={getCurrentLocation}
        style={Styles.rowMainContainer}>
        <Stack key={`${id}_${index}`} horizontal horizontalAlign="flex-start">
          <Stack style={Styles.iconContainer}>
            <GPS style={Styles.gpsIcon} />
          </Stack>
          <Stack style={Styles.rowContainer}>
            <TextView variant={16} weight="regular">
              {name ? name : description}
            </TextView>
          </Stack>
        </Stack>
      </TouchableOpacity>
    ) : (
      <Stack
        key={`${id}_${index}`}
        horizontal
        horizontalAlign="flex-start"
        style={Styles.rowMainContainer}>
        <Stack style={Styles.iconContainer}>
          {isCurrentLocation ? (
            <GPS style={Styles.gpsIcon} />
          ) : (
            <Icon name="location" size={20} color={colors.black} />
          )}
        </Stack>
        <Stack style={Styles.rowContainer}>
          <TextView variant={16} weight="regular">
            {name ? name : description}
          </TextView>
          <TextView variant={14} weight="regular" style={Styles.secondaryText}>
            {vicinity ? vicinity : structured_formatting?.secondary_text}
          </TextView>
        </Stack>
      </Stack>
    );
  };

  return (
    <Container noSpacing>
      <Stack style={Styles.headerContainer}>
        <Header
          navigationType="STACK"
          label={' '}
          preventDefault
          onBackPress={goBack}
          translateY={translateY}
        />
      </Stack>
      <TextView
        weight="regular"
        variant={FontSizes.xMedium}
        style={Styles.locationTitle}>
        {t('homePage:selectLocation')}
      </TextView>
      <GooglePlacesAutocomplete
        placeholder="Search"
        currentLocation
        fetchDetails
        enablePoweredByContainer={false}
        query={{
          key: GOOGLE_API_KEY,
          language: 'en',
        }}
        onFail={err => console.log('fail break:', err)}
        styles={{
          container: Styles.container,
          textInput: Styles.textInput,
          row: Styles.row,
        }}
        onPress={(data, detail) => {
          const pinCode = detail?.address_components.find(item =>
            item.types?.find(type => type === 'postal_code'),
          );
          const countryShort = detail?.address_components.find(item =>
            item.types?.find(type => type === 'country'),
          );
          onSelect?.(
            data,
            detail?.geometry?.location!,
            undefined,
            pinCode?.long_name,
            isWorkAddressClick!,
            countryShort?.short_name,
          );
          goBack();
        }}
        renderLeftButton={renderLeftButton}
        textInputProps={{
          placeholderTextColor: colors.grey_005,
          autoFocus: true,
        }}
        renderRow={(data, index) => renderRow(data, index)}
      />
      {isLoading && <Loader />}
    </Container>
  );
};

export default GooglePlaces;
