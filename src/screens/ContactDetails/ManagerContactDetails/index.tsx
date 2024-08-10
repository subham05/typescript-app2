import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {colors} from 'common/theme/colors';
import {FontSizes} from 'common/theme/font';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Divider} from 'components/Divider';
import {Icon} from 'components/Icon';
import {RippleIconButton} from 'components/IconButtons';
import {Persona} from 'components/Persona';
import {RadioButton, RadioButtonOption} from 'components/RadioButton';
import {Stack, StackItem} from 'components/Stack';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useCallback, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Image, ScrollView, View} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {genderData} from 'screens/AddOwner';
import {Styles} from './index.styles';
import {TextField} from 'components/TextField';
import {DefaultButton, PrimaryButton} from 'components/Buttons';
import {
  useLazyGetManagerDetailQuery,
  useRateManagerMutation,
} from 'request/AddManager';
import Loader from 'components/Loader';
import {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import SwitchToggle from 'react-native-switch-toggle';
import {showToast} from 'common/utils/ToastMessage';
import {NetworkContext} from 'components/NetworkProvider';
import {useLazyGetOwnerDetailQuery} from 'request/AddOwner';
import {
  useLazyGetEmployeeDetailQuery,
  useRateEmployeeMutation,
} from 'request/AddEmployee';
import {companyObjModal} from 'request/AddManager/constant';
import {userTypes} from 'common/users/userTypes';

type Props = NativeStackScreenProps<
  SignedInStackParamList,
  'ManagerContactDetails'
>;
interface detailData {
  managerName: string;
  companyName: string | undefined;
  DOB: string;
  Gender: RadioButtonOption;
  Designation: string;
  Department: string;
  contactNo: string;
  altContactNo: string;
  companyExtensionNumber: string;
  hrContactNumber: string;
  workEmail: string;
  ResidentialAddress: string;
  WorkAddress: string;
  reportTo?: {id: string; name: string; role: string};
}
export const ManagerContactsDetailsScreen = (props: Props) => {
  const {t} = useTranslation();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });
  const {route} = {...props};
  const {data, userType} = {
    ...route.params,
  };
  const managerDataRef = useRef<detailData>({
    managerName: '',
    companyName: '',
    DOB: '',
    Gender: {id: 1, value: 'Male'},
    Designation: '',
    Department: '',
    contactNo: '',
    altContactNo: '',
    companyExtensionNumber: '',
    hrContactNumber: '',
    workEmail: '',
    ResidentialAddress: '',
    WorkAddress: '',
    reportTo: {id: '', name: '', role: ''},
  });
  const [stateUpdater, setStateUpdater] = useState<boolean>(false);
  const [redZone, setRedZone] = useState<boolean>(false);
  const [isRateOn, setIsRateOn] = useState<boolean>(false);
  const [saveClicked, setSaveClicked] = useState<boolean>(false);
  const [managerLogo, setManagerLogo] = useState<string | undefined>();
  const [isRate, setIsRate] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const {netStatus} = React.useContext(NetworkContext);

  const [
    getManagerDetail,
    {
      isSuccess: managerDetailSuccess,
      data: managerDetailData,
      isFetching: managerDetailLoading,
    },
  ] = useLazyGetManagerDetailQuery();
  const [
    getOwnerDetail,
    {
      isSuccess: ownerDetailSuccess,
      data: ownerDetailData,
      isFetching: ownerDetailLoading,
    },
  ] = useLazyGetOwnerDetailQuery();
  const [
    getEmployeeDetail,
    {
      isSuccess: employeeDetailSuccess,
      data: employeeDetailData,
      isFetching: employeeDetailLoading,
    },
  ] = useLazyGetEmployeeDetailQuery();
  const [
    rateEmployee,
    {
      data: rateEmployeeData,
      isSuccess: rateEmployeeSuccess,
      isLoading: rateEmployeeLoading,
    },
  ] = useRateEmployeeMutation();
  const [
    rateManager,
    {
      data: rateManagerData,
      isSuccess: rateManagerSuccess,
      isLoading: rateManagerLoading,
    },
  ] = useRateManagerMutation();

  const getDetailQuery = (user: string) => {
    switch (user) {
      case 'manager':
        return getManagerDetail(data.userId);
      case 'owner':
        return getOwnerDetail(data.userId);

      case 'employee':
        return getEmployeeDetail(data.userId);

      default:
        return getManagerDetail(data.userId);
    }
  };
  useFocusEffect(
    useCallback(() => {
      if (data?.userId && netStatus) {
        getDetailQuery(userType);
      }
      return () => {
        setIsRateOn(false);
        setManagerLogo(undefined);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, netStatus]),
  );
  useEffect(() => {
    if (isRateOn) {
      if (
        (rateManagerData && rateManagerSuccess) ||
        (rateEmployeeData && rateEmployeeSuccess)
      ) {
        const {message} =
          userType === 'manager' ? rateManagerData! : rateEmployeeData!;
        setSaveClicked(false);
        getDetailQuery(userType);
        showToast(message);
        setIsRateOn(false);
      }
    } else {
      if (
        (managerDetailSuccess && managerDetailData) ||
        (ownerDetailSuccess && ownerDetailData) ||
        (employeeDetailSuccess && employeeDetailData)
      ) {
        const detailData =
          userType === 'manager'
            ? managerDetailData?.data[0]
            : userType === 'owner'
            ? ownerDetailData?.data[0]
            : employeeDetailData?.data[0];
        const {
          name,
          dob,
          gender,
          designation,
          department,
          login,
          companyNumberWithExtension,
          hrMobileWithCountryCode,
          alternateMobileWithCountryCode,
          residenceAddress,
          workAddress,
          company,
          zone,
          profileUrl,
          isEditable,
          isRateable,
          reportTo,
        } = detailData!;
        setIsEdit(isEditable!);
        setIsRate(isRateable!);
        managerDataRef.current.managerName = name;
        managerDataRef.current.companyName = company
          ?.map(
            (com: companyObjModal, idx: number) => `${idx + 1}. ${com.name}`,
          )
          .join('\n');
        managerDataRef.current.DOB = dob;
        managerDataRef.current.Gender =
          gender === 'MALE' ? {id: 1, value: 'Male'} : {id: 2, value: 'Female'};
        managerDataRef.current.Designation = designation;
        managerDataRef.current.Department = department;
        managerDataRef.current.contactNo = login?.mobileWithCountryCode
          ? `+${login?.mobileWithCountryCode}`
          : '';
        managerDataRef.current.altContactNo = alternateMobileWithCountryCode
          ? `+${alternateMobileWithCountryCode}`
          : '';
        managerDataRef.current.companyExtensionNumber =
          companyNumberWithExtension;
        managerDataRef.current.hrContactNumber = hrMobileWithCountryCode
          ? `+${hrMobileWithCountryCode}`
          : '';
        managerDataRef.current.workEmail = login.email;
        managerDataRef.current.ResidentialAddress = residenceAddress?.address;
        managerDataRef.current.WorkAddress = workAddress?.address;
        managerDataRef.current.reportTo = reportTo!;
        zone === 'RED' && setRedZone(true);
        setManagerLogo(profileUrl);
        setStateUpdater(!stateUpdater);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    managerDetailSuccess,
    ownerDetailSuccess,
    managerDetailData,
    ownerDetailData,
    employeeDetailData,
    employeeDetailSuccess,
    rateManagerSuccess,
    rateEmployeeSuccess,
    managerLogo,
  ]);

  const UpdateZone = () => {
    setSaveClicked(true);
    const obj = {zone: redZone ? 'RED' : 'GREEN'};
    userType === 'manager'
      ? rateManager({
          managerId: managerDetailData?.data[0]._id,
          rateValue: obj,
        })
      : rateEmployee({
          managerId: employeeDetailData?.data[0]._id,
          rateValue: obj,
        });
  };
  const onGoBack = () => {
    if (isRateOn) {
      const isRedZone =
        (userType === 'manager'
          ? managerDetailData
          : userType === 'owner'
          ? ownerDetailData
          : employeeDetailData
        )?.data![0].zone === 'RED'
          ? true
          : false;
      !saveClicked && setRedZone(isRedZone);
      setIsRateOn(false);
    } else {
      props.navigation.goBack();
    }
  };
  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        hideLabel
        translateY={translateY}
        preventDefault
        onBackPress={onGoBack}
      />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        nestedScrollEnabled>
        <Stack spacing={16} spaceBelow={16}>
          {isRateOn && (
            <Stack spaceBelow={16}>
              <Stack horizontal horizontalAlign="space-between" center>
                <TextView
                  weight="medium"
                  variant={FontSizes.medium}
                  style={
                    redZone ? {color: colors.red_001} : {color: colors.green}
                  }>
                  {redZone ? t('redZone') : t('greenZone')}
                </TextView>
                <SwitchToggle
                  switchOn={redZone}
                  onPress={() => setRedZone(prevState => !prevState)}
                  circleColorOff={colors.white}
                  circleColorOn={colors.primary}
                  backgroundColorOn={colors.primary_005}
                  backgroundColorOff={colors.grey_008}
                  containerStyle={styles.switchContainer}
                  circleStyle={styles.switchCircle}
                />
              </Stack>
            </Stack>
          )}
          <Stack spaceBelow={16}>
            <Divider size={2} />
          </Stack>
          <Stack horizontal horizontalAlign="space-between">
            <Stack
              horizontal
              style={{width: Dimensions.get('screen').width - 70}}>
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
                  {managerDataRef.current.contactNo || ''}
                </TextView>
              </Stack>
            </Stack>
            {!isRateOn && isEdit && (
              <RippleIconButton
                name="edit"
                onPress={() => {
                  userType === 'manager'
                    ? props.navigation.navigate('AddManager', {
                        edit: true,
                        managerDetailData: managerDetailData?.data![0],
                      })
                    : userType === 'owner'
                    ? props.navigation.navigate('AddOwner', {
                        edit: true,
                        managerDetailData: ownerDetailData?.data![0],
                      })
                    : props.navigation.navigate('AddEmployee', {
                        edit: true,
                        managerDetailData: employeeDetailData?.data![0],
                      });
                }}
                color={colors.black}
                size={21}
                // style={styles.editButton}
              />
            )}
          </Stack>
          <Stack spaceBelow={16}>
            <Divider size={2} />
          </Stack>
          <StackItem childrenGap={10} spaceBelow={16}>
            {/* <TextField
              label={t('accountPage:company')}
              value={managerDataRef.current.companyName || ''}
              multiline
              editable={false}
            /> */}

            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('accountPage:company')}
            </TextView>
            <ScrollView nestedScrollEnabled style={styles.companyView}>
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.companyText}>
                {managerDataRef.current.companyName || ''}
              </TextView>
            </ScrollView>
            <TextView
              weight="regular"
              variant={FontSizes.regular}
              style={styles.label}>
              {t('accountPage:dob')}
            </TextView>
            <Stack
              horizontal
              horizontalAlign="space-between"
              style={styles.dob}>
              <TextView
                weight="regular"
                variant={FontSizes.medium}
                style={styles.showDOBInput}>
                {managerDataRef.current.DOB || ''}
              </TextView>
              <View style={styles.icon}>
                <Icon name="calendar" size={18} color={colors.grey_003} />
              </View>
            </Stack>
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
              value={managerDataRef.current.Designation || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:department')}
              value={managerDataRef.current.Department || ''}
              editable={false}
            />
            <TextField
              label={t('addTask:reportTo')}
              value={`${managerDataRef.current.reportTo?.name || ''}\n${
                managerDataRef.current.reportTo?.role || ''
              }`}
              multiline
              editable={false}
            />
            <TextField
              label={t('addManager:contactNumber')}
              value={managerDataRef.current.contactNo || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:alternate_contactNumber')}
              value={managerDataRef.current.altContactNo || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:companyExtensionNumber')}
              value={managerDataRef.current.companyExtensionNumber || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:hrContactNumber')}
              value={managerDataRef.current.hrContactNumber || ''}
              editable={false}
            />
            <TextField
              label={t('addManager:email')}
              value={managerDataRef.current.workEmail || ''}
              editable={false}
            />
            <TextField
              label={t('accountPage:residenceAddress')}
              value={managerDataRef.current.ResidentialAddress || ''}
              multiline
              editable={false}
            />
            <TextField
              label={t('addManager:workAddress')}
              value={managerDataRef.current.WorkAddress || ''}
              multiline
              editable={false}
            />
          </StackItem>
        </Stack>
      </Animated.ScrollView>
      {!isRateOn && isRate && userType !== userTypes.Owner.toLowerCase() ? (
        <Stack spacing={16} horizontal horizontalAlign="space-between" center>
          <DefaultButton
            title={t('rate')}
            fontSize={FontSizes.small}
            onPress={() => setIsRateOn(true)}
            style={styles.saveRateButton}
          />
        </Stack>
      ) : isRate && userType !== userTypes.Owner.toLowerCase() ? (
        <Stack spacing={16} horizontal horizontalAlign="space-between" center>
          <PrimaryButton
            title={t('save')}
            onPress={UpdateZone}
            style={styles.saveRateButton}
          />
        </Stack>
      ) : null}
      {(managerDetailLoading ||
        rateManagerLoading ||
        rateEmployeeLoading ||
        ownerDetailLoading ||
        employeeDetailLoading) && <Loader />}
    </Container>
  );
};
