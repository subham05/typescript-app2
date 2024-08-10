import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Container, TextView} from 'components';
import Header from 'components/Header';
import {Icon} from 'components/Icon';
import Loader from 'components/Loader';
import {Persona} from 'components/Persona';
import {Stack, StackItem} from 'components/Stack';
import {TextField} from 'components/TextField';
import {t} from 'i18next';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {FC, useEffect, useState} from 'react';
import {Image, ScrollView, View} from 'react-native';
import Ripple from 'react-native-material-ripple';
import {useSharedValue} from 'react-native-reanimated';
import {
  useViewCompanyDetailsMutation,
  ViewOfficeBody,
} from 'request/EditOffice';
import GPS from '../../assets/svgs/GPS.svg';
import {styles} from './index.styles';
import {colors} from 'common/theme/colors';

type ViewCompanyProps = NativeStackScreenProps<
  SignedInStackParamList,
  'ViewCompany'
>;

const ViewCompany: FC<ViewCompanyProps> = ({navigation, route}) => {
  const companyDetails = route.params?.companyData;
  const isUserAuthorizedToEdit = route.params?.isUserAuthorizedToEdit;
  const translateY = useSharedValue(0);
  const [trigger, setTrigger] = useState<boolean>(false);
  const [
    getCompanyDetails,
    {data: ViewCompanyData, isLoading: ViewCompanyIsLoading},
  ] = useViewCompanyDetailsMutation();

  useEffect(() => {
    if (companyDetails) {
      let bodyObj: ViewOfficeBody = {
        companyId: companyDetails?._id,
      };
      getCompanyDetails(bodyObj);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  const callFetchCompanyApi = () => {
    setTrigger(!trigger);
  };

  if (ViewCompanyIsLoading) {
    return <Loader />;
  }

  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={t('accountPage:viewCompany')}
        translateY={translateY}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <Stack horizontal>
          {ViewCompanyData?.data.logo &&
          ViewCompanyData.data.logo.length < 5 ? (
            <Persona name={ViewCompanyData?.data.name} size={50} />
          ) : (
            <Image
              source={{uri: ViewCompanyData?.data.logo}}
              style={styles.logo}
            />
          )}

          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            style={styles.titleStack}>
            <StackItem style={styles.mainTitleView}>
              <TextView style={styles.companyName}>
                {ViewCompanyData?.data.name}
              </TextView>
              <TextView style={styles.companyWebsite}>
                {ViewCompanyData?.data.website}
              </TextView>
            </StackItem>
            {isUserAuthorizedToEdit && (
              <Ripple
                onPress={() =>
                  navigation.navigate('AddCompany', {
                    companyData: ViewCompanyData?.data,
                    callFetchProfileApi: route?.params?.callFetchProfileApi,
                    callFetchCompanyApi: callFetchCompanyApi,
                    edit: true,
                  })
                }>
                <Icon name="edit" size={20} color={colors.black} />
              </Ripple>
            )}
          </Stack>
        </Stack>

        <StackItem style={styles.bottomStack} childrenGap={15}>
          <TextField
            label={t('addCompany:contact')}
            value={ViewCompanyData?.data.contact}
            placeholder={t('addCompany:contactPlaceholder')}
            editable={false}
          />
          <TextField
            value={ViewCompanyData?.data.officeAddress.address}
            label={t('addCompany:address')}
            placeholder={t('addCompany:address')}
            RenderRightContainer={() => <GPS style={styles.gpsIcon} />}
            editable={false}
            multiline
            selection={{start: 0}}
          />
          <TextField
            label={t('addCompany:landmark')}
            placeholder={t('addCompany:landmarkPlaceholder')}
            value={ViewCompanyData?.data.officeAddress.landmark}
            editable={false}
          />
          <Stack horizontal center horizontalAlign="space-between">
            <View style={styles.fieldView}>
              <TextField
                label={t('addCompany:country')}
                placeholder={t('addCompany:countryDropdownPlaceholder')}
                value={ViewCompanyData?.data.officeAddress.country}
                editable={false}
              />
            </View>
            <View style={styles.fieldView}>
              <TextField
                label={t('addCompany:state')}
                placeholder={t('addCompany:stateDropdownPlaceholder')}
                value={ViewCompanyData?.data.officeAddress.state}
                editable={false}
              />
            </View>
          </Stack>

          <Stack horizontal center horizontalAlign="space-between">
            <View style={styles.fieldView}>
              <TextField
                label={t('addCompany:city')}
                placeholder={t('addCompany:cityDropdownPlaceholder')}
                value={ViewCompanyData?.data.officeAddress.city}
                editable={false}
              />
            </View>
            <View style={styles.fieldView}>
              <TextField
                label={t('addCompany:zipcode')}
                placeholder={t('addCompany:zipcode')}
                value={ViewCompanyData?.data.officeAddress.zipcode}
                editable={false}
              />
            </View>
          </Stack>
        </StackItem>
      </ScrollView>
    </Container>
  );
};

export default ViewCompany;
