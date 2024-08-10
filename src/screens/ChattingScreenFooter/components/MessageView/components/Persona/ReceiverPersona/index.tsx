import {Persona} from 'components/Persona';
import {Stack} from 'components/Stack';
import React from 'react';
import {messageModal} from 'request/Message/constants';
import {Styles} from 'screens/ChattingScreenFooter/index.styles';

interface ReceiverPersonaProps {
  currentMessage: messageModal;
  type: string | undefined;
}
export const ReceiverPersona: React.FC<ReceiverPersonaProps> = ({
  currentMessage,
}) => {
  const styles = Styles();
  return (
    // style={type === 'People' ? styles.receiverPersona : undefined} OLD STYLE
    <Stack style={styles.receiverPersona}>
      <Persona
        name={currentMessage?.senderName}
        image={currentMessage?.senderProfile}
        size={32}
      />
    </Stack>
  );
};
