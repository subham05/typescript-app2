import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {messageModal} from 'request/Message/constants';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';
import {useAppSelector} from 'store/hooks';

interface SenderPersonaProps {
  currentMessage: messageModal;
}
export const SenderPersona: React.FC<SenderPersonaProps> = ({
  currentMessage,
}) => {
  const {userData} = useAppSelector(state => state.formanagement);
  const isNotDocxFile =
    currentMessage?.attachmentUrl !== '' &&
    currentMessage?.attachmentUrlDetails?.url?.substring(
      currentMessage?.attachmentUrlDetails?.url?.lastIndexOf('.') + 1,
    ) !== 'docx';
  const isImage =
    currentMessage?.attachmentUrlDetails?.url?.substring(
      currentMessage?.attachmentUrlDetails?.url?.lastIndexOf('.') + 1,
    ) !== 'png' ||
    'jpg' ||
    'jpeg';
  const styles = Styles();
  return (
    <Stack
      style={[
        styles.senderPersona,
        !isImage && isNotDocxFile ? styles.personaMargin : undefined,
      ]}>
      <Persona name={userData?.name} image={userData?.profileUrl} size={32} />
    </Stack>
  );
};
