import {userTypes} from 'common/users/userTypes';
import {t} from 'i18next';

export const getFilterName = (user: string) => {
  switch (user) {
    case userTypes.Self.toUpperCase():
      return t('attendance:self');
    case userTypes.Owner.toUpperCase():
      return t('attendance:owner');
    case userTypes.persoalAssistant.toUpperCase():
      return t('attendance:pa');
    case userTypes.GeneralManager.toUpperCase():
      return t('attendance:generalManager');
    case userTypes.Manager.toUpperCase():
      return t('attendance:manager');
    case userTypes.Employee.toUpperCase():
      return t('attendance:employee');
    case userTypes.Vendor.toUpperCase():
      return t('attendance:vendor');
    default:
      return '';
  }
};
