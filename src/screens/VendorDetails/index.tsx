import {useFocusEffect} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import {Divider} from 'components/Divider';
import Header from 'components/Header';
import {RippleIconButton} from 'components/IconButtons';
import Loader from 'components/Loader';
import {NetworkContext} from 'components/NetworkProvider';
import {Persona} from 'components/Persona';
import {RadioButton, RadioButtonOption} from 'components/RadioButton';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {useLazyGetVendorDetailQuery} from 'request/AddVendor';
import {genderData} from 'screens/AddOwner';
import {Styles} from './index.styles';

type Props = NativeStackScreenProps<SignedInStackParamList, 'VendorDetails'>;
interface detailData {
  managerName: string;
  companyName: string | undefined;
  DOB: string;
  Gender: RadioButtonOption;
  Designation: string;
  Department: string;
  contactNo: string;
  companyExtensionNumber: string;
  hrContactNumber: string;
  workEmail: string;
  ResidentialAddress: string;
  WorkAddress: string;
}
export const VendorDetailsScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {data} = {
    ...route.params,
  };
  // const {userData} = useAppSelector(state => state.formanagement);
  const managerDataRef = useRef<detailData>({
    managerName: '',
    companyName: '',
    DOB: '',
    Gender: {id: 1, value: 'Male'},
    Designation: '',
    Department: '',
    contactNo: '',
    companyExtensionNumber: '',
    hrContactNumber: '',
    workEmail: '',
    ResidentialAddress: '',
    WorkAddress: '',
  });
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [managerLogo, setManagerLogo] = useState<string | undefined>();
  const {netStatus} = React.useContext(NetworkContext);
  const [
    getVendorDetail,
    {
      isSuccess: vendorDetailSuccess,
      data: vendorDetailData,
      isFetching: vendorDetailLoading,
    },
  ] = useLazyGetVendorDetailQuery();

  useFocusEffect(
    useCallback(() => {
      if (data?._id && netStatus) {
        getVendorDetail(data?._id);
      }
      return () => {
        setManagerLogo(undefined);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, netStatus]),
  );
  useEffect(() => {
    if (vendorDetailSuccess && vendorDetailData) {
      const {
        name,
        gender,
        designation,
        department,
        companyNumberWithExtension,
        alternateContactWithCode,
        workAddress,
        company,
        profileUrl,
        // email,
        // contactNumberWithCode,
        login,
      } = vendorDetailData.data;
      managerDataRef.current.managerName = name;
      managerDataRef.current.companyName = company?.name;
      // managerDataRef.current.DOB = dob;
      managerDataRef.current.Gender =
        gender === 'MALE' ? {id: 1, value: 'Male'} : {id: 2, value: 'Female'};
      managerDataRef.current.Designation = designation;
      managerDataRef.current.Department = department;
      managerDataRef.current.contactNo = login.mobileWithCountryCode
        ? `+${login.mobileWithCountryCode}`
        : '';
      managerDataRef.current.companyExtensionNumber =
        companyNumberWithExtension;
      managerDataRef.current.alternateContactNumber = alternateContactWithCode
        ? `+${alternateContactWithCode}`
        : '';
      managerDataRef.current.workEmail = login.email;
      // managerDataRef.current.ResidentialAddress = residenceAddress.address;
      managerDataRef.current.WorkAddress = workAddress.address;

      setManagerLogo(profileUrl);
      setStateUpdater(!stateUpdater);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorDetailSuccess, vendorDetailData, managerLogo]);

  const onGoBack = () => {
    props.navigation.goBack();
  };

  const toggleBtnAnimation = useAnimatedStyle(() => {
    const translateYVal = interpolate(
      translateY.value,
      [0, 60],
      [0, -35],
      Extrapolate.CLAMP,
    );
    const translateXVal = interpolate(
      translateY.value,
      [0, 60],
      [160, 195],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateX: translateXVal}, {translateY: translateYVal}],
    };
  });

  const RenderPrivateToggle = () => {
    return (
      <Animated.View style={[toggleBtnAnimation]}>
        {/* <TextView
          weight="semibold"
          variant={FontSizes.xlarge}
          style={animationText}>
          {t('managersHomePage:vendorDetails')}
        </TextView> */}
        {vendorDetailData?.data?.isEditable && (
          <RippleIconButton
            name="edit"
            onPress={() => {
              props.navigation.navigate('AddVendor', {
                edit: true,
                vendorDetailData: vendorDetailData?.data,
              });
            }}
            color={colors.black}
            size={21}
            // style={{marginLeft: '54%'}}
          />
        )}
      </Animated.View>
    );
  };

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        // hideLabel
        label={t('managersHomePage:vendorDetails')}
        translateY={translateY}
        preventDefault
        onBackPress={onGoBack}
        RenderPrivateToggle={RenderPrivateToggle}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}>
        <Stack spacing={16} spaceBelow={16}>
          <Stack horizontal horizontalAlign="space-between">
            <Stack horizontal>
              {managerLogo ? (
                <Image
                  source={{uri: managerLogo}}
                  style={styles.companyLogoStyle}
                />
              ) : (
                <Persona name={managerDataRef.current.managerName || ''} />
              )}
              <Stack style={styles.viewContact}>
                <TextView weight="medium" variant={FontSizes.medium} truncate>
                  {managerDataRef.current.managerName || ''}
                </TextView>
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={{color: colors.grey_003}}>
                  {managerDataRef.current.companyExtensionNumber || 'NA'}
                </TextView>
              </Stack>
            </Stack>
            {/* {vendorDetailData?.data?.addedBy === userData._id && (
              <RippleIconButton
                name="edit"
                onPress={() => {
                  props.navigation.navigate('AddVendor', {
                    edit: true,
                    vendorDetailData: vendorDetailData?.data,
                  });
                }}
                color={colors.black}
                size={21}
                style={styles.editButton}
              />
            )} */}
          </Stack>
          <Stack spaceBelow={16}>
            <Divider size={2} />
          </Stack>
          <StackItem childrenGap={10} spaceBelow={16}>
            <Stack style={styles.gender}>
              <TextView
                weight="regular"
                variant={FontSizes.regular}
                style={styles.genderLabel}>
                {t('managersHomePage:gender')}
              </TextView>
              <RadioButton
                data={genderData}
                disabled
                value={managerDataRef.current.Gender}
              />
            </Stack>
            <TextField
              label={t('addManager:designation')}
              value={managerDataRef.current.Designation || 'NA'}
              editable={false}
            />
            <TextField
              label={t('addManager:department')}
              value={managerDataRef.current.Department || 'NA'}
              editable={false}
            />
            <TextField
              label={t('addManager:contactNumber')}
              value={managerDataRef.current.contactNo || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:companyExtensionNumber')}
              value={managerDataRef.current.companyExtensionNumber || 'NA'}
              editable={false}
            />
            <TextField
              label={t('addManager:email')}
              value={managerDataRef.current.workEmail || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:workAddress')}
              value={managerDataRef.current.WorkAddress || ''}
              multiline
              numberOfLines={2}
              editable={false}
            />
          </StackItem>
        </Stack>
      </Animated.ScrollView>

      {/* <Stack spacing={16} horizontal horizontalAlign="space-between" center>
          <PrimaryButton
            title={t('performance')}
            onPress={() => {
              props.navigation.navigate('PointsEarned', {data: data});
            }}
            style={styles.saveButton}
          />
          <DefaultButton
            title={t('rate')}
            fontSize={FontSizes.small}
            onPress={() => setIsRateOn(true)}
            // props.navigation.navigate('RateManager');
            style={styles.saveRateButton}
          />
        </Stack> */}

      {vendorDetailLoading && <Loader />}
    </Container>
  );
};
