import {DrawerScreenProps} from '@react-navigation/drawer';
import {CompositeScreenProps} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {searchPattern1, searchPattern2} from 'common/utils/Regex';
import {Container} from 'components';
import Header from 'components/Header';
import {MembersList} from 'components/Members/MembersList';
import {Stack} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {DrawerNavParamList} from 'navigation/Stacks/DrawerNavigation';
import {SignedInStackParamList} from 'navigation/Stacks/SignedInStack';
import React, {useEffect, useRef, useState} from 'react';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import {InviteeUserData} from 'request/Calendar';
import {useAppDispatch} from 'store/hooks';
import {setInviteeMembers, setSelectedInviteeObj} from 'store/Reducer';
import {Styles} from '../InviteMembers/index.styles';

type Props = CompositeScreenProps<
  NativeStackScreenProps<SignedInStackParamList, 'ShowParticipants'>,
  DrawerScreenProps<DrawerNavParamList>
>;

export const ShowParticipants = (props: Props) => {
  const {route} = {...props};
  const {selectedInviteeObj} = route.params!;
  const dispatch = useAppDispatch();
  const translateY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    translateY.value = event.contentOffset.y;
  });

  const [searchText, setSearchText] = useState('');

  const userId = useRef<string>('');

  useEffect(() => {
    if (selectedInviteeObj?.length) {
      setInviteeState(selectedInviteeObj);
    }
  }, [selectedInviteeObj]);

  const [inviteeState, setInviteeState] = useState<InviteeUserData[]>([]);

  const styles = Styles();
  return (
    <Container noSpacing>
      <Header
        navigationType="STACK"
        label={'Invited member'}
        translateY={translateY}
        isCloseNavigation
      />
      <Stack
        horizontal
        spacing={16}
        spaceBelow={16}
        style={styles.attachmentView}>
        <SearchTextField
          setSearchValue={val => {
            setSearchText(val.trim());
          }}
          pattern1={searchPattern1}
          pattern2={searchPattern2}
        />
      </Stack>
      <Stack spacing={16} spaceBelow={16} style={styles.flexStyle}>
        <MembersList
          onScrollHandler={scrollHandler}
          data={inviteeState?.filter(item => item?.name.includes(searchText))}
          showCheckBox={false}
          userId={userId.current}
          onInviteeSelect={id => {
            let updatedInvitee = [...inviteeState]?.filter(
              invitee => invitee?._id !== id,
            );
            setInviteeState(updatedInvitee);
            dispatch(setSelectedInviteeObj(updatedInvitee));
            dispatch(setInviteeMembers(updatedInvitee?.map(item => item?._id)));
          }}
          dataLength={inviteeState.length}
          showCrossIcon={true}
          selection={true}
        />
      </Stack>
    </Container>
  );
};
