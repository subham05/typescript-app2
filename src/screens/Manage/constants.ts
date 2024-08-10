import {t} from 'i18next';

export const getMenus = (props: any) => {
  return [
    {
      name: t('manageTask:selfAssigned'),
      onClick: () => {
        props.navigation.navigate('SelfAssignedTask');
      },
    },
    {
      name: t('manageTask:assignedToMe'),
      onClick: () => {
        props.navigation.navigate('AssignedToMeTask');
      },
    },
    {
      name: t('manageTask:reportedByMe'),
      onClick: () => {
        props.navigation.navigate('ReportedByMeTask');
      },
    },
    {
      name: t('manageTask:pinned'),
      onClick: () => {
        props.navigation.navigate('PinnedTask');
      },
    },
    {
      name: t('manageTask:pendingApprovals'),
      onClick: () => {
        props.navigation.navigate('PendingTask');
      },
    },
    {
      name: t('manageTask:rejectedTask'),
      onClick: () => {
        props.navigation.navigate('RejectedTask');
      },
    },
    {
      name: t('manageTask:relatedTask'),
      onClick: () => {
        props.navigation.navigate('RelatedTask');
      },
    },
  ];
};
export const getMenuGM = (props: any) => {
  return [
    {
      name: t('manageTask:selfAssigned'),
      onClick: () => {
        props.navigation.navigate('SelfAssignedTask');
      },
    },
    {
      name: t('manageTask:assignedToMe'),
      onClick: () => {
        props.navigation.navigate('AssignedToMeTask');
      },
    },
    {
      name: t('manageTask:reportedByMe'),
      onClick: () => {
        props.navigation.navigate('ReportedByMeTask');
      },
    },
    {
      name: t('manageTask:reportedByPa'),
      onClick: () => {
        props.navigation.navigate('reportedByPa');
      },
    },
    {
      name: t('manageTask:pinned'),
      onClick: () => {
        props.navigation.navigate('PinnedTask');
      },
    },
    {
      name: t('manageTask:pendingApprovals'),
      onClick: () => {
        props.navigation.navigate('PendingTask');
      },
    },
    {
      name: t('manageTask:rejectedTask'),
      onClick: () => {
        props.navigation.navigate('RejectedTask');
      },
    },
    {
      name: t('manageTask:relatedTask'),
      onClick: () => {
        props.navigation.navigate('RelatedTask');
      },
    },
    {
      name: t('manageTask:reallocationRequest'),
      onClick: () => {
        props.navigation.navigate('ReallocationTask');
      },
    },
  ];
};
export const getMenuDataOwner = (props: any) => {
  return [
    {
      name: t('manageTask:selfAssigned'),
      onClick: () => {
        props.navigation.navigate('SelfAssignedTask');
      },
    },
    {
      name: t('manageTask:assignedToMe'),
      onClick: () => {
        props.navigation.navigate('AssignedToMeTask');
      },
    },
    {
      name: t('manageTask:reportedByMe'),
      onClick: () => {
        props.navigation.navigate('ReportedByMeTask');
      },
    },
    {
      name: t('manageTask:reportedByPa'),
      onClick: () => {
        props.navigation.navigate('reportedByPa');
      },
    },
    {
      name: t('manageTask:assignByPA'),
      onClick: () => {
        props.navigation.navigate('AssignedByPATask');
      },
    },
    {
      name: t('manageTask:pinned'),
      onClick: () => {
        props.navigation.navigate('PinnedTask');
      },
    },
    {
      name: t('manageTask:pendingApprovals'),
      onClick: () => {
        props.navigation.navigate('PendingTask');
      },
    },
    {
      name: t('manageTask:rejectedTask'),
      onClick: () => {
        props.navigation.navigate('RejectedTask');
      },
    },
    {
      name: t('manageTask:relatedTask'),
      onClick: () => {
        props.navigation.navigate('RelatedTask');
      },
    },
    {
      name: t('manageTask:reallocationRequest'),
      onClick: () => {
        props.navigation.navigate('ReallocationTask');
      },
    },
  ];
};
