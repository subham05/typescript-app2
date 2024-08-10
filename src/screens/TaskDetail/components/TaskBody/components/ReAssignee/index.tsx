import {FontSizes} from 'common/theme/font';
import {TextView} from 'components';
import {Divider} from 'components/Divider';
import {RippleIconButton} from 'components/IconButtons';
import {membersProps} from 'components/Members/MembersItem';
import {MemberItem} from 'components/MembersList/MemberItem';
import {MemberList} from 'components/MembersList/MemberList';
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
import {colors} from 'common/theme/colors';

interface ReAssigneeTaskBodyProps {
  taskProps?: TaskDetails;
  isEditable: boolean | undefined;
  onReAssigneeChange: (value: string | undefined) => void;
}
export const ReAssigneeTaskBody: React.FC<ReAssigneeTaskBodyProps> = ({
  taskProps,
  isEditable,
  onReAssigneeChange,
}) => {
  const {t} = useTranslation();
  const {userData} = useAppSelector(state => state.formanagement);
  const [assignTrigger] = useLazyGetAssignToCollectionQuery();

  const [assignToMembersList, setAssignToMembersList] = useState<
    membersProps[] | AssignToUsers[] | undefined
  >();

  const [searchAssignText, setSearchAssignText] = useState('');

  const [assignToModal, setAssignToModal] = useState<boolean>(false);

  const [assignTo, setAssignTo] = useState<
    membersProps | AssignToUsers | GetAssignee
  >();

  const [assigneeName, setAssigneeName] = useState<string | undefined>();

  const [designation, setDesignation] = useState<string>();
  const [selectedCompany, setSelectedCompany] = useState<string | undefined>(
    '',
  );

  useEffect(() => {
    setAssigneeName(taskProps?.reassignTo?.name);
    setDesignation(taskProps?.reassignTo?.role?.type);
    setAssignTo(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskProps?.reassignTo?._id]);

  const onPressAssignedTo = (
    val: membersProps | AssignToUsers | GetAssignee | undefined,
  ) => {
    // setSelfAssigned(false);
    setAssignTo(val);
    onReAssigneeChange(val?._id);
    setAssignToModal(false);
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
    if (taskProps?.reassignee && taskProps.reassignee._id !== userData?._id) {
      setAssignTo(taskProps?.reassignee);
      setAssigneeName(taskProps?.reassignee?.name);
      setDesignation(taskProps?.reassignee?.role?.type);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignToMembersList, isEditable]);

  const RenderAssignToView = () => {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <MemberItem
          item={assignTo}
          onPress={() => {
            setAssignToModal(true);
          }}
          isDividerFalse
        />
      </Stack>
    );
  };

  const styles = Styles();
  return (
    <>
      {!isEditable && assigneeName?.length ? (
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
        taskProps?.canReassigned && (
          <>
            <Stack>
              <TouchableField
                // label={t('taskDetails:assigneeName')}
                icon={assignTo ? 'close' : 'arrow_expand_more'}
                iconColor={colors.black}
                RenderView={RenderAssignToView}
                onPress={() => {
                  setAssignToModal(true);
                }}
                // isError={!assignTo?.name}
                data={assignTo}
                placeholder={
                  assignTo ? undefined : t('addTask:assigneePlaceholder')
                }
                onPressClose={() => {
                  setAssignTo(undefined);
                  onReAssigneeChange(undefined);
                }}
              />
            </Stack>
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
                  Reassign to
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
                  onPressAssignedTo(val);
                }}
                onPressSelf={val => {
                  onPressAssignedTo(val);
                  setAssignToModal(false);
                }}
                isAssignTo
                hideSelf
              />
            </Stack>
            {/* </ScrollView> */}
          </View>
        </Modal>
      )}
    </>
  );
};
