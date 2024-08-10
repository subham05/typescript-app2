import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from 'components/CustomDrawer';
import React from 'react';
import {ActivityLogsScreen} from 'screens/ActivityLog';
import {AttendanceSummeryScreen} from 'screens/AttendanceSummery';
import CalendarListScreen from 'screens/CalendarList';
import {ChangeLanguage} from 'screens/ChangeLanguage';
import ChangePassword from 'screens/ChangePassword';
import CompanyStructure from 'screens/CompanyStructure';
import {ChangeTimezoneScreen} from 'screens/ChangeTimezone';
import {SelectContactScreen} from 'screens/Contacts/SelectContactScreen';
// import {ContactRepositoryScreen} from 'screens/ContactRepository';
import {DocumentRepositoryScreen} from 'screens/DocumentRepository';
import {EmployeeContactScreen} from 'screens/EmployeeContacts';
import {ManagerContactsScreen} from 'screens/ManagerContacts';
import {OwnerContactsScreen} from 'screens/OwnerContacts';
import {PerformanceReportScreen} from 'screens/PerformanceReport';
import {PersonalAssistantContact} from 'screens/PersonalAssistantContact';
import {RenewalsScreen} from 'screens/Renewals';
import {StaffReportScreen} from 'screens/StaffReport';
import {TaskReportScreen} from 'screens/TaskReport';
import {VendorsSuppliersScreen} from 'screens/Vendors-Suppliers';
import {VoiceNotesScreen} from 'screens/VoiceNotes';
import {WorkloadReportScreen} from 'screens/WorkloadReport';
import {BottomTabNavigation} from './MainTabNavigation';
import {GeneralManagerContactsScreen} from 'screens/GeneralManagerContacts';
import ReportingStructure from 'screens/ReportingStructure';
import CMSScreen from 'screens/cms';

export type DrawerNavParamList = {
  BottomTabs: undefined;
  DocumentRepository: {isSuccess?: boolean};
  ContactScreen: undefined;
  StaffReport: undefined;
  WorkloadReport: undefined;
  PerformanceReport: undefined;
  TaskReport: undefined;
  VendorSupplier: undefined;
  OwnerContact: undefined;
  ManagerContact: undefined;
  AttendanceSummery: undefined;
  VoiceNotes: {sharedWithMe: number};
  ActivityLogs?: {type?: string};
  CalendarList: undefined;
  Renewals: {isSuccess?: boolean};
  ChangePassword: undefined;
  ChangeLanguage: undefined;
  CompanyStructure: undefined;
  ReportingStructure: undefined;
  ChangeTimezone: undefined;
  EmployeeContactScreen: undefined;
  PersonalAssistantContact: undefined;
  GeneralManagerContacts: undefined;
  CMSScreen: {cameFrom: string};
};

const Drawer = createDrawerNavigator<DrawerNavParamList>();

export const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: '82%',
        },
      }}
      drawerContent={props => <CustomDrawer {...props} />}>
      <Drawer.Screen name="BottomTabs" component={BottomTabNavigation} />
      <Drawer.Screen name="ContactScreen" component={SelectContactScreen} />
      <Drawer.Screen
        name="DocumentRepository"
        component={DocumentRepositoryScreen}
      />
      <Drawer.Screen name="StaffReport" component={StaffReportScreen} />
      <Drawer.Screen name="WorkloadReport" component={WorkloadReportScreen} />
      <Drawer.Screen
        name="PerformanceReport"
        component={PerformanceReportScreen}
      />
      <Drawer.Screen name="TaskReport" component={TaskReportScreen} />
      <Drawer.Screen name="VendorSupplier" component={VendorsSuppliersScreen} />
      <Drawer.Screen name="OwnerContact" component={OwnerContactsScreen} />
      <Drawer.Screen name="ManagerContact" component={ManagerContactsScreen} />
      <Drawer.Screen
        name="AttendanceSummery"
        component={AttendanceSummeryScreen}
      />
      <Drawer.Screen name="VoiceNotes" component={VoiceNotesScreen} />
      <Drawer.Screen name="ActivityLogs" component={ActivityLogsScreen} />
      <Drawer.Screen name="CalendarList" component={CalendarListScreen} />
      <Drawer.Screen name="Renewals" component={RenewalsScreen} />
      <Drawer.Screen name="ChangePassword" component={ChangePassword} />
      <Drawer.Screen name="ChangeLanguage" component={ChangeLanguage} />
      <Drawer.Screen name="CompanyStructure" component={CompanyStructure} />
      <Drawer.Screen name="ReportingStructure" component={ReportingStructure} />
      <Drawer.Screen name="ChangeTimezone" component={ChangeTimezoneScreen} />
      <Drawer.Screen
        name="EmployeeContactScreen"
        component={EmployeeContactScreen}
      />
      <Drawer.Screen
        name="PersonalAssistantContact"
        component={PersonalAssistantContact}
      />
      <Drawer.Screen
        name="GeneralManagerContacts"
        component={GeneralManagerContactsScreen}
      />
      <Drawer.Screen name="CMSScreen" component={CMSScreen} />
    </Drawer.Navigator>
  );
};
