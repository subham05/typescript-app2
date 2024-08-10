import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from 'components/CustomDrawer';
import React from 'react';
import {ContactScreen} from 'screens/Contacts';
import {DocumentRepositoryScreen} from 'screens/DocumentRepository';
import {EmployeePerformanceReportScreen} from 'screens/_EmployeesScreens/PerformanceReport';
import {EmployeeTaskReportScreen} from 'screens/_EmployeesScreens/TaskReport';
import {EmployeeWorkloadReportScreen} from 'screens/_EmployeesScreens/WorkloadReport';
import {EmployeesBottomTabNavigation} from './EmployeesMainTabNavigation';

export type EmployeesDrawerNavParamList = {
  BottomTabs: undefined;
  DocumentRepository: undefined;
  Contacts: undefined;
  WorkloadReport: undefined;
  PerformanceReport: undefined;
  TaskReport: undefined;
};

const Drawer = createDrawerNavigator<EmployeesDrawerNavParamList>();

export const EmployeesDrawerNavigation = () => {
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
        component={EmployeesBottomTabNavigation}
      />
      <Drawer.Screen name="Contacts" component={ContactScreen} />
      <Drawer.Screen
        name="DocumentRepository"
        component={DocumentRepositoryScreen}
      />
      <Drawer.Screen
        name="WorkloadReport"
        component={EmployeeWorkloadReportScreen}
      />
      <Drawer.Screen
        name="PerformanceReport"
        component={EmployeePerformanceReportScreen}
      />
      <Drawer.Screen name="TaskReport" component={EmployeeTaskReportScreen} />
    </Drawer.Navigator>
  );
};
