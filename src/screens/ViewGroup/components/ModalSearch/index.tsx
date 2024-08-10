import {colors} from 'common/theme/colors';
import {RippleIconButton} from 'components/IconButtons';
import {SearchTextField} from 'components/TextField';
import {SearchMessageContactList} from 'components/Messages/SearchModal/MessageContactList';
import {Stack} from 'components/Stack';
import React from 'react';
import Modal from 'react-native-modal';
import {Easing, useSharedValue, withTiming} from 'react-native-reanimated';
import {Styles} from 'screens/ViewGroup/index.styles';
import {groupMembersRecord} from 'request/Message/constants';
import {MessageContactProps} from 'components/Messages/MessageContactItem';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';

interface ModalSearchProps {
  data: groupMembersRecord[];
  value: boolean;
  onPress: (val: boolean) => void;
  onEndReached?: () => void;
  isLoading: boolean;
  setSearchText: (val: string) => void;
  searchText: string;
  onMemberPress: (val: boolean, val1: MessageContactProps) => void;
}

export const ModalSearch: React.FC<ModalSearchProps> = ({
  data,
  value,
  onPress,
  onEndReached,
  isLoading,
  setSearchText,
  searchText,
  onMemberPress,
}) => {
  const animatedVal = useSharedValue(0);

  const styles = Styles();
  return (
    <Modal
      style={[styles.searchModalView]}
      isVisible={value}
      onBackdropPress={() => onPress(false)}>
      <>
        <Stack horizontal style={styles.attachmentView}>
          <RippleIconButton
            name="arrow_back"
            size={24}
            color={colors.black}
            style={styles.modalBack}
            onPress={() => {
              animatedVal.value = withTiming(0, {
                duration: 300,
                easing: Easing.in(Easing.exp),
              });
              //   setSearchModal(false);
              onPress(false);
            }}
          />
          <SearchTextField
            removeIcon
            onSearchChange={text => {
              setSearchText(text.trim());
            }}
            value={searchText}
            pattern1={searchPattern1}
            pattern2={searchPattern2}
          />
        </Stack>
        <SearchMessageContactList
          data={data}
          onEndReached={onEndReached}
          isLoading={isLoading}
          onMemberPress={val => {
            onMemberPress(true, val);
          }}
        />
      </>
    </Modal>
  );
};
