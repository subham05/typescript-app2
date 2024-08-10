import AsyncStorage from '@react-native-async-storage/async-storage';
import {imageSources} from 'assets/images';
import {STR_KEYS} from 'common/storage';
import {userTypes} from 'common/users/userTypes';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Image} from 'react-native';
import {Stack} from 'stack-container';
import {StaffSubmenuModal} from 'store/Reducer';
import {MenuItem} from '../MenuItem';
import {Styles} from './index.styles';

const CustomDrawerFirstList = (props: any) => {
  const {t} = useTranslation();
  const [expandedReport, setExpandedReport] = useState<boolean>(false);
  const [expandedStaff, setExpandedStaff] = useState<boolean>(false);
  const [expandedLogs, setExpandedLogs] = useState<boolean>(false);
  const [expandedStructure, setExpandedStructure] = useState<boolean>(false);
  const [isContactSynced, setIsContactSynced] = useState<string | null>(
    'false',
  );
  const [staffMenuList, setStaffMenuList] = useState<StaffSubmenuModal[] | []>(
    [],
  );
  const [taskReportList, setTaskReportList] = useState<
    StaffSubmenuModal[] | []
  >([]);
  const [activityLogsList, setActivityLogsList] = useState<
    StaffSubmenuModal[] | []
  >([]);
  const [isContactRepo, setIsContactRepo] = useState<boolean>(false);
  const [isRenewal, setIsRenewal] = useState<boolean>(false);
  const [isDocRepo, setIsDocRepo] = useState<boolean>(false);
  const [isVendor, setIsVendor] = useState<boolean>(false);
  const [userType, setUserType] = useState<string | null | undefined>('');

  AsyncStorage.getItem(STR_KEYS.CONTACTS_SYNCED).then(res => {
    setIsContactSynced(res);
  });
  AsyncStorage.getItem(STR_KEYS.USERTYPE).then(res => {
    setUserType(res);
  });
  useEffect(() => {
    getStaffOptions();
  }, []);
  const getStaffOptions = async () => {
    let loginData = await AsyncStorage.getItem(STR_KEYS.LOGINUSERDATA);
    loginData = JSON.parse(loginData!);
    const staffListTemp = loginData?.staff;
    const taskReportTemp = loginData?.report;
    const activityLogsTemp = loginData?.activityLogs;
    setStaffMenuList(staffListTemp);
    setTaskReportList(taskReportTemp);
    setActivityLogsList(activityLogsTemp);
    setIsContactRepo(loginData?.contactRepository);
    setIsDocRepo(loginData?.documentRepository);
    setIsRenewal(loginData?.renewals);
    setIsVendor(loginData?.vendorSuppilers);
  };
  const getReportList = (users: string) => {
    switch (users) {
      case 'task report':
        return (
          <MenuItem
            icon="task_report"
            title={t('drawer:taskReport')}
            subMenu
            onPress={() => {
              props.navigation.navigate('TaskReport');
            }}
          />
        );
      case 'performance report':
        return (
          <Stack horizontal>
            <Image
              source={imageSources.performanceReport}
              style={styles.image}
            />
            <MenuItem
              title={t('drawer:performanceReport')}
              subMenu
              onPress={() => {
                props.navigation.navigate('PerformanceReport');
              }}
            />
          </Stack>
        );
      case 'workload report':
        return (
          <MenuItem
            icon="workload_report"
            title={t('drawer:workloadReport')}
            subMenu
            onPress={() => {
              props.navigation.navigate('WorkloadReport');
            }}
          />
        );
      case 'staff report':
        return (
          <MenuItem
            icon="staff_report"
            title="Staff report"
            subMenu
            onPress={() => {
              props.navigation.navigate('StaffReport');
            }}
          />
        );
      case 'attendance report':
        return (
          <MenuItem
            icon="attendance_report"
            title={t('drawer:attendanceReport')}
            subMenu
            onPress={() => {
              props.navigation.navigate('AttendanceSummery');
            }}
          />
        );
    }
  };
  const getStaffList = (users: string, isStaff: boolean) => {
    switch (users) {
      case userTypes.Owner.toUpperCase():
        return (
          <MenuItem
            icon="owner"
            title={t('drawer:owner')}
            subMenu
            onPress={() => {
              isStaff
                ? props.navigation.navigate('OwnerContact')
                : props.navigation.navigate('ActivityLogs', {
                    type: t('staffReport:owner'),
                  });
            }}
          />
        );
      case userTypes.Manager.toUpperCase():
        return (
          <MenuItem
            icon="manager"
            title={t('drawer:manager')}
            subMenu
            onPress={() => {
              isStaff
                ? props.navigation.navigate('ManagerContact')
                : props.navigation.navigate('ActivityLogs', {
                    type: t('staffReport:manager'),
                  });
            }}
          />
        );
      case userTypes.Employee.toUpperCase():
        return (
          <MenuItem
            icon="owner"
            title={t('drawer:employee')}
            subMenu
            onPress={() => {
              isStaff
                ? props.navigation.navigate('EmployeeContactScreen')
                : props.navigation.navigate('ActivityLogs', {
                    type: t('staffReport:employees'),
                  });
            }}
          />
        );
      case userTypes.persoalAssistant.toUpperCase():
        return (
          <MenuItem
            icon="owner"
            title={t('drawer:personalAssistant')}
            subMenu
            onPress={() => {
              isStaff
                ? props.navigation.navigate('PersonalAssistantContact')
                : props.navigation.navigate('ActivityLogs', {
                    type: t('staffReport:personalAssistant'),
                  });
            }}
          />
        );
      case userTypes.GeneralManager.toUpperCase():
        return (
          <MenuItem
            icon="owner"
            title={t('drawer:generalManager')}
            subMenu
            onPress={() => {
              isStaff
                ? props.navigation.navigate('GeneralManagerContacts')
                : props.navigation.navigate('ActivityLogs', {
                    type: t('staffReport:generalManager'),
                  });
            }}
          />
        );
      case userTypes.Vendor.toUpperCase():
        return (
          <MenuItem
            icon="vendors"
            title={t('drawer:vendor')}
            subMenu
            onPress={() => {
              !isStaff &&
                props.navigation.navigate('ActivityLogs', {
                  type: t('staffReport:vendor'),
                });
            }}
          />
        );
    }
  };
  const styles = Styles();
  return (
    <Stack childrenGap={2}>
      <MenuItem
        icon="home"
        title={t('drawer:dashboard')}
        onPress={() => {
          props.navigation.navigate('BottomTabs');
        }}
      />
      {isContactRepo && (
        <MenuItem
          icon="contact_repository"
          title={t('drawer:contactRepository')}
          onPress={() => {
            isContactSynced
              ? props.navigation.navigate('PublicContactRepository')
              : props.navigation.navigate('ContactScreen');
          }}
        />
      )}
      {isDocRepo && (
        <MenuItem
          icon="document_repository"
          title={t('drawer:documentRepository')}
          onPress={() => {
            props.navigation.navigate('DocumentRepository');
          }}
        />
      )}
      {userType !== userTypes.Vendor && (
        <Stack>
          <MenuItem
            icon="report"
            reportIcon={expandedReport ? 'arrow_drop_up' : 'arrow_drop_down'}
            title={t('drawer:report')}
            onPress={() => {
              setExpandedReport(!expandedReport);
            }}
          />
          {expandedReport && (
            <Stack childrenGap={2} style={styles.expandedReport}>
              {taskReportList?.map((item: StaffSubmenuModal) =>
                getReportList(item.user.toLowerCase()),
              )}
            </Stack>
          )}
        </Stack>
      )}
      {isVendor && (
        <MenuItem
          icon="vendors"
          title={t('drawer:vendorsSuppliers')}
          onPress={() => {
            props.navigation.navigate('VendorSupplier');
          }}
        />
      )}
      {staffMenuList?.length > 0 && (
        <Stack>
          <MenuItem
            icon="manager"
            reportIcon={expandedStaff ? 'arrow_drop_up' : 'arrow_drop_down'}
            title={t('drawer:staff')}
            onPress={() => {
              setExpandedStaff(!expandedStaff);
            }}
            isStaff
          />
          {expandedStaff && (
            <Stack childrenGap={2} style={styles.expandedReport}>
              {/* {userType === userTypes.Owner ||
              userType === userTypes.GeneralManager ?  */}
              <>
                {staffMenuList?.map((item: StaffSubmenuModal) =>
                  getStaffList(item.user, true),
                )}
              </>
            </Stack>
          )}
        </Stack>
      )}
      {userType !== userTypes.Vendor && (
        <Stack>
          <MenuItem
            icon="activity_logs"
            reportIcon={expandedLogs ? 'arrow_drop_up' : 'arrow_drop_down'}
            title={t('drawer:activityLogs')}
            onPress={() => {
              setExpandedLogs(!expandedLogs);
            }}
            isLogs
          />
          {expandedLogs && (
            <Stack childrenGap={2} style={styles.expandedReport}>
              {activityLogsList?.map((item: StaffSubmenuModal) =>
                getStaffList(item.user, false),
              )}
            </Stack>
          )}
        </Stack>
      )}
      {isRenewal && (
        <MenuItem
          icon="renewals"
          title={t('drawer:renewals')}
          onPress={() => {
            props.navigation.navigate('Renewals');
          }}
        />
      )}
      <Stack>
        <MenuItem
          icon="organization"
          reportIcon={expandedStructure ? 'arrow_drop_up' : 'arrow_drop_down'}
          title={t('drawer:organizationStructure')}
          onPress={() => {
            setExpandedStructure(!expandedStructure);
          }}
          isStructure
        />
        {expandedStructure && (
          <Stack childrenGap={2} style={styles.expandedReport}>
            <>
              <MenuItem
                icon="company_structure"
                title={t('drawer:companyStructure')}
                subMenu
                onPress={() => {
                  props.navigation.navigate('CompanyStructure');
                }}
              />
              <MenuItem
                icon="reporting_structure"
                title={t('drawer:reportingStructure')}
                subMenu
                onPress={() => {
                  props.navigation.navigate('ReportingStructure');
                }}
              />
            </>
          </Stack>
        )}
      </Stack>
      <MenuItem
        icon="voice_note"
        title={t('drawer:voiceNote')}
        onPress={() => {
          props.navigation.navigate('VoiceNotes');
        }}
      />
    </Stack>
  );
};

export default CustomDrawerFirstList;
