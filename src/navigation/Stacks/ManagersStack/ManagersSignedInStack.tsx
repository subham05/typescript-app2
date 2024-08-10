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
import {CreateEventScreen} from 'screens/CreateEvent';
import {CreateGroupScreen} from 'screens/CreateGroup';
import {DetailReportScreen} from 'screens/DetailReport';
import {EditBusinessCard} from 'screens/EditBusinessCard';
import {EditGroupIconScreen} from 'screens/EditGroupIcon';
import {EditGroupSubjectScreen} from 'screens/EditGroupSubject';
import {EventDetailsScreen} from 'screens/EventDetails';
import {EventsScreen} from 'screens/Events';
import {InprogressTaskScreen} from 'screens/InprogressTask';
import {InviteMembers} from 'screens/InviteMembers';
import {MessagesProps} from 'screens/Messages/components/MessagesItem';
import {MessagesSearchScreen} from 'screens/MessagesSearch';
import {NotificationContactRequest} from 'screens/NotificationContactRequest';
import {Notifications} from 'screens/Notifications';
import {SearchManageTaskScreen} from 'screens/SearchManageTask';
import {SelectCompanyScreen} from 'screens/SelectCompany';
import {SelectResourceMember} from 'screens/SelectResourceMember';
import {SelfAssignedTaskScreen} from 'screens/SelfAssignedTask';
import {ShareContactScreen} from 'screens/ShareContact';
import {SharedContactDetailsScreen} from 'screens/SharedContactDetails';
import {TaskDetailsScreen} from 'screens/TaskDetails';
import {VendorDetailsScreen} from 'screens/VendorDetails';
import {VendorsTaskScreen} from 'screens/VendorsTask';
import {ViewContactScreen} from 'screens/ViewContact';
import {ViewFileScreen} from 'screens/ViewFile';
import {ViewGroupScreen} from 'screens/ViewGroup';
import {ManagersAccountScreen} from 'screens/_ManagerScreens/Account';
import {AddEmployeeScreen} from 'screens/_ManagerScreens/AddEmployee';
import {ManagersAddSubtaskScreen} from 'screens/_ManagerScreens/AddSubTask';
import {ManagersAddTaskScreen} from 'screens/_ManagerScreens/AddTask';
import {AddVendorScreen} from 'screens/_ManagerScreens/AddVendor';
import {AssignedToMeScreen} from 'screens/_ManagerScreens/AssignedToMe';
import {ManagerAssignTaskSubtaskScreen} from 'screens/_ManagerScreens/AssignTaskSubtask';
import {EmployeeContactsDetailsScreen} from 'screens/_ManagerScreens/ContactDetails/EmployeeContactDetails';
import {VendorContactsDetailsScreen} from 'screens/_ManagerScreens/ContactDetails/VendorContactDetails';
import {ManagerLinkedTaskScreen} from 'screens/_ManagerScreens/LinkedTask';
import {ManagerMailMessageScreen} from 'screens/_ManagerScreens/MailMessage';
import {ManagerPendingTaskScreen} from 'screens/_ManagerScreens/PendingTask';
import {ReallocateTOScreen} from 'screens/_ManagerScreens/ReallocateTo';
import {ReallocationTaskScreen} from 'screens/_ManagerScreens/ReallocationTask';
import {ManagerRelatedTaskScreen} from 'screens/_ManagerScreens/RelatedTask';
import {ReportedByMeScreen} from 'screens/_ManagerScreens/ReportedByMe';
import {SharedContactScreen} from 'screens/_ManagerScreens/SharedContacts';
import {ManagerTaskDetailScreen} from 'screens/_ManagerScreens/TaskDetail';
import {ManagerTaskDetailRelatedTaskScreen} from 'screens/_ManagerScreens/TaskDetailRelatedTask';
import {ManagersDrawerNavigation} from './ManagersDrawerNavigation';
// import {BottomTabNavigation} from './MainTabNavigation';

export type ManagerSignedInStackParamList = {
  // BottomTabs: undefined;
  DrawerNavigation: undefined;
  Events: undefined;
  EventDetails?: {eventData: EventInterface};
  InprogressTask: undefined;
  Notification: undefined;
  NotificationContactRequest: undefined;
  SelectCompany?: {allSelect: boolean};
  TaskDetails?: {
    taskProps: TaskInterface;
    vendors?: boolean;
    hideButtons?: boolean;
  };
  TaskDetailsManager?: {
    taskProps: TaskInterface;
    vendors?: boolean;
    hideButtons?: boolean;
  };
  AddTask?: {subTask: boolean};
  ManagersAddSubTask?: {type: string};
  AddVendor?: {edit?: boolean};
  AddEmployee?: {edit?: boolean};
  ManagersAccountScreen: undefined;
  ManagersShareContact: undefined;
  EditGroupIcon?: {profile?: boolean; image?: string};
  CreateEvent: undefined;
  SelectMember: undefined;
  InviteMember: undefined;
  TaskDetail: undefined;
  MessagesSearch: undefined;
  CreateGroup: undefined;
  AddGroupName: undefined;
  ChattingScreen?: {type?: string; data?: MessagesProps};
  ViewGroup?: {data?: MessagesProps};
  AddMember: undefined;
  ViewContact?: {data?: MessagesProps | MessageContactProps};
  EditGroupSubject: undefined;
  AllContacts: undefined;
  ManagerPendingTask: undefined;
  ReallocationTask: undefined;
  SelfAssignedTask: undefined;
  AssignedToMe: undefined;
  ReportedByMe: undefined;
  EditBusinessCard: undefined;
  PublicContactRepository: undefined;
  SharedContact: undefined;
  SharedContactDetails: undefined;
  ViewFile: undefined;
  AssignTask: undefined;
  VendorDetails: undefined;
  VendorTask: undefined;
  DetailPerformanceReport: undefined;
  RelatedTask: undefined;
  MailMessage: undefined;
  ReallocateTo: undefined;
  LinkedTask: undefined;
  EmployeeContactDetails: undefined;
  VendorContactDetails: undefined;
  SearchManageTask: undefined;
};

const Stack = createNativeStackNavigator<ManagerSignedInStackParamList>();
export const ManagersSignedInStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="DrawerNavigation"
        component={ManagersDrawerNavigation}
      />
      <Stack.Screen name="InprogressTask" component={InprogressTaskScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
      <Stack.Screen name="Notification" component={Notifications} />
      <Stack.Screen
        name="NotificationContactRequest"
        component={NotificationContactRequest}
      />
      <Stack.Screen name="AddTask" component={ManagersAddTaskScreen} />
      <Stack.Screen
        name="ManagersAddSubTask"
        component={ManagersAddSubtaskScreen}
      />
      <Stack.Screen name="AddVendor" component={AddVendorScreen} />
      <Stack.Screen name="AddEmployee" component={AddEmployeeScreen} />
      <Stack.Screen
        name="ManagersAccountScreen"
        component={ManagersAccountScreen}
      />
      <Stack.Screen
        name="ManagersShareContact"
        component={ShareContactScreen}
      />
      <Stack.Screen name="EditGroupIcon" component={EditGroupIconScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="SelectMember" component={SelectResourceMember} />
      <Stack.Screen name="InviteMember" component={InviteMembers} />
      <Stack.Screen name="TaskDetail" component={TaskDetailsScreen} />
      <Stack.Screen name="TaskDetails" component={ManagerTaskDetailScreen} />
      <Stack.Screen
        name="TaskDetailsManager"
        component={ManagerTaskDetailRelatedTaskScreen}
      />
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
      <Stack.Screen
        name="ManagerPendingTask"
        component={ManagerPendingTaskScreen}
      />
      <Stack.Screen name="AssignedToMe" component={AssignedToMeScreen} />
      <Stack.Screen name="ReportedByMe" component={ReportedByMeScreen} />
      <Stack.Screen
        name="ReallocationTask"
        component={ReallocationTaskScreen}
      />
      <Stack.Screen
        name="PublicContactRepository"
        component={ContactRepositoryScreen}
      />
      <Stack.Screen name="EditBusinessCard" component={EditBusinessCard} />
      <Stack.Screen
        name="SharedContactDetails"
        component={SharedContactDetailsScreen}
      />
      <Stack.Screen name="SharedContact" component={SharedContactScreen} />
      <Stack.Screen name="ViewFile" component={ViewFileScreen} />
      <Stack.Screen
        name="AssignTask"
        component={ManagerAssignTaskSubtaskScreen}
      />
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
      <Stack.Screen name="VendorTask" component={VendorsTaskScreen} />
      <Stack.Screen
        name="DetailPerformanceReport"
        component={DetailReportScreen}
      />
      <Stack.Screen name="MailMessage" component={ManagerMailMessageScreen} />
      <Stack.Screen name="RelatedTask" component={ManagerRelatedTaskScreen} />
      <Stack.Screen name="ReallocateTo" component={ReallocateTOScreen} />
      <Stack.Screen name="LinkedTask" component={ManagerLinkedTaskScreen} />
      <Stack.Screen
        name="EmployeeContactDetails"
        component={EmployeeContactsDetailsScreen}
      />
      <Stack.Screen
        name="VendorContactDetails"
        component={VendorContactsDetailsScreen}
      />
      <Stack.Screen
        name="SelfAssignedTask"
        component={SelfAssignedTaskScreen}
      />
      <Stack.Screen
        name="SearchManageTask"
        component={SearchManageTaskScreen}
      />
    </Stack.Navigator>
  );
};
