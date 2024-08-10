import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {EventInterface} from 'components/Events/EventItem';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {TaskInterface} from 'components/Task/TaskItem';
import React from 'react';
import {AccessLogsScreen} from 'screens/AccessLogs';
import {AccountScreen} from 'screens/Account';
import {AddCompanyScreen} from 'screens/AddCompany';
import {AddGroupNameScreen} from 'screens/AddGroupName';
import {AddManagerScreen} from 'screens/AddManager';
import {AddMemberScreen} from 'screens/AddMember';
import {AddOwnerScreen} from 'screens/AddOwner';
import {AddSubtaskScreen} from 'screens/AddSubTask';
// import {DrawerNavigation} from './DrawerNavigation';
import {membersProps} from 'components/Members/MembersItem';
import {TaskDetails} from 'request/ManageTask';
import {AddTaskScreen} from 'screens/AddTask';
import {AllContactScreen} from 'screens/AllContacts';
import {AssignTaskSubtaskScreen} from 'screens/AssignTaskSubtask';
import {AttendanceReportScreen} from 'screens/AttendanceReport';
import {AttendanceReportConfigurationScreen} from 'screens/AttendanceReportConfiguration';
import {BusinessCardScreen} from 'screens/BusinessCard';
import {CalendarViewScreen} from 'screens/CalendarView';
import {ChattingScreen} from 'screens/ChattingScreenFooter';
import {ContactsDetailsScreen} from 'screens/ContactDetails';
import {ManagerContactsDetailsScreen} from 'screens/ContactDetails/ManagerContactDetails';
import {ContactLogsScreen} from 'screens/ContactLogs';
import {ContactRepositoryScreen} from 'screens/ContactRepository';
import {SelectContactScreen} from 'screens/Contacts/SelectContactScreen';
import {CreateContactScreen} from 'screens/CreateContact';
import {ContactFormModel} from 'screens/CreateContact/types';
import {CreateDocumentScreen} from 'screens/CreateDocument';
import {CreateEventScreen} from 'screens/CreateEvent';
import {CreateGroupScreen} from 'screens/CreateGroup';
import {CreateRenewalsScreen} from 'screens/CreateRenewal';
import {CustomRecurrenceScreen} from 'screens/CustomRecurrence';
import {DetailReportScreen} from 'screens/DetailReport';
import {EditBusinessCard} from 'screens/EditBusinessCard';
import {EditGroupIconScreen} from 'screens/EditGroupIcon';
import {EditGroupSubjectScreen} from 'screens/EditGroupSubject';
import {EditRenewalsScreen} from 'screens/EditRenewals';
import {EventDetailsScreen} from 'screens/EventDetails';
import {EventsScreen} from 'screens/Events';
import {FilteredContactRepositoryScreen} from 'screens/FilteredContactRepository';
import {InprogressTaskScreen} from 'screens/InprogressTask';
import {InviteMembers} from 'screens/InviteMembers';
import {LinkedTaskScreen} from 'screens/LinkedTask';
import {MailMessageScreen} from 'screens/MailMessage';
import {MarkAttendanceScreen} from 'screens/MarkAttendance';
import {MessagesProps} from 'screens/Messages/components/MessagesItem';
import {MessagesSearchScreen} from 'screens/MessagesSearch';
import {NotificationContactRequest} from 'screens/NotificationContactRequest';
import {Notifications} from 'screens/Notifications';
import {PendingTaskScreen} from 'screens/PendingTask';
import {PinnedTaskScreen} from 'screens/PinnedTasks';
import {PointsEarnedScreen} from 'screens/PointsEarned';
import {RateManagerScreen} from 'screens/RateManager';
import {ReallocationTaskScreen} from 'screens/ReallocationTask';
import {RelatedTaskScreen} from 'screens/RelatedTask';
import {ReminderScreen} from 'screens/Reminder';
import {SearchManageTaskScreen} from 'screens/SearchManageTask';
import {SelectCompanyScreen} from 'screens/SelectCompany';
import {SelectResourceMember} from 'screens/SelectResourceMember';
import {SelfAssignedTaskScreen} from 'screens/SelfAssignedTask';
import {ShareContactScreen} from 'screens/ShareContact';
import {ShareContactVoiceNotesScreen} from 'screens/ShareContactVoiceNotes';
import {ShareContactWithScreen} from 'screens/ShareContactWith';
import {SharedContactDetailsScreen} from 'screens/SharedContactDetails';
import {StaffReportTaskScreen} from 'screens/StaffReportTasks';
import {TaskDetailScreen} from 'screens/TaskDetail';
import {TaskDetailsScreen} from 'screens/TaskDetails';
import {TaskHistoryScreen} from 'screens/TaskHistory';
import {VendorDetailsScreen} from 'screens/VendorDetails';
import {VendorsTaskScreen} from 'screens/VendorsTask';
import {ViewBusinessCardScreen} from 'screens/ViewBusinessCard';
import {ViewContactScreen} from 'screens/ViewContact';
import {ViewDocumentScreen} from 'screens/ViewDocument';
import {ViewFileScreen} from 'screens/ViewFile';
import {ViewGroupScreen} from 'screens/ViewGroup';
import {ViewPDFScreen} from 'screens/ViewPDF';
import {DrawerNavigation} from './DrawerNavigation';
// import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import {CompanyListResponseProps} from 'request/CompanyList';
// import {CompanyProps} from 'components/SelectCompany/CompanyListView';
import GooglePlaces, {locationModal} from 'components/GooglePlaces';
import {GooglePlaceData} from 'react-native-google-places-autocomplete';
import {Asset} from 'react-native-image-picker';
import {dataModal, managerListNode} from 'request/AddManager/constant';
import {ViewCompanyDataModal} from 'request/EditOffice';
import {OfficeLocationModal} from 'request/Profile';
import {AddEmployee} from 'screens/AddEmployee';
import AddPersonalAssistant from 'screens/AddPersonalAssistant';
import {AddVendorScreen} from 'screens/AddVendor';
import {EmployeeContactScreen} from 'screens/EmployeeContacts';
import {ManagerContactsScreen} from 'screens/ManagerContacts';
import {RejectedTaskScreen} from 'screens/RejectedTask';
import ViewCompany from 'screens/ViewCompany';
// import {PAListNode} from 'request/PersonalAssistant/types';
import {AddGeneralManagerScreen} from 'screens/AddGeneralManager';
import {GeneralManagerContactsScreen} from 'screens/GeneralManagerContacts';
import {GeneralManagerContactsDetailsScreen} from 'screens/ContactDetails/GeneralManagerContactDetails';
import FilteredContactList from 'screens/ContactRepository/components/FilterOptions';
import {StaffSubmenuModal} from 'store/Reducer';
import {FilterModal} from 'screens/Contacts';
import FilterPrivateList from 'screens/ContactRepository/components/FilterPrivateList';
import {AssignedByPATaskScreen} from 'screens/AssignedByPA';
import {Data, RootObject} from 'request/DocumentRepository';
import {InviteeUserData, selectMember} from 'request/Calendar';
import {CalendarScreen} from 'screens/Calendar';
import {chatInviteeModal} from 'request/Message';
import {chatModal, messageModal} from 'request/Message/constants';
import {emailDetailDataModal} from 'request/Inbox/constants';
import {EventDetailData} from 'request/Calendar/constant';
import FilterSharedList from 'screens/ContactRepository/components/FilterSharedList';
import {
  attendanceListData,
  attendanceRequestData,
} from 'request/AttendanceReport/types';
import {ReportedByPaTaskScreen} from 'screens/ReportedByPa';
import {AssignedToMeTaskScreen} from 'screens/AssignedToMeTask';
import {ReportedByMeTaskScreen} from 'screens/ReportedByMe';
import LeaveRequest from 'screens/LeaveRequest';
import {workloadListNodes} from 'request/WorkloadReport/types';
import {ShowParticipants} from 'screens/ShowParticipants';
import {masterCollectionType} from 'screens/Manage/components/BottomPanelModal';
// import {BottomTabNavigation} from './MainTabNavigation';

export type SignedInStackParamList = {
  // BottomTabs: undefined;
  Events: undefined;
  EventDetails?: {eventData?: EventInterface; eventId?: string};
  InprogressTask: undefined;
  VendorSupplier: undefined;
  VendorDetails: {data: managerListNode};
  VendorTask: undefined;
  DrawerNavigation: undefined;
  TaskReport: undefined;
  FilterTaskReport: undefined;
  DetailTaskReport: undefined;
  Notification: undefined;
  NotificationContactRequest: undefined;
  SelectCompany?: {
    selectedCompanyItem?: CompanyListResponseProps[] | undefined;
    companyList?: CompanyListResponseProps[] | undefined;
    allSelect?: boolean;
    onGoBack?: () => void;
  };
  CreateEvent?: {edit?: boolean; eventId?: string; eventData?: EventDetailData};
  SelectMember: undefined;
  InviteMember?: {
    edit?: boolean;
    disabled?: boolean;
    isShare?: boolean;
    documentId?: string | string[];
    isContact?: boolean;
    isShareVoice?: boolean;
  };
  TaskDetail?: {hideButton?: boolean};
  MessagesSearch: undefined;
  CreateGroup: undefined;
  AddGroupName: {
    selectedMemberList?: chatInviteeModal[];
    isFromTask?: boolean;
    taskId?: string;
  };
  ChattingScreen?: {
    type?: string;
    isCreateScreen?: boolean;
    data?: chatInviteeModal | chatModal;
    isShortKey?: boolean;
  };
  ViewGroup?: {
    data?: MessagesProps | chatInviteeModal | chatModal | undefined;
    isAdmin?: boolean;
  };
  AddMember: {groupId: string};
  ViewContact?: {
    data?: MessagesProps | MessageContactProps | chatInviteeModal;
    isFromGroup?: boolean;
    isCreateScreen?: boolean;
  };
  EditGroupSubject: {groupId?: string; groupName?: string};
  EditGroupIcon?: {
    profile?: boolean;
    image?: string;
    groupName?: string;
    groupId?: string;
  };
  AllContacts: undefined;
  StaffReport: undefined;
  PerformanceReport: undefined;
  FilterPerformanceReport: undefined;
  DetailPerformanceReport: undefined;
  WorkloadReport: undefined;
  FilterWorkloadReport: undefined;
  Contacts: undefined;
  ContactScreen: undefined;
  EditBusinessCard: {ocrData?: Asset; edit?: boolean};
  PublicContactRepository?: {isSynced?: boolean; isShareNotification?: boolean};
  SharedContactDetails?: {contactId?: string};
  DocumentRepository?: {_id?: string; isShareWithMe?: boolean};
  // DocumentRepository: undefined;
  AssignTask: undefined;
  ViewFile: {id?: string; isShared?: boolean};
  AddOwner?: {edit?: boolean; managerDetailData?: dataModal};
  AddEmployee?: {edit?: boolean; managerDetailData?: dataModal};
  AddCompany?: {
    edit?: boolean;
    companyData?: ViewCompanyDataModal;
    callFetchProfileApi?: () => void;
    callFetchCompanyApi?: () => void;
  };
  ViewCompany?: {
    isUserAuthorizedToEdit?: boolean;
    companyData?: OfficeLocationModal;
    callFetchProfileApi?: () => void;
  };
  AddManager?: {edit?: boolean; managerDetailData?: dataModal};
  AddTask?: {
    subTask?: boolean;
    docData?: RootObject;
    mailData?: emailDetailDataModal;
    messageData?: messageModal;
    channelId?: string;
    chatType?: string;
  };
  AddSubTask: undefined;
  TaskDetails?: {
    taskId: TaskInterface;
    vendors?: boolean;
    pending?: boolean;
    hideButtons?: boolean;
    reallocation?: boolean;
    related?: boolean;
    fromNotifee?: boolean;
  };
  RelatedTask?: {
    taskIds?: string[];
    isMail?: boolean;
    isChat?: boolean;
    chatType?: string;
  };
  MailMessage: {
    mailId: string;
    searchText?: string;
    setSearchTextVal?: (val: string) => void;
  };
  LinkedTask: {taskProps: TaskDetails | undefined};
  AccountScreen: undefined;
  ShareContact: undefined;
  ManageTask: undefined;
  SearchManageTask: {companyId?: CompanyListResponseProps[]};
  FilterTask: undefined;
  PendingTask: undefined;
  ContactDetails: undefined;
  ManagerContactDetails: {
    data: managerListNode;
    userType: string;
  };
  ManagerContact: undefined;
  ReallocationTask: undefined;
  SelfAssignedTask: undefined;
  StaffReportTask?: {
    userInfo?: workloadListNodes;
    type?: string | undefined;
    onGoBack?: (value?: masterCollectionType) => void;
    selectedStaff?: masterCollectionType;
  };
  PinnedTask: undefined;
  CustomRecurrence?: {data?: any};
  Reminder?: {
    voiceNotes?: boolean;
    taskData?: TaskDetails;
    voiceNoteData?: string;
  };
  CreateDocument?: {
    attachment?: boolean;
    asset?: Asset;
    DocData?: Data;
    edit?: boolean;
  };
  AccessLogs?: {
    isShareWithMe?: boolean;
    isContact?: boolean;
    documentId?: string;
    voiceNoteId?: string;
  };
  FilteredContactRepository: undefined;
  BusinessCard: undefined;
  ViewBusinessCard: undefined;
  ContactLogs: undefined;
  CreateContact?: {edit?: boolean; item?: ContactFormModel};
  ShareContactWith: undefined;
  MarkAttendance: undefined;
  RateManager: undefined;
  PointsEarned: {data: managerListNode};
  AttendanceReport: {
    data: attendanceListData;
    requestData: attendanceRequestData;
  };
  AttendanceReportConfiguration: undefined;
  ShareContactVoiceNotes: undefined;
  CalendarView: {data: membersProps};
  Calender?: {user?: selectMember};
  ViewPDF: {data: string};
  TaskHistory: {taskProps: TaskDetails | undefined};
  Renewals: {_id?: string};
  CreateRenewals: undefined;
  ViewDocument: {id?: string};
  EditRenewals: {id?: string};
  GooglePlaces: {
    onSelect: (
      value: GooglePlaceData | undefined,
      location: locationModal,
      currentLocation: string | undefined,
      pinCode?: string,
      isWorkAddressClick?: boolean,
    ) => void;
    isWorkAddressClick?: boolean;
  };
  RejectedTask: undefined;
  EmployeeContactScreen: undefined;
  AddPersonalAssistant?: {edit?: boolean; paDetailData?: dataModal};
  // PAContactDetails: {data: PAListNode};
  AddVendor?: {edit?: boolean; vendorDetailData?: dataModal};
  AddGeneralManager?: {edit?: boolean; managerDetailData?: dataModal};
  GeneralManagerContacts: undefined;
  GeneralManagerContactsDetailsScreen: {
    data: managerListNode;
    userType: string;
  };
  FilteredContactList: {
    companyId: string[];
    role: string;
    staffMenuList: StaffSubmenuModal[];
    type?: string;
  };
  FilterPrivateList: {item: FilterModal};
  FilterSharedList: {item: FilterModal};
  AddEmail: undefined;
  AccountType: {email?: String};
  AddEmailPassword: {email?: String};
  ServerSettings: {email?: String};
  AssignedByPATask: undefined;
  reportedByPa: undefined;
  AssignedToMeTask: undefined;
  ReportedByMeTask: undefined;
  LeaveRequest: undefined;
  ShowParticipants: {selectedInviteeObj?: InviteeUserData[]};
};

const Stack = createNativeStackNavigator<SignedInStackParamList>();
export const SignedInStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DrawerNavigation" component={DrawerNavigation} />
      <Stack.Screen name="PendingTask" component={PendingTaskScreen} />
      {/* <Stack.Screen name="FilterTask" component={FilterTaskScreen} /> */}
      {/* <Stack.Screen
        name="DocumentRepository"
        component={DocumentRepositoryScreen}
      /> */}
      <Stack.Screen name="AssignTask" component={AssignTaskSubtaskScreen} />
      <Stack.Screen name="ViewFile" component={ViewFileScreen} />
      {/* <Stack.Screen name="StaffReport" component={StaffReportScreen} />
      <Stack.Screen name="WorkloadReport" component={WorkloadReportScreen} /> */}
      {/* <Stack.Screen
        name="FilterWorkloadReport"
        component={FilterWorkloadReportScreen}
      /> */}
      {/* <Stack.Screen
        name="PerformanceReport"
        component={PerformanceReportScreen}
      /> */}
      {/* <Stack.Screen
        name="FilterPerformanceReport"
        component={FilterPerformanceReportScreen}
      /> */}
      <Stack.Screen
        name="DetailPerformanceReport"
        component={DetailReportScreen}
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
      {/* <Stack.Screen name="VendorSupplier" component={VendorsSuppliersScreen} /> */}
      <Stack.Screen name="VendorDetails" component={VendorDetailsScreen} />
      <Stack.Screen name="VendorTask" component={VendorsTaskScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="ShareContact" component={ShareContactScreen} />
      <Stack.Screen name="Notification" component={Notifications} />
      <Stack.Screen name="ContactScreen" component={SelectContactScreen} />
      <Stack.Screen
        name="NotificationContactRequest"
        component={NotificationContactRequest}
      />
      {/* <Stack.Screen name="TaskReport" component={TaskReportScreen} /> */}
      {/* <Stack.Screen
        name="FilterTaskReport"
        component={FilterTaskReportScreen}
      /> */}
      <Stack.Screen name="DetailTaskReport" component={TaskDetailScreen} />
      <Stack.Screen name="SelectCompany" component={SelectCompanyScreen} />
      <Stack.Screen name="CreateEvent" component={CreateEventScreen} />
      <Stack.Screen name="SelectMember" component={SelectResourceMember} />
      <Stack.Screen name="InviteMember" component={InviteMembers} />
      <Stack.Screen name="TaskDetail" component={TaskDetailsScreen} />
      <Stack.Screen name="MessagesSearch" component={MessagesSearchScreen} />
      <Stack.Screen name="AllContacts" component={AllContactScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="AddGroupName" component={AddGroupNameScreen} />
      <Stack.Screen name="ChattingScreen" component={ChattingScreen} />
      <Stack.Screen name="ViewGroup" component={ViewGroupScreen} />
      <Stack.Screen name="AddMember" component={AddMemberScreen} />
      <Stack.Screen name="ViewContact" component={ViewContactScreen} />
      <Stack.Screen name="EditGroupIcon" component={EditGroupIconScreen} />
      <Stack.Screen
        name="EditGroupSubject"
        component={EditGroupSubjectScreen}
      />
      <Stack.Screen name="MailMessage" component={MailMessageScreen} />
      <Stack.Screen name="AddOwner" component={AddOwnerScreen} />
      <Stack.Screen name="AddEmployee" component={AddEmployee} />
      <Stack.Screen name="AddCompany" component={AddCompanyScreen} />
      <Stack.Screen name="ViewCompany" component={ViewCompany} />
      <Stack.Screen name="AddManager" component={AddManagerScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="AddSubTask" component={AddSubtaskScreen} />
      <Stack.Screen name="InprogressTask" component={InprogressTaskScreen} />
      <Stack.Screen name="Events" component={EventsScreen} />
      <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
      <Stack.Screen name="TaskDetails" component={TaskDetailScreen} />
      <Stack.Screen name="RelatedTask" component={RelatedTaskScreen} />
      <Stack.Screen name="LinkedTask" component={LinkedTaskScreen} />
      <Stack.Screen
        name="SearchManageTask"
        component={SearchManageTaskScreen}
      />
      <Stack.Screen name="ContactDetails" component={ContactsDetailsScreen} />
      <Stack.Screen
        name="ManagerContactDetails"
        component={ManagerContactsDetailsScreen}
      />
      <Stack.Screen name="ManagerContact" component={ManagerContactsScreen} />

      <Stack.Screen
        name="ReallocationTask"
        component={ReallocationTaskScreen}
      />
      <Stack.Screen
        name="SelfAssignedTask"
        component={SelfAssignedTaskScreen}
      />
      <Stack.Screen name="RejectedTask" component={RejectedTaskScreen} />
      <Stack.Screen name="StaffReportTask" component={StaffReportTaskScreen} />
      <Stack.Screen name="PinnedTask" component={PinnedTaskScreen} />
      <Stack.Screen
        name="CustomRecurrence"
        component={CustomRecurrenceScreen}
      />
      <Stack.Screen name="Reminder" component={ReminderScreen} />
      <Stack.Screen name="CreateDocument" component={CreateDocumentScreen} />
      <Stack.Screen name="AccessLogs" component={AccessLogsScreen} />
      <Stack.Screen
        name="FilteredContactRepository"
        component={FilteredContactRepositoryScreen}
      />
      <Stack.Screen name="BusinessCard" component={BusinessCardScreen} />
      <Stack.Screen
        name="ViewBusinessCard"
        component={ViewBusinessCardScreen}
      />
      <Stack.Screen name="ContactLogs" component={ContactLogsScreen} />
      <Stack.Screen name="CreateContact" component={CreateContactScreen} />
      <Stack.Screen
        name="ShareContactWith"
        component={ShareContactWithScreen}
      />
      <Stack.Screen name="MarkAttendance" component={MarkAttendanceScreen} />
      <Stack.Screen name="RateManager" component={RateManagerScreen} />
      <Stack.Screen name="PointsEarned" component={PointsEarnedScreen} />
      <Stack.Screen
        name="AttendanceReport"
        component={AttendanceReportScreen}
      />
      <Stack.Screen
        name="AttendanceReportConfiguration"
        component={AttendanceReportConfigurationScreen}
      />
      <Stack.Screen
        name="ShareContactVoiceNotes"
        component={ShareContactVoiceNotesScreen}
      />
      <Stack.Screen name="CalendarView" component={CalendarViewScreen} />
      <Stack.Screen name="Calender" component={CalendarScreen} />
      <Stack.Screen name="ViewPDF" component={ViewPDFScreen} />
      <Stack.Screen name="TaskHistory" component={TaskHistoryScreen} />
      <Stack.Screen name="CreateRenewals" component={CreateRenewalsScreen} />
      <Stack.Screen name="ViewDocument" component={ViewDocumentScreen} />
      <Stack.Screen name="EditRenewals" component={EditRenewalsScreen} />
      <Stack.Screen name="GooglePlaces" component={GooglePlaces} />
      <Stack.Screen
        name="EmployeeContactScreen"
        component={EmployeeContactScreen}
      />
      <Stack.Screen
        name="AddPersonalAssistant"
        component={AddPersonalAssistant}
      />
      {/* <Stack.Screen name="PAContactDetails" component={PAContactDetails} /> */}
      <Stack.Screen name="AddVendor" component={AddVendorScreen} />
      <Stack.Screen
        name="AddGeneralManager"
        component={AddGeneralManagerScreen}
      />
      <Stack.Screen
        name="GeneralManagerContacts"
        component={GeneralManagerContactsScreen}
      />
      <Stack.Screen
        name="GeneralManagerContactsDetailsScreen"
        component={GeneralManagerContactsDetailsScreen}
      />
      <Stack.Screen
        name="FilteredContactList"
        component={FilteredContactList}
      />
      <Stack.Screen name="FilterPrivateList" component={FilterPrivateList} />
      <Stack.Screen
        name="AssignedByPATask"
        component={AssignedByPATaskScreen}
      />
      <Stack.Screen name="FilterSharedList" component={FilterSharedList} />
      <Stack.Screen name="reportedByPa" component={ReportedByPaTaskScreen} />
      <Stack.Screen
        name="AssignedToMeTask"
        component={AssignedToMeTaskScreen}
      />
      <Stack.Screen
        name="ReportedByMeTask"
        component={ReportedByMeTaskScreen}
      />
      <Stack.Screen name="LeaveRequest" component={LeaveRequest} />
      <Stack.Screen name="ShowParticipants" component={ShowParticipants} />
    </Stack.Navigator>
  );
};
