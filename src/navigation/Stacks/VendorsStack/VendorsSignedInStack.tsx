import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EventInterface} from 'components/Events/EventItem';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {TaskInterface} from 'components/Task/TaskItem';
import React from 'react';
import {AddGroupNameScreen} from 'screens/AddGroupName';
import {AddMemberScreen} from 'screens/AddMember';
import {AllContactScreen} from 'screens/AllContacts';
import {ChattingScreen} from 'screens/ChattingScreen';
import {CreateGroupScreen} from 'screens/CreateGroup';
import {EditGroupIconScreen} from 'screens/EditGroupIcon';
import {EditGroupSubjectScreen} from 'screens/EditGroupSubject';
import {EventDetailsScreen} from 'screens/EventDetails';
import {EventsScreen} from 'screens/Events';
import {MessagesProps} from 'screens/Messages/components/MessagesItem';
import {MessagesSearchScreen} from 'screens/MessagesSearch';
import {NotificationConatctRequest} from 'screens/NotificationContactRequest';
import {Notifications} from 'screens/Notifications';
import {SelectCompanyScreen} from 'screens/SelectCompany';
import {TaskDetailsScreen} from 'screens/TaskDetails';
import {ViewContactScreen} from 'screens/ViewContact';
import {ViewGroupScreen} from 'screens/ViewGroup';
import {UpcomingDeadlinesScreen} from 'screens/_EmployeesScreens/UpcomingDeadlines';
import {VendorsAccountScreen} from 'screens/_VendorsScreens/Account';
import {VendorTaskDetailScreen} from 'screens/_VendorsScreens/TaskDetail';
import {VendorsDrawerNavigation} from './VendorsDrawerNavigation';
// import {BottomTabNavigation} from './MainTabNavigation';

export type VendorsSignedInStackParamList = {
  // BottomTabs: undefined;
  DrawerNavigation: undefined;
  Events: undefined;
  EventDetails?: {eventData: EventInterface};
  UpcomingDeadlines: undefined;
  Notification: undefined;
  NotificationContactRequest: undefined;
  EmployeeAddTask?: {subTask: boolean};
  SelectCompany?: {allSelect: boolean};
  TaskDetails?: {taskProps: TaskInterface; vendors?: boolean};
  TaskDetailsEmployee?: {taskProps: TaskInterface; vendors?: boolean};
  TaskDetail: undefined;
  EditGroupIcon?: {profile?: boolean; image?: string};
  MessagesSearch: undefined;
  CreateGroup: undefined;
  AddGroupName: undefined;
  ChattingScreen?: {type?: string; data?: MessagesProps};
  ViewGroup?: {data?: MessagesProps};
  AddMember: undefined;
  ViewContact?: {data?: MessagesProps | MessageContactProps};
  EditGroupSubject: undefined;
  AllContacts: undefined;
  AccountScreen: undefined;
  EmployeeShareContact: undefined;
};

const Stack = createNativeStackNavigator<VendorsSignedInStackParamList>();
export const VendorsSignedInStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="DrawerNavigation"
        component={VendorsDrawerNavigation}
      />
      <Stack.Screen
        name="UpcomingDeadlines"
        component={UpcomingDeadlinesScreen}
      />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
      <Stack.Screen name="Notification" component={Notifications} />
      <Stack.Screen
        name="NotificationContactRequest"
        component={NotificationConatctRequest}
      />
      <Stack.Screen name="TaskDetail" component={TaskDetailsScreen} />
      <Stack.Screen name="TaskDetails" component={VendorTaskDetailScreen} />
      <Stack.Screen name="EditGroupIcon" component={EditGroupIconScreen} />
      <Stack.Screen name="MessagesSearch" component={MessagesSearchScreen} />
      <Stack.Screen name="AllContacts" component={AllContactScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="AddGroupName" component={AddGroupNameScreen} />
      <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
      <Stack.Screen name="ViewGroup" component={ViewGroupScreen} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} />
      <Stack.Screen name="ViewContact" component={ViewContactScreen} />
      <Stack.Screen
        name="EditGroupSubject"
        component={EditGroupSubjectScreen}
      />
      <Stack.Screen name="AccountScreen" component={VendorsAccountScreen} />
    </Stack.Navigator>
  );
};
