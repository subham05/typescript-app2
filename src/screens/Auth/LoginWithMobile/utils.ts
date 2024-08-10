import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

// const passwordRegexValidator =
//   /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{10,}$/;

// const emailReg =
//   /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const phoneReg = /^\d{10}$/g;
const phoneReg = /^[0-9]{6,12}$/;

export const SignInWithMobileSchema = () => {
  const schema = yup.object().shape({
    mobile: yup
      .string()
      .matches(phoneReg, Translate('login:mobileError2'))
      .required(Translate('login:mobileError1')),
  });

  return schema;
};
