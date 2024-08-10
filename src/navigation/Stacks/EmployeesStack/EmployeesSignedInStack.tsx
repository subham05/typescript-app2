import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EventInterface} from 'components/Events/EventItem';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {TaskInterface} from 'components/Task/TaskItem';
import React from 'react';
import {AddGroupNameScreen} from 'screens/AddGroupName';
import {AddMemberScreen} from 'screens/AddMember';
import {AllContactScreen} from 'screens/AllContacts';
import {ChattingScreen} from 'screens/ChattingScreen';
import {ContactRepositoryScreen} from 'screens/ContactRepository';
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
import {SharedContactDetailsScreen} from 'screens/SharedContactDetails';
import {TaskDetailsScreen} from 'screens/TaskDetails';
import {ViewContactScreen} from 'screens/ViewContact';
import {ViewFileScreen} from 'screens/ViewFile';
import {ViewGroupScreen} from 'screens/ViewGroup';
import {EmployeesAccountScreen} from 'screens/_EmployeesScreens/Account';
import {EmployeeAddTaskScreen} from 'screens/_EmployeesScreens/AddTask';
import {EmployeeAssignTaskSubtaskScreen} from 'screens/_EmployeesScreens/AssignTaskSubtask';
import {ReallocateToScreen} from 'screens/_EmployeesScreens/Contacts';
import {EmployeeDetailReportScreen} from 'screens/_EmployeesScreens/DetailReport';
import {EmployeeMailMessageScreen} from 'screens/_EmployeesScreens/MailMessage';
import {RelatedTaskScreen} from 'screens/_EmployeesScreens/RelatedTask';
import {SearchManageTaskScreen} from 'screens/_EmployeesScreens/SearchManageTask';
import {SelfAssignedTaskScreen} from 'screens/_EmployeesScreens/SelfAssignedTask';
import {EmployeeShareContactScreen} from 'screens/_EmployeesScreens/ShareContact';
import {EmployeeSharedContactScreen} from 'screens/_EmployeesScreens/SharedContacts';
import {EmployeeTaskDetailScreen} from 'screens/_EmployeesScreens/TaskDetail';
import {EmployeeTaskDetailAssignedTaskScreen} from 'screens/_EmployeesScreens/TaskDetailAssignedTask';
import {UpcomingDeadlinesScreen} from 'screens/_EmployeesScreens/UpcomingDeadlines';
import {EmployeesDrawerNavigation} from './EmployeesDrawerNavigation';
// import {BottomTabNavigation} from './MainTabNavigation';

export type EmployeesSignedInStackParamList = {
  // BottomTabs: undefined;
  DrawerNavigation: undefined;
  Events: undefined;
  EventDetails?: {eventData: EventInterface};
  UpcomingDeadlines: undefined;
  Notification: undefined;
  NotificationContactRequest: undefined;
  EmployeeAddTask?: {subTask: boolean};
  SelectCompany?: {allSelect: boolean};
  TaskDetails?: {
    taskProps: TaskInterface;
    vendors?: boolean;
    hideButtons?: boolean;
  };
  TaskDetailsEmployee?: {
    taskProps: TaskInterface;
    vendors?: boolean;
    inbox?: boolean;
    hideButtons?: boolean;
  };
  TaskDetail: undefined;
  ReallocateTo: undefined;
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
  RelatedTask: undefined;
  MailMessage: undefined;
  PublicContactRepository: undefined;
  SharedContact: undefined;
  SharedContactDetails: undefined;
  ViewFile: undefined;
  AssignTask: undefined;
  AddTask?: {subTask: boolean};
  DetailPerformanceReport: undefined;
  SearchManageTask: undefined;
  SelfAssignedTask: undefined;
};

const Stack = createNativeStackNavigator<EmployeesSignedInStackParamList>();
export const EmployeesSignedInStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="DrawerNavigation"
        component={EmployeesDrawerNavigation}
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
      <Stack.Screen name="EmployeeAddTask" component={EmployeeAddTaskScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailsScreen} />
      <Stack.Screen name="TaskDetails" component={EmployeeTaskDetailScreen} />
      <Stack.Screen
        name="TaskDetailsEmployee"
        component={EmployeeTaskDetailAssignedTaskScreen}
      />
      <Stack.Screen name="ReallocateTo" component={ReallocateToScreen} />
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
      <Stack.Screen name="AccountScreen" component={EmployeesAccountScreen} />
      <Stack.Screen
        name="EmployeeShareContact"
        component={EmployeeShareContactScreen}
      />
      <Stack.Screen name="MailMessage" component={EmployeeMailMessageScreen} />
      <Stack.Screen name="RelatedTask" component={RelatedTaskScreen} />
      <Stack.Screen
        name="PublicContactRepository"
        component={ContactRepositoryScreen}
      />
      <Stack.Screen
        name="SharedContact"
        component={EmployeeSharedContactScreen}
      />
      <Stack.Screen
        name="SharedContactDetails"
        component={SharedContactDetailsScreen}
      />
      <Stack.Screen name="ViewFile" component={ViewFileScreen} />
      <Stack.Screen
        name="AssignTask"
        component={EmployeeAssignTaskSubtaskScreen}
      />
      <Stack.Screen
        name="DetailPerformanceReport"
        component={EmployeeDetailReportScreen}
      />
      <Stack.Screen
        name="SearchManageTask"
        component={SearchManageTaskScreen}
      />
      <Stack.Screen
        name="SelfAssignedTask"
        component={SelfAssignedTaskScreen}
      />
    </Stack.Navigator>
  );
};
