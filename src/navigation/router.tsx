import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {strKeys, STR_KEYS} from 'common/storage';
import GooglePlaces, {locationModal} from 'components/GooglePlaces';
import React, {
  createContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import RNSplashScreen from 'react-native-splash-screen';
import {AuthenticationScreen} from 'screens/Auth/Authentication';
import {InitialAddCompanyScreen} from 'screens/Auth/InitialAddCompany';
import {InitialPermission} from 'screens/Auth/InitialPermission';
import {InitialSelectCompanyScreen} from 'screens/Auth/InitialSelectCompany';
import {SelectLanguage} from 'screens/Auth/SelectLanguage';
import {SplashScreen} from 'screens/Auth/Splash';
import {WalkthroughScreen} from 'screens/Auth/Walkthrough';
import {
  authActions,
  authStackReducer,
  initialState,
} from './Reducers/authStackReducer';
import {
  NavActions,
  navigationReducer,
  navInitialState,
} from './Reducers/navigationReducer';
import {AuthStack} from './Stacks/AuthStack';
import {SignedInStack} from './Stacks/SignedInStack';

export type RootStackParamList = {
  Splash: undefined;
  OwnerSignedIn: undefined;
  Auth: undefined;
  CompanySelect: undefined;
  Walkthrough: undefined;
  InitialPermission: undefined;
  ManagersSignedIn: undefined;
  EmployeesSignedIn: undefined;
  VendorsSignedIn: undefined;
  SelectLanguage: undefined;
  Authentication: undefined;
  AddCompany: undefined;
  GooglePlaces: {
    onSelect: (
      value: GooglePlaceData | undefined,
      location: locationModal,
      currentLocation: string | undefined,
      pinCode?: string,
      isWorkAddressClick?: boolean,
    ) => void;
  };
};

interface IContextProps {
  signIn: (val: string) => void;
  signOut: () => void;
}
interface INavContextProps {
  saveWalkthrough: () => void;
  savePermissions: () => void;
  saveSelectCompany: () => void;
  saveResetSelectCompany: () => void;
  saveDocumentTooltip: () => void;
  saveContactTooltip: () => void;
  saveRenewalsTooltip: () => void;
  saveAuthentication: () => void;
  saveContactsSynced: () => void;
  saveMailLoggedIn: () => void;
}

export const AuthContext = createContext({} as IContextProps);
export const NavContext = createContext({} as INavContextProps);

const Stack = createNativeStackNavigator<RootStackParamList>();

const Router = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [networkState, setNetworkState] = useState<boolean | undefined>();
  const [authContextState, dispatchAuth] = useReducer(
    authStackReducer,
    initialState,
  );

  const [navContextState, dispatchNav] = useReducer(
    navigationReducer,
    navInitialState,
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {userToken, isLoading, userType, isSignOut} = {
    ...authContextState,
  };
  const {
    isWalkthroughDone,
    isPermissionTaken,
    isCompanySelected,
    isAuthenticated,
  } = {
    ...navContextState,
  };
  const SplashScreenLoading = isLoading || initialLoad;

  useEffect(() => {
    setTimeout(() => {
      setInitialLoad(false);
    }, 3000);
  }, []);

  // const getNetworkState = () => {
  //   Netinfo.fetch().then(state => {
  //     setNetworkState(state.isConnected!);
  //   });
  // };

  // let tempStorage;
  useEffect(() => {
    // Network related checking function
    // getNetworkState();

    // AsyncStorage.setItem(STR_KEYS.AUTHENTICATION, 'true');

    const bootstrapAsync = async () => {
      try {
        const AsyncData = await AsyncStorage.multiGet([
          STR_KEYS.USERTOKEN,
          STR_KEYS.USERDATA,
          STR_KEYS.INITIAL_PERMISSION,
          STR_KEYS.WALKTHROUGH,
          STR_KEYS.SELECT_COMPANY,
          STR_KEYS.USERTYPE,
          STR_KEYS.TOOLTIP_CONTACT_SEEN,
          STR_KEYS.TOOLTIP_DOCUMENT_SEEN,
          STR_KEYS.TOOLTIP_RENEWALS_SEEN,
          STR_KEYS.AUTHENTICATION,
        ]);

        const storageKeys: strKeys = Object.fromEntries(AsyncData);
        const {
          UserToken,
          isWalkthroughDone: walkthroughStrData,
          isPermissionTaken: permissionStrData,
          isCompanySelected: companySelectedStrData,
          isTooltipDocumentSeen: tooltipDocumentSeenData,
          isTooltipContactSeen: tooltipContactSeenData,
          isTooltipRenewalsSeen: tooltipRenewalsSeenData,
          UserType: UserType,
          isAuthenticated: authenticated,
        } = {
          ...storageKeys,
        };
        dispatchAuth({
          type: authActions.IS_AUTHENTICATED,
          isAuthenticated: authenticated,
          payload: undefined,
          userType: undefined,
        });
        dispatchAuth({
          type: authActions.RESTORE_TOKEN,
          payload: UserToken,
          userType: UserType,
        });
        dispatchNav({
          type: NavActions.SAVE_PERMISSION,
          payload: permissionStrData,
        });
        dispatchNav({
          type: NavActions.SAVE_WALKTHROUGH,
          payload: walkthroughStrData,
        });
        dispatchNav({
          type: NavActions.SAVE_SELECT_COMPANY,
          payload: companySelectedStrData,
        });
        dispatchNav({
          type: NavActions.SAVE_CONTACT_TOOLTIP_SEEN,
          payload: tooltipContactSeenData,
        });
        dispatchNav({
          type: NavActions.SAVE_DOCUMENT_TOOLTIP_SEEN,
          payload: tooltipDocumentSeenData,
        });
        dispatchNav({
          type: NavActions.SAVE_RENEWALS_TOOLTIP_SEEN,
          payload: tooltipRenewalsSeenData,
        });
      } catch (e) {}
    };
    bootstrapAsync();
  }, []);

  useEffect(() => {
    if (SplashScreenLoading) {
      RNSplashScreen.hide();
    }
  }, [SplashScreenLoading]);

  const authContext = useMemo(
    () => ({
      signIn: async (val: string) => {
        await AsyncStorage.setItem(STR_KEYS.USERTOKEN, 'dummy-auth-token');
        await AsyncStorage.setItem(STR_KEYS.USERTYPE, val);
        dispatchAuth({
          type: authActions.SIGN_IN,
          payload: 'dummy-auth-token',
          userType: val,
        });
      },
      signOut: async () => {
        await AsyncStorage.removeItem(STR_KEYS.USERTOKEN);
        await AsyncStorage.removeItem(STR_KEYS.USERTYPE);
        await AsyncStorage.removeItem(STR_KEYS.CONTACTS_SYNCED);
        await AsyncStorage.removeItem(STR_KEYS.Mail_LoggedIn);
        dispatchAuth({
          type: authActions.SIGN_OUT,
          payload: null,
          userType: null,
        });
        AsyncStorage.removeItem(STR_KEYS.SELECT_COMPANY);
        dispatchNav({
          type: NavActions.SAVE_SELECT_COMPANY,
          payload: null,
        });
      },
    }),
    [],
  );

  const navContext: INavContextProps = useMemo(
    () => ({
      saveAuthentication: () => {
        AsyncStorage.setItem(STR_KEYS.AUTHENTICATION, 'true');
        dispatchNav({
          type: NavActions.IS_AUTHENTICATED,
          payload: true,
        });
      },
      savePermissions: () => {
        AsyncStorage.setItem(STR_KEYS.INITIAL_PERMISSION, 'true');
        dispatchNav({
          type: NavActions.SAVE_PERMISSION,
          payload: true,
        });
      },
      saveWalkthrough: () => {
        AsyncStorage.setItem(STR_KEYS.WALKTHROUGH, 'true');
        dispatchNav({
          type: NavActions.SAVE_WALKTHROUGH,
          payload: true,
        });
      },
      saveSelectCompany: () => {
        AsyncStorage.setItem(STR_KEYS.SELECT_COMPANY, 'true');
        dispatchNav({
          type: NavActions.SAVE_SELECT_COMPANY,
          payload: true,
        });
      },
      saveResetSelectCompany: () => {
        AsyncStorage.removeItem(STR_KEYS.SELECT_COMPANY);
        dispatchNav({
          type: NavActions.SAVE_SELECT_COMPANY,
          payload: null,
        });
      },
      saveDocumentTooltip: () => {
        AsyncStorage.setItem(STR_KEYS.TOOLTIP_DOCUMENT_SEEN, 'true');
        dispatchNav({
          type: NavActions.SAVE_DOCUMENT_TOOLTIP_SEEN,
          payload: true,
        });
      },
      saveContactTooltip: () => {
        AsyncStorage.setItem(STR_KEYS.TOOLTIP_CONTACT_SEEN, 'true');
        dispatchNav({
          type: NavActions.SAVE_CONTACT_TOOLTIP_SEEN,
          payload: true,
        });
      },
      saveRenewalsTooltip: () => {
        AsyncStorage.setItem(STR_KEYS.TOOLTIP_RENEWALS_SEEN, 'true');
        dispatchNav({
          type: NavActions.SAVE_RENEWALS_TOOLTIP_SEEN,
          payload: true,
        });
      },
      saveContactsSynced: () => {
        AsyncStorage.setItem(STR_KEYS.CONTACTS_SYNCED, 'true');
        dispatchNav({
          type: NavActions.SAVE_CONTACT_SYNCED,
          payload: true,
        });
      },
      saveMailLoggedIn: () => {
        AsyncStorage.setItem(STR_KEYS.Mail_LoggedIn, 'true');
        dispatchNav({
          type: NavActions.SAVE_MAIL_LOGGEDIN,
          payload: true,
        });
      },
    }),
    [],
  );

  // const signedInStackFunction = () => {
  //   switch (userType) {
  //     case 'Owner':
  //       return <Stack.Screen name="OwnerSignedIn" children={SignedInStack} />;
  //     case 'Manager':
  //       return (
  //         <Stack.Screen
  //           name="ManagersSignedIn"
  //           children={ManagersSignedInStack}
  //         />
  //       );
  //     case 'Employee':
  //       return (
  //         <Stack.Screen
  //           name="EmployeesSignedIn"
  //           children={EmployeesSignedInStack}
  //         />
  //       );
  //     default:
  //       return (
  //         <Stack.Screen
  //           name="VendorsSignedIn"
  //           children={VendorsSignedInStack}
  //         />
  //       );
  //   }
  // };
  const signedInStackFunction = () => {
    return <Stack.Screen name="OwnerSignedIn" children={SignedInStack} />;
  };
  return (
    <AuthContext.Provider value={authContext}>
      <NavContext.Provider value={navContext}>
        <>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
              }}>
              <>
                {SplashScreenLoading ? (
                  <Stack.Screen name="Splash" component={SplashScreen} />
                ) : !isAuthenticated ? (
                  <Stack.Screen
                    name="Authentication"
                    component={AuthenticationScreen}
                  />
                ) : userToken === null ? (
                  <>
                    {isWalkthroughDone == null ? (
                      <>
                        <Stack.Screen
                          name="SelectLanguage"
                          component={SelectLanguage}
                        />
                        <Stack.Screen
                          name="Walkthrough"
                          component={WalkthroughScreen}
                        />
                      </>
                    ) : isPermissionTaken == null ? (
                      <Stack.Screen
                        name="InitialPermission"
                        component={InitialPermission}
                      />
                    ) : (
                      <Stack.Screen name="Auth" children={AuthStack} />
                    )}
                  </>
                ) : (
                  <>
                    {isCompanySelected == null && !isSignOut ? (
                      <>
                        <Stack.Screen
                          name="CompanySelect"
                          component={InitialSelectCompanyScreen}
                        />
                        <Stack.Screen
                          name="AddCompany"
                          component={InitialAddCompanyScreen}
                        />
                        <Stack.Screen
                          name="GooglePlaces"
                          component={GooglePlaces}
                        />
                      </>
                    ) : (
                      signedInStackFunction()
                    )}
                  </>
                )}
              </>
            </Stack.Navigator>
          </NavigationContainer>
        </>
      </NavContext.Provider>
    </AuthContext.Provider>
  );
};

export default Router;
