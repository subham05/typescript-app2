type State = {
  isLoading: boolean;
  isSignOut: boolean;
  userToken: string | null | undefined;
  userType?: string | null | undefined;
  isAuthenticated?: string | boolean | null;
};

export const initialState: State = {
  isLoading: true,
  isSignOut: false,
  userToken: null,
  userType: null,
  isAuthenticated: false,
};

export enum authActions {
  RESTORE_TOKEN = 'RESTORE_TOKEN',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  IS_AUTHENTICATED = 'IS_AUTHENTICATED',
}

type Action = {
  type: authActions;
  payload: string | null | undefined;
  userType: string | null | undefined;
  isAuthenticated?: boolean | undefined | null;
};

export const authStackReducer = (prevState: State, action: Action): State => {
  const {type, payload, userType, isAuthenticated} = action;

  switch (type) {
    case authActions.RESTORE_TOKEN:
      return {
        ...prevState,
        userToken: payload,
        isLoading: false,
        userType: userType,
      };
    case authActions.SIGN_IN:
      return {
        ...prevState,
        isSignOut: false,
        userToken: payload,
        userType: userType,
      };
    case authActions.SIGN_OUT:
      return {
        ...prevState,
        isSignOut: true,
        userToken: null,
        userType: userType,
      };
    case authActions.IS_AUTHENTICATED:
      return {
        ...prevState,
        isAuthenticated: isAuthenticated,
        userToken: payload,
        userType: userType,
      };
    default:
      return prevState;
  }
};
