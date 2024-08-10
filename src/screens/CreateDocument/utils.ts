import Translate from 'translation/utils/translateFunction';
import * as yup from 'yup';

export const AddDocumentSchema = () => {
  const schema = yup.object().shape({
    title: yup.string().trim().required(Translate('document:titleError')),
    description: yup
      .string()
      .trim()
      .required(Translate('document:descriptionError')),
  });
  return schema;
};
