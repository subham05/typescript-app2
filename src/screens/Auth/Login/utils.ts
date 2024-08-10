import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

const passwordRegexValidator =
  /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// const passwordEmojiValidator =
//   /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]+$/gu;

const passwordEmojiValidator =
  /^[^\u{203C}\u{2049}\u{20E3}\u{2122}\u{2139}\u{2194}-\u{2199}\u{21A9}-\u{21AA}\u{231A}-\u{231B}\u{23E9}-\u{23EC}\u{23F0}\u{23F3}\u{24C2}\u{25AA}-\u{25AB}\u{25B6}\u{25C0}\u{25FB}-\u{25FE}\u{2600}-\u{2601}\u{260E}\u{2611}\u{2614}-\u{2615}\u{261D}\u{263A}\u{2648}-\u{2653}\u{2660}\u{2663}\u{2665}-\u{2666}\u{2668}\u{267B}\u{267F}\u{2693}\u{26A0}-\u{26A1}\u{26AA}-\u{26AB}\u{26BD}-\u{26BE}\u{26C4}-\u{26C5}\u{26CE}\u{26D4}\u{26EA}\u{26F2}-\u{26F3}\u{26F5}\u{26FA}\u{26FD}\u{2702}\u{2705}\u{2708}-\u{270C}\u{270F}\u{2712}\u{2714}\u{2716}\u{2728}\u{2733}-\u{2734}\u{2744}\u{2747}\u{274C}\u{274E}\u{2753}-\u{2755}\u{2757}\u{2764}\u{2795}-\u{2797}\u{27A1}\u{27B0}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{2B1B}-\u{2B1C}\u{2B50}\u{2B55}\u{3030}\u{303D}\u{3297}\u{3299}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F171}\u{1F17E}-\u{1F17F}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E7}-\u{1F1EC}\u{1F1EE}-\u{1F1F0}\u{1F1F3}\u{1F1F5}\u{1F1F7}-\u{1F1FA}\u{1F201}-\u{1F202}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F23A}\u{1F250}-\u{1F251}\u{1F300}-\u{1F320}\u{1F330}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F380}-\u{1F393}\u{1F3A0}-\u{1F3C4}\u{1F3C6}-\u{1F3CA}\u{1F3E0}-\u{1F3F0}\u{1F400}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4F7}\u{1F4F9}-\u{1F4FC}\u{1F500}-\u{1F507}\u{1F509}-\u{1F53D}\u{1F550}-\u{1F567}\u{1F5FB}-\u{1F640}\u{1F645}-\u{1F64F}\u{1F680}-\u{1F68A}]*$/gu;

const emailReg =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// const phoneReg =
//   /^(\+{0,})(\d{0,})([(]{1}\d{1,3}[)]{0,}){0,}(\s?\d+|\+\d{2,3}\s{1}\d+|\d+){1}[\s|-]?\d+([\s|-]?\d+){1,2}(\s){0,}$/gm;

export const SignInSchema = () => {
  const schema = yup.object().shape({
    email: yup
      .string()
      .matches(emailReg, Translate('login:emailError1'))
      .required(Translate('login:emailError')),
    password: yup
      .string()
      .matches(passwordRegexValidator, Translate('login:passwordError1'))
      .matches(passwordEmojiValidator, Translate('login:passwordError1'))
      .required(Translate('login:passwordError')),
  });

  return schema;
};
