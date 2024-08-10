import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from 'components/CustomDrawer';
import React from 'react';
import {ContactScreen} from 'screens/Contacts';
import {DocumentRepositoryScreen} from 'screens/DocumentRepository';
import {ManagerPerformanceReportScreen} from 'screens/_ManagerScreens/PerformanceReport';
import {ManagerTaskReportScreen} from 'screens/_ManagerScreens/TaskReport';
import {ManagerWorkloadReportScreen} from 'screens/_ManagerScreens/WorkloadReport';
import {StaffReportScreen} from 'screens/StaffReport';
import {VendorsSuppliersScreen} from 'screens/Vendors-Suppliers';
import {ManagersBottomTabNavigation} from './ManagersMainTabNavigation';
// import {EmployeeContactsScreen} from 'screens/_ManagerScreens/EmployeeContacts';
import {VendorContactsScreen} from 'screens/_ManagerScreens/VendorContacts';

export type ManagersDrawerNavParamList = {
  BottomTabs: undefined;
  DocumentRepository: undefined;
  Contacts: undefined;
  StaffReport: undefined;
  WorkloadReport: undefined;
  PerformanceReport: undefined;
  TaskReport: undefined;
  VendorSupplier: undefined;
  // EmployeeContact: undefined;
  VendorContact: undefined;
};

const Drawer = createDrawerNavigator<ManagersDrawerNavParamList>();

export const ManagersDrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '82%',
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen
        name="BottomTabs"
        component={ManagersBottomTabNavigation}
      />
      <Drawer.Screen name="Contacts" component={ContactScreen} />
      <Drawer.Screen
        name="DocumentRepository"
        component={DocumentRepositoryScreen}
      />
      <Drawer.Screen name="StaffReport" component={StaffReportScreen} />
      <Drawer.Screen
        name="WorkloadReport"
        component={ManagerWorkloadReportScreen}
      />
      <Drawer.Screen
        name="PerformanceReport"
        component={ManagerPerformanceReportScreen}
      />
      <Drawer.Screen name="TaskReport" component={ManagerTaskReportScreen} />
      <Drawer.Screen name="VendorSupplier" component={VendorsSuppliersScreen} />
      {/* <Drawer.Screen
        name="EmployeeContact"
        component={EmployeeContactsScreen}
      /> */}
      <Drawer.Screen name="VendorContact" component={VendorContactsScreen} />
    </Drawer.Navigator>
  );
};
