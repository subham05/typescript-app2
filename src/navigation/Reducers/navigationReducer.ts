type NavState = {
  isWalkthroughDone: boolean | null;
  isPermissionTaken: boolean | null;
  isCompanySelected: boolean | null;
  isDocumentTootipSeen: boolean | null;
  isContactTootipSeen: boolean | null;
  isRenewalsTootipSeen: boolean | null;
  isAuthenticated: boolean | undefined;
  isContactSynced: boolean | null;
  isMailLoggedIn?: boolean | null;
};

export const navInitialState: NavState = {
  isWalkthroughDone: null,
  isPermissionTaken: null,
  isCompanySelected: null,
  isDocumentTootipSeen: null,
  isContactTootipSeen: null,
  isRenewalsTootipSeen: null,
  isAuthenticated: false,
  isContactSynced: false,
  isMailLoggedIn: false,
};

export enum NavActions {
  SAVE_WALKTHROUGH = 'SAVE_WALKTHROUGH',
  SAVE_PERMISSION = 'SAVE_PERMISSION',
  SAVE_SELECT_COMPANY = 'SAVE_SELECT_COMPANY',
  SAVE_DOCUMENT_TOOLTIP_SEEN = 'SAVE_DOCUMENT_TOOLTIP_SEEN',
  SAVE_CONTACT_TOOLTIP_SEEN = 'SAVE_CONTACT_TOOLTIP_SEEN',
  SAVE_RENEWALS_TOOLTIP_SEEN = 'SAVE_RENEWALS_TOOLTIP_SEEN',
  IS_AUTHENTICATED = 'IS_AUTHENTICATED',
  SAVE_CONTACT_SYNCED = 'SAVE_CONTACT_SYNCED',
  SAVE_MAIL_LOGGEDIN = 'SAVE_MAIL_LOGGEDIN',
}

type NavActionType = {
  type: NavActions;
  payload: boolean | null | undefined;
};

export const navigationReducer = (
  prevState: NavState,
  action: NavActionType,
): NavState => {
  const {type, payload} = action;

  switch (type) {
    case NavActions.SAVE_PERMISSION:
      return {
        ...prevState,
        isPermissionTaken: payload!,
      };
    case NavActions.SAVE_WALKTHROUGH:
      return {
        ...prevState,
        isWalkthroughDone: payload!,
      };
    case NavActions.SAVE_SELECT_COMPANY:
      return {
        ...prevState,
        isCompanySelected: payload!,
      };
    case NavActions.SAVE_DOCUMENT_TOOLTIP_SEEN:
      return {
        ...prevState,
        isDocumentTootipSeen: payload!,
      };
    case NavActions.SAVE_CONTACT_TOOLTIP_SEEN:
      return {
        ...prevState,
        isContactTootipSeen: payload!,
      };
    case NavActions.SAVE_RENEWALS_TOOLTIP_SEEN:
      return {
        ...prevState,
        isRenewalsTootipSeen: payload!,
      };
    case NavActions.IS_AUTHENTICATED:
      return {
        ...prevState,
        isAuthenticated: payload!,
      };
    case NavActions.SAVE_CONTACT_SYNCED:
      return {
        ...prevState,
        isContactSynced: payload!,
      };
    case NavActions.SAVE_MAIL_LOGGEDIN:
      return {
        ...prevState,
        isMailLoggedIn: payload!,
      };
    default:
      return prevState;
  }
};
