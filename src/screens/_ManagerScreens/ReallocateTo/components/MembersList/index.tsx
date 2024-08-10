import {FooterComponent} from 'components/FooterComponent';
import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {MembersItem, membersProps} from '../MembersItem';

interface MembersListProps {
  data: membersProps[];
  showCheckBox?: boolean;
  isAllSelected?: boolean;
  onSelect?: (value: boolean) => void;
  selection?: boolean;
  isEmail?: boolean;
}
export const MembersList: React.FC<MembersListProps> = ({
  data,
  showCheckBox,
  isAllSelected,
  onSelect,
  selection,
  isEmail,
}) => {
  const defaultMember: membersProps = {
    id: 1,
    name: 'Leslie Alexander',
    position: 'Manager',
  };

  const [selectedMember, setSelectedMember] =
    useState<membersProps>(defaultMember);
  // const [selectedMemberIds, setSelectedMemberIds] = useState<Set<number>>(
  //   new Set<number>(),
  // );

  return (
    <FlatList
      data={data}
      renderItem={({item}) => (
        <MembersItem
          item={item}
          showCheckBox={showCheckBox}
          isAllSelected={isAllSelected!}
          selectedMember={selectedMember!}
          onPress={setSelectedMember}
          onSelect={onSelect!}
          selection={selection}
          isEmail={isEmail}
        />
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => <FooterComponent />}
    />
  );
};
