import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {RippleIconButton} from 'components/IconButtons';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
import {Persona} from 'components/Persona';
import {StackItem} from 'components/Stack';
import {SearchTextField} from 'components/TextField';
import {TouchableField} from 'components/TouchableField';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {View} from 'react-native';
import Modal from 'react-native-modal';
import {
  AssignToUsers,
  GetAssignee,
  useLazyGetAssignToCollectionQuery,
} from 'request/AddTask';
import {TaskDetails} from 'request/ManageTask';
import {Stack} from 'stack-container';
import {useAppSelector} from 'store/hooks';
import {Styles} from '../../index.styles';

interface AssigneeTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onAssigneeChange: (value: string) => void;
}
export const AssigneeTaskBody: React.FC<AssigneeTaskBodyProps> = ({
  taskProps,
  isEditable,
  onAssigneeChange,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);
  const [assignTrigger] = useLazyGetAssignToCollectionQuery();

  const [assignToMembersList, setAssignToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();
  const [reassignToMembersList, setReassignToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();

  // const assignToMembersList: membersProps[] | undefined = assignToResponse;
  // const reassignToMembersList: membersProps[] | undefined = assignToResponse;

  const [searchAssignText, setSearchAssignText] = useState('');
  const [searchReassignText, setSearchReassignText] = useState('');

  const [assignToModal, setAssignToModal] = useState<boolean>(false);
  const [reassignToModal, setReAssignToModal] = useState<boolean>(false);

  const [selfAssigned, setSelfAssigned] = useState<boolean>(false);
  const [assignTo, setAssignTo] = useState<
    membersProps | AssignToUsers | GetAssignee
  >();

  const [assigneeName, setAssigneeName] = useState<string | undefined>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reAssignTo, setReAssignTo] = useState<
    membersProps | AssignToUsers | GetAssignee
  >();
  const [designation, setDesignation] = useState<string>();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(
    '',
  );

  useEffect(() => {
    setAssigneeName(taskProps?.assignee?.name);
    setDesignation(taskProps?.assignee?.designation);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskProps?.assignee?._id]);

  const onPressAssignedTo = (
    val: membersProps | AssignToUsers | GetAssignee | undefined,
  ) => {
    // setSelfAssigned(false);
    setAssignTo(val);
    onAssigneeChange(val?._id);
    setAssignToModal(false);
  };
  const onPressReAssignedTo = (
    val: membersProps | AssignToUsers | GetAssignee | undefined,
  ) => {
    // setSelfAssigned(false);
    setReAssignTo(val);
    setReAssignToModal(false);
  };

  useEffect(() => {
    setSelectedCompany(taskProps?.company);
  }, [taskProps]);

  useEffect(() => {
    setAssignToMembersList([]);
    if (selectedCompany?.length || selectedCompany) {
      let obj = {
        searchText: searchAssignText,
        companyId: selectedCompany?._id || selectedCompany,
      };
      assignTrigger(obj).then(res => {
        setAssignToMembersList([]);
        setAssignToMembersList(res.data);
      });
    }
  }, [assignTrigger, searchAssignText, selectedCompany]);

  useEffect(() => {
    setReassignToMembersList([]);
    let obj = {
      searchText: searchReassignText,
      companyId: selectedCompany?._id,
    };
    assignTrigger(obj).then(res => {
      setReassignToMembersList([]);
      setReassignToMembersList(res.data);
    });
  }, [assignTrigger, searchReassignText, selectedCompany]);

  // useEffect(() => {
  //   const ind = assignToMembersList?.findIndex(
  //     x => x._id === taskProps?.assignTo,
  //   );
  //   if (ind! >= 0 && assignToMembersList) {
  //     setSelfAssigned(false);
  //     setAssignTo(assignToMembersList[ind!]);
  //     setAssigneeName(assignToMembersList[ind!].name);
  //     setDesignation(assignToMembersList[ind!]?.role?.type);
  //   } else {
  //     setSelfAssigned(true);
  //     setAssignTo({
  //       _id: '617b996a23524140cd3f0530',
  //       profilePic:
  //         'https://i.picsum.photos/id/1005/5760/3840.jpg?hmac=2acSJCOwz9q_dKtDZdSB-OIK1HUcwBeXco_RMMTUgfY',
  //       name: 'Leslie Alexander',
  //       position: 'Manager',
  //     });
  //     setAssigneeName('Leslie Alexander');
  //     setDesignation('Manager');
  //   }
  //   // setAssigneeName(taskProps?.assignTo);
  // }, [assignToMembersList, taskProps?.assignTo]);

  useEffect(() => {
    if (taskProps?.assignee && taskProps.assignee._id !== userData?._id) {
      setSelfAssigned(false);
      setAssignTo(taskProps?.assignee);
      setAssigneeName(taskProps?.assignee?.name);
      setDesignation(taskProps?.assignee?.role?.type);
    } else {
      setSelfAssigned(true);
      setAssignTo({
        _id: userData?._id,
        profilePic: userData?.profileUrl,
        name: userData?.name,
        position: userData?.role?.type,
      });
      setAssigneeName(userData?.name);
      setDesignation(userData?.role?.type);
    }
    // setAssigneeName(taskProps?.assignTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignToMembersList, isEditable]);

  const RenderAssignToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        {selfAssigned ? (
          <Stack horizontal verticalAlign="center">
            <Persona
              name={userData?.name}
              image={userData?.profileUrl}
              size={38}
            />
            <Stack style={styles.view}>
              <TextView weight="medium" variant={FontSizes.regular} truncate>
                {userData?.name}
              </TextView>
            </Stack>
          </Stack>
        ) : (
          <MemberItem
            item={assignTo}
            onPress={() => {
              setAssignToModal(true);
            }}
            isDividerFalse
          />
        )}
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <>
      {!isEditable ? (
        <StackItem childrenGap={5} style={styles.openBox}>
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:assigneeName')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {assigneeName}
          </TextView>
          <Divider />
          <TextView
            weight="regular"
            variant={FontSizes.small}
            style={styles.label}>
            {t('taskDetails:designation')}
          </TextView>
          <TextView
            weight="regular"
            variant={FontSizes.regular}
            style={styles.value}>
            {designation}
          </TextView>
        </StackItem>
      ) : (
        (taskProps?.taskStatus === 'Assigned' ||
          taskProps?.taskStatus === 'Rejected') && (
          <>
            {/* <StackItem childrenGap={10} spaceBelow={16}> */}
            <Stack spaceBelow={16}>
              <TouchableField
                label={t('taskDetails:assigneeName')}
                icon={'arrow_expand_more'}
                RenderView={RenderAssignToView}
                onPress={() => {
                  setAssignToModal(true);
                }}
                isError={!assignTo?.name}
                data={assignTo}
                placeholder={
                  assignTo ? undefined : t('addTask:assigneePlaceholder')
                }
              />
              {!assignTo?.name && (
                <TextView
                  weight="regular"
                  variant={FontSizes.small}
                  style={styles.error}>
                  {t('addTask:assigneeError')}
                </TextView>
              )}
            </Stack>
            {/* {taskProps?.status !== 'Assigned' && (
            <TouchableField
              label={t('taskDetails:reAssignTo')}
              icon={'arrow_expand_more'}
              RenderView={RenderAssignToView}
              onPress={() => {
                setReAssignToModal(true);
              }}
              data={reAssignTo}
              placeholder={
                reAssignTo ? undefined : t('addTask:assigneePlaceholder')
              }
            />
          )} */}
            {/* <TextField
            label={t('taskDetails:designation')}
            placeholder={designation}
            onChangeText={setDesignation}
            value={designation}
          /> */}
            {/* </StackItem> */}
          </>
        )
      )}
      {assignToModal && (
        <Modal
          avoidKeyboard
          isVisible={assignToModal}
          style={styles.bottomModal}
          onBackdropPress={() => setAssignToModal(false)}>
          <View style={styles.bottomModalView}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              spacing={16}>
              <Stack>
                <TextView weight="bold" variant={FontSizes.large}>
                  Assign to
                </TextView>
              </Stack>
              <RippleIconButton
                name="close"
                size={22}
                onPress={() => setAssignToModal(false)}
              />
            </Stack>
            <Stack spacing={16} style={styles.attachmentView}>
              <SearchTextField
                showBorder
                value={searchAssignText}
                setSearchValue={setSearchAssignText}
              />
            </Stack>
            {/* <ScrollView> */}
            <Stack spacing={16}>
              <MemberList
                data={assignToMembersList!}
                onPress={val => {
                  setSelfAssigned(false);
                  onPressAssignedTo(val);
                }}
                onPressSelf={val => {
                  setSelfAssigned(true);
                  onPressAssignedTo(val);
                  setAssignToModal(false);
                }}
                isAssignTo
              />
            </Stack>
            {/* </ScrollView> */}
          </View>
        </Modal>
      )}
      {reassignToModal && (
        <Modal
          isVisible={reassignToModal}
          style={styles.bottomModal}
          onBackdropPress={() => setReAssignToModal(false)}>
          <View style={styles.bottomModalView}>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              spacing={16}>
              <Stack>
                <TextView weight="bold" variant={FontSizes.large}>
                  Assign to
                </TextView>
              </Stack>
              <RippleIconButton
                name="close"
                size={22}
                onPress={() => setReAssignToModal(false)}
              />
            </Stack>
            <Stack spacing={16} style={styles.attachmentView}>
              <SearchTextField
                showBorder
                value={searchReassignText}
                setSearchValue={setSearchReassignText}
              />
            </Stack>
            {/* <ScrollView> */}
            <Stack spacing={16}>
              <MemberList
                data={reassignToMembersList!}
                onPress={val => {
                  setSelfAssigned(false);
                  onPressAssignedTo(val);
                }}
                onPressSelf={val => {
                  setSelfAssigned(true);
                  onPressReAssignedTo(val);
                  setReAssignToModal(false);
                }}
                isAssignTo
              />
            </Stack>
            {/* </ScrollView> */}
          </View>
        </Modal>
      )}
    </>
  );
};
