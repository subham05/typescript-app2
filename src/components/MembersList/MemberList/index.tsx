import {FontSizes} from 'common/theme/font';
import {
  globalScreenHeight,
  globalScreenWidth,
} from 'common/utils/ScreenDimensions/index';
import {Divider} from 'components/Divider';
import EmptyComponent from 'components/EmptyComponent';
import {FooterComponent} from 'components/FooterComponent';
import {membersProps} from 'components/Members/MembersItem';
import {Persona} from 'components/Persona';
import {TextView} from 'components/TextView';
import React from 'react';
import {FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {ReportToResponseList} from 'request/AddManager/ReportToResponseData';
import {requestToData} from 'screens/CreateContact/types';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {MemberItem} from '../MemberItem';

// const userImage =
//   'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY';

interface MemberListProps {
  data: membersProps[] | requestToData[] | ReportToResponseList[];
  isEmail?: boolean;
  onPress?: (
    val: membersProps | requestToData | ReportToResponseList | undefined,
  ) => void;
  onPressSelf?: (val: membersProps | undefined) => void;
  isAssignTo?: boolean;
  reminder?: boolean;
  hideSelf?: boolean;
  onNextPage?: () => void;
  isSuccess?: boolean;
  isFetching?: boolean;
  isLoadingReportTo?: boolean;
}
export const MemberList: React.FC<MemberListProps> = ({
  data,
  isEmail,
  isAssignTo,
  onPress,
  onPressSelf,
  reminder,
  hideSelf,
  onNextPage,
  isSuccess = true,
  isFetching = false,
  isLoadingReportTo,
}) => {
  const ListEmptyComponent = () => (
    <EmptyComponent
      isVisible={!data?.length && isSuccess && !isFetching}
      containerStyle={styles.emptyComponent}
    />
  );
  const {userData} = useAppSelector(state => state.formanagement);
  const assignSelfObject = {
    _id: userData?._id,
    profilePic: userData?.profileUrl,
    name: userData?.name,
    position: userData?.designation,
  };
  const reportSelfObject = {
    _id: userData?._id,
    profilePic: userData?.profileUrl,
    name: userData?.name,
    position: userData?.designation,
  };
  const listHeaderComponent = () => {
    const onTouchedSelf = () => {
      onPressSelf!(
        reminder
          ? assignSelfObject
          : isAssignTo
          ? assignSelfObject
          : reportSelfObject,
      );
    };
    return (
      <>
        {!hideSelf && (
          <TouchableOpacity onPress={onTouchedSelf}>
            <Stack spacing={10} spaceBelow={10}>
              <Stack horizontal verticalAlign="center">
                <Persona name={userData?.name} image={userData?.profileUrl} />
                <Stack style={styles.view}>
                  <TextView
                    weight="semibold"
                    variant={FontSizes.regular}
                    truncate>
                    {reminder
                      ? 'Self'
                      : isAssignTo
                      ? 'Assign to me'
                      : 'Report to me'}
                  </TextView>
                </Stack>
              </Stack>
            </Stack>
          </TouchableOpacity>
        )}
        {!hideSelf && <Divider />}
      </>
    );
  };
  return (
    <FlatList
      data={data}
      contentContainerStyle={styles.bottomStyle}
      keyboardShouldPersistTaps="handled"
      ListHeaderComponent={listHeaderComponent}
      renderItem={({item}) => (
        <MemberItem item={item} isEmail={isEmail} onPress={onPress} />
      )}
      keyExtractor={(_, index) => index.toString()}
      ListFooterComponent={() => (
        <FooterComponent isLoading={isLoadingReportTo} />
      )}
      ListEmptyComponent={ListEmptyComponent}
      onEndReached={() => onNextPage?.()}
    />
  );
};

const styles = StyleSheet.create({
  view: {
    marginLeft: 10,
    marginTop: 3,
    // width: '75%',
  },
  bottomStyle: {
    paddingBottom: globalScreenWidth / 8,
  },
  emptyComponent: {
    alignItems: 'center',
    height: globalScreenHeight / 8,
    justifyContent: 'center',
  },
});
